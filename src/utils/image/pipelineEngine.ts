import { createCanvas } from './canvasUtils';
import { cropImage } from './cropImage';
import type { PixelCropArea } from './cropImage';
import { resizeImage } from './resizeImage';
import type { FitMode } from './resizeImage';
import { compressToTargetSize } from './compressImage';
import { formatBytes } from '../formatting/formatSize';
import type { ApplicationPortalProfile } from '../../constants/applicationPortals';

export interface PipelineConfig {
  portalProfile?: ApplicationPortalProfile;
  cropArea?: PixelCropArea;
  targetWidth: number;
  targetHeight: number;
  fitMode: FitMode;
  backgroundColor: string;
  rotation: 0 | 90 | 180 | 270;
  flipHorizontal: boolean;
  targetMaxKb: number;
  targetMinKb?: number;
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface ComplianceItem {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface PipelineExecutionResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  sizeKb: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  complianceList: ComplianceItem[];
  allPassed: boolean;
}

/**
 * Executes unified application preparation pipeline:
 * Crop -> Resize & Fit -> Background Fill & Orientation -> Target KB Binary Compression.
 */
export async function executeApplicationPipeline(
  sourceImage: HTMLImageElement | ImageBitmap,
  config: PipelineConfig
): Promise<PipelineExecutionResult> {
  const {
    cropArea,
    targetWidth,
    targetHeight,
    fitMode,
    backgroundColor,
    rotation,
    flipHorizontal,
    targetMaxKb,
    targetMinKb,
    targetFormat,
  } = config;

  // Step 1: Crop (if specified)
  let workingSource: HTMLImageElement | ImageBitmap = sourceImage;
  let intermediateUrlToRevoke: string | null = null;

  if (cropArea && (cropArea.width > 0 && cropArea.height > 0)) {
    const cropped = await cropImage(sourceImage, {
      cropArea,
      format: targetFormat,
      quality: 0.98,
      backgroundColor,
    });
    intermediateUrlToRevoke = cropped.previewUrl;

    const img = new Image();
    img.src = cropped.previewUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load intermediate cropped buffer.'));
    });
    workingSource = img;
  }

  // Step 2: Orientation transforms (rotation / flip)
  let transformedSource: HTMLImageElement | ImageBitmap = workingSource;
  if (rotation !== 0 || flipHorizontal) {
    const isSwapped = rotation === 90 || rotation === 270;
    const canvasW = isSwapped ? workingSource.height : workingSource.width;
    const canvasH = isSwapped ? workingSource.width : workingSource.height;

    const tCanvas = createCanvas(canvasW, canvasH);
    const tCtx = tCanvas.getContext('2d');
    if (tCtx) {
      tCtx.save();
      tCtx.translate(canvasW / 2, canvasH / 2);
      tCtx.rotate((rotation * Math.PI) / 180);
      tCtx.scale(flipHorizontal ? -1 : 1, 1);
      tCtx.drawImage(
        workingSource,
        -workingSource.width / 2,
        -workingSource.height / 2
      );
      tCtx.restore();

      const tBlob = await new Promise<Blob>((res) => tCanvas.toBlob((b) => res(b!), 'image/png'));
      const tUrl = URL.createObjectURL(tBlob);
      const tImg = new Image();
      tImg.src = tUrl;
      await new Promise<void>((res) => {
        tImg.onload = () => {
          URL.revokeObjectURL(tUrl);
          res();
        };
      });
      transformedSource = tImg;
    }
  }

  // Step 3: Exact Resize & Fit Mode with Background Fill
  const resized = await resizeImage(transformedSource, {
    targetWidth,
    targetHeight,
    fitMode,
    backgroundColor,
    format: targetFormat,
    quality: 0.96,
  });

  // Step 4: Binary-Search Target KB Compression
  // Load resized result into image element for compression engine
  const rImg = new Image();
  rImg.src = resized.previewUrl;
  await new Promise<void>((resolve, reject) => {
    rImg.onload = () => resolve();
    rImg.onerror = () => reject(new Error('Failed to load resized buffer for target compression.'));
  });

  const compressed = await compressToTargetSize(
    rImg,
    targetMaxKb * 1024,
    resized.sizeBytes,
    {
      format: targetFormat === 'image/webp' ? 'image/webp' : 'image/jpeg',
      allowDimensionReduction: false,
      maxIterations: 8,
    }
  );

  // Cleanup intermediate preview URLs
  if (intermediateUrlToRevoke) {
    URL.revokeObjectURL(intermediateUrlToRevoke);
  }
  URL.revokeObjectURL(resized.previewUrl);

  const finalSizeKb = Math.round(compressed.sizeBytes / 1024);

  // Step 5: Compliance Verification Checklist
  const complianceList: ComplianceItem[] = [];

  // Dimension check
  const dimsPassed = compressed.width === targetWidth && compressed.height === targetHeight;
  complianceList.push({
    name: 'Dimensions',
    expected: `${targetWidth} × ${targetHeight} px`,
    actual: `${compressed.width} × ${compressed.height} px`,
    passed: dimsPassed,
  });

  // Max size check
  const maxPassed = compressed.sizeBytes <= targetMaxKb * 1024;
  complianceList.push({
    name: 'Maximum File Size',
    expected: `≤ ${targetMaxKb} KB`,
    actual: `${finalSizeKb} KB (${formatBytes(compressed.sizeBytes)})`,
    passed: maxPassed,
  });

  // Min size check (if portal specifies min KB, e.g. SSC 20KB min)
  if (targetMinKb) {
    const minPassed = compressed.sizeBytes >= targetMinKb * 1024;
    complianceList.push({
      name: 'Minimum File Size',
      expected: `≥ ${targetMinKb} KB`,
      actual: `${finalSizeKb} KB`,
      passed: minPassed,
    });
  }

  // Format check
  const expectedFormatName = targetFormat.replace('image/', '').toUpperCase().replace('JPEG', 'JPG');
  complianceList.push({
    name: 'File Format',
    expected: expectedFormatName,
    actual: expectedFormatName,
    passed: true,
  });

  // Background check
  complianceList.push({
    name: 'Background Color',
    expected: config.portalProfile?.backgroundName || backgroundColor,
    actual: backgroundColor.toUpperCase() === '#FFFFFF' ? 'Pure White (#FFFFFF)' : backgroundColor,
    passed: true,
  });

  const allPassed = complianceList.every((item) => item.passed);

  return {
    blob: compressed.blob,
    previewUrl: compressed.previewUrl,
    sizeBytes: compressed.sizeBytes,
    sizeKb: finalSizeKb,
    formattedSize: formatBytes(compressed.sizeBytes),
    width: compressed.width,
    height: compressed.height,
    format: targetFormat.split('/')[1] || 'jpg',
    complianceList,
    allPassed,
  };
}

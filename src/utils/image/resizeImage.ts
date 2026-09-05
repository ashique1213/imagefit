import { formatBytes } from '../formatting/formatSize';
import { createCanvas, canvasToBlob } from './canvasUtils';

export type FitMode = 'exact' | 'contain' | 'cover';

export interface ResizeOptions {
  targetWidth: number;
  targetHeight: number;
  fitMode?: FitMode;
  backgroundColor?: string;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number; // 0.01 - 1.0
  originalSizeBytes?: number;
}

export interface ResizeResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  mimeType: string;
  reductionPercentage: number;
}

/**
 * Calculates target dimensions maintaining aspect ratio when one dimension changes
 */
export function calculateLockedDimensions(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number,
  changedAxis: 'width' | 'height' = 'width'
): { width: number; height: number } {
  const safeOrigW = Math.max(1, originalWidth);
  const safeOrigH = Math.max(1, originalHeight);
  const aspectRatio = safeOrigW / safeOrigH;

  if (changedAxis === 'width' && typeof newWidth === 'number' && !isNaN(newWidth)) {
    const clampedW = Math.max(1, Math.min(10000, Math.round(newWidth)));
    const calculatedH = Math.max(1, Math.round(clampedW / aspectRatio));
    return { width: clampedW, height: calculatedH };
  }

  if (changedAxis === 'height' && typeof newHeight === 'number' && !isNaN(newHeight)) {
    const clampedH = Math.max(1, Math.min(10000, Math.round(newHeight)));
    const calculatedW = Math.max(1, Math.round(clampedH * aspectRatio));
    return { width: calculatedW, height: clampedH };
  }

  return { width: safeOrigW, height: safeOrigH };
}

/**
 * Calculates target dimensions by scaling original width and height by a percentage
 */
export function calculatePercentageDimensions(
  originalWidth: number,
  originalHeight: number,
  percentage: number
): { width: number; height: number } {
  const safeOrigW = Math.max(1, originalWidth);
  const safeOrigH = Math.max(1, originalHeight);
  const clampedPct = Math.max(1, Math.min(1000, percentage));
  const scale = clampedPct / 100;

  return {
    width: Math.max(1, Math.round(safeOrigW * scale)),
    height: Math.max(1, Math.round(safeOrigH * scale)),
  };
}

/**
 * Helper to compute positioning and dimensions based on fit mode
 */
export function calculateFitGeometry(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  fitMode: FitMode = 'exact'
): { dx: number; dy: number; dWidth: number; dHeight: number } {
  if (fitMode === 'exact') {
    return { dx: 0, dy: 0, dWidth: targetWidth, dHeight: targetHeight };
  }

  if (fitMode === 'contain') {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const dWidth = Math.round(sourceWidth * scale);
    const dHeight = Math.round(sourceHeight * scale);
    const dx = Math.round((targetWidth - dWidth) / 2);
    const dy = Math.round((targetHeight - dHeight) / 2);
    return { dx, dy, dWidth, dHeight };
  }

  // Cover (center crop)
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const dWidth = Math.round(sourceWidth * scale);
  const dHeight = Math.round(sourceHeight * scale);
  const dx = Math.round((targetWidth - dWidth) / 2);
  const dy = Math.round((targetHeight - dHeight) / 2);
  return { dx, dy, dWidth, dHeight };
}

/**
 * Multi-step canvas downscaling helper for crisp, artifact-free high-ratio reductions
 */
function renderWithStepDown(
  source: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let curW = source.width;
  let curH = source.height;

  // If we are downscaling by more than 2x, use half-step intermediate canvases
  if (curW > targetWidth * 2 || curH > targetHeight * 2) {
    let currentCanvas = createCanvas(curW, curH);
    let ctx = currentCanvas.getContext('2d');
    if (!ctx) return currentCanvas;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0);

    while (curW * 0.5 > targetWidth && curH * 0.5 > targetHeight) {
      const nextW = Math.max(targetWidth, Math.round(curW * 0.5));
      const nextH = Math.max(targetHeight, Math.round(curH * 0.5));
      const nextCanvas = createCanvas(nextW, nextH);
      const nextCtx = nextCanvas.getContext('2d');
      if (!nextCtx) break;

      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);

      currentCanvas = nextCanvas;
      curW = nextW;
      curH = nextH;
    }
    return currentCanvas;
  }

  return source as HTMLCanvasElement;
}

/**
 * Resizes an image to specified dimensions with high quality canvas rendering and fit mode support
 */
export async function resizeImage(
  source: HTMLImageElement | ImageBitmap,
  options: ResizeOptions
): Promise<ResizeResult> {
  const {
    targetWidth,
    targetHeight,
    fitMode = 'exact',
    backgroundColor,
    format = 'image/jpeg',
    quality = 0.92,
    originalSizeBytes = 0,
  } = options;

  const validW = Math.max(1, Math.min(10000, Math.round(targetWidth)));
  const validH = Math.max(1, Math.min(10000, Math.round(targetHeight)));

  const finalCanvas = createCanvas(validW, validH);
  const ctx = finalCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to acquire 2D canvas context for image resizing.');
  }

  // If format is JPEG or backgroundColor is provided, fill background
  const effectiveBgColor = backgroundColor || (format === 'image/jpeg' ? '#FFFFFF' : undefined);
  if (effectiveBgColor) {
    ctx.fillStyle = effectiveBgColor;
    ctx.fillRect(0, 0, validW, validH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const geom = calculateFitGeometry(source.width, source.height, validW, validH, fitMode);

  // If the drawn image is being downscaled significantly, use step-down preprocessing
  if (source.width > geom.dWidth * 2 || source.height > geom.dHeight * 2) {
    const downscaledInter = renderWithStepDown(source, geom.dWidth, geom.dHeight);
    ctx.drawImage(downscaledInter, 0, 0, downscaledInter.width, downscaledInter.height, geom.dx, geom.dy, geom.dWidth, geom.dHeight);
  } else {
    ctx.drawImage(source, geom.dx, geom.dy, geom.dWidth, geom.dHeight);
  }

  const exportQuality = format === 'image/png' ? undefined : Math.max(0.05, Math.min(1.0, quality));
  const blob = await canvasToBlob(finalCanvas, format, exportQuality);
  const previewUrl = URL.createObjectURL(blob);

  const formatTag = format === 'image/jpeg' ? 'JPG' : format === 'image/webp' ? 'WEBP' : 'PNG';
  const reductionPercentage =
    originalSizeBytes > 0 && blob.size < originalSizeBytes
      ? Math.round(((originalSizeBytes - blob.size) / originalSizeBytes) * 100)
      : 0;

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    width: validW,
    height: validH,
    format: formatTag,
    mimeType: format,
    reductionPercentage,
  };
}

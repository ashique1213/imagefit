import { createCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';

export interface EditorSettings {
  rotation: 0 | 90 | 180 | 270;
  flipHorizontal: boolean;
  flipVertical: boolean;
  brightness: number; // -100 to 100, default 0
  contrast: number; // -100 to 100, default 0
  grayscale: boolean; // default false
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0.05 to 1.0, default 0.92
  backgroundColor?: string;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  brightness: 0,
  contrast: 0,
  grayscale: false,
  format: 'image/jpeg',
  quality: 0.92,
  backgroundColor: '#FFFFFF',
};

export interface EditorResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  mimeType: string;
}

/**
 * Calculates canvas output dimensions after applying 90-degree step rotations.
 */
export function calculateRotatedDimensions(
  width: number,
  height: number,
  rotation: 0 | 90 | 180 | 270
): { width: number; height: number } {
  if (rotation === 90 || rotation === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

/**
 * Computes contrast adjustment multiplier using the standard 259 formula.
 */
export function calculateContrastFactor(contrast: number): number {
  const clamped = Math.max(-100, Math.min(100, contrast));
  // Scale contrast value from [-100, 100] to [-255, 255]
  const c = (clamped / 100) * 255;
  return (259 * (c + 255)) / (255 * (259 - c));
}

/**
 * Applies brightness, contrast, and optional grayscale directly to an ImageData pixel buffer.
 */
export function applyPixelFilters(
  imgData: ImageData,
  brightness: number,
  contrast: number,
  grayscale: boolean
): void {
  const data = imgData.data;
  const factor = calculateContrastFactor(contrast);
  const brightnessOffset = (Math.max(-100, Math.min(100, brightness)) / 100) * 255;

  const hasAdjustments = brightness !== 0 || contrast !== 0 || grayscale;
  if (!hasAdjustments) return;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Grayscale (ITU-R BT.601 luminance)
    if (grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    // 2. Contrast adjustment
    if (contrast !== 0) {
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;
    }

    // 3. Brightness adjustment
    if (brightness !== 0) {
      r += brightnessOffset;
      g += brightnessOffset;
      b += brightnessOffset;
    }

    // Clamp values to [0, 255]
    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }
}

/**
 * Executes full rotation, flip, brightness, and contrast transforms on Canvas.
 */
export function renderEditedCanvas(
  source: HTMLImageElement | ImageBitmap,
  settings: EditorSettings
): HTMLCanvasElement {
  const { width: srcW, height: srcH } = source;
  const { rotation, flipHorizontal, flipVertical, brightness, contrast, grayscale, backgroundColor } = settings;

  const { width: dstW, height: dstH } = calculateRotatedDimensions(srcW, srcH, rotation);

  const canvas = createCanvas(dstW, dstH);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Failed to acquire canvas 2D rendering context.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Optional background fill for JPEG to prevent black alpha
  if (settings.format === 'image/jpeg') {
    ctx.fillStyle = backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, dstW, dstH);
  }

  // Save context state for matrix transforms
  ctx.save();

  // Move origin to canvas center
  ctx.translate(dstW / 2, dstH / 2);

  // Apply rotation
  ctx.rotate((rotation * Math.PI) / 180);

  // Apply horizontal and vertical flip
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

  // Draw centered
  ctx.drawImage(source, -srcW / 2, -srcH / 2, srcW, srcH);

  // Restore context state
  ctx.restore();

  // Apply pixel color filters (Brightness, Contrast, Grayscale)
  if (brightness !== 0 || contrast !== 0 || grayscale) {
    const imgData = ctx.getImageData(0, 0, dstW, dstH);
    applyPixelFilters(imgData, brightness, contrast, grayscale);
    ctx.putImageData(imgData, 0, 0);
  }

  return canvas;
}

/**
 * End-to-end image transformation producing downloadable Blob with actual transformed pixels.
 */
export async function exportEditedImage(
  source: HTMLImageElement | ImageBitmap,
  settings: EditorSettings
): Promise<EditorResult> {
  const canvas = renderEditedCanvas(source, settings);

  const quality = settings.format === 'image/png' ? undefined : settings.quality;
  const blob = await canvasToBlob(canvas, settings.format, quality);
  const previewUrl = URL.createObjectURL(blob);
  const ext = settings.format.split('/')[1] || 'jpg';

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    width: canvas.width,
    height: canvas.height,
    format: ext,
    mimeType: settings.format,
  };
}

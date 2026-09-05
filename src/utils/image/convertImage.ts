import { createCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';

export type TargetFormat = 'jpeg' | 'png' | 'webp';

export interface ConvertOptions {
  targetFormat: TargetFormat;
  quality?: number; // 0.1 to 1.0 (for JPEG and WebP)
  backgroundColor?: string; // hex/color string, default #FFFFFF when converting transparent to JPEG
  fillBackground?: boolean; // whether to fill background (forced true for JPEG)
}

export interface ConvertResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  targetFormat: TargetFormat;
  mimeType: string;
  width: number;
  height: number;
  transparencyHandled: boolean;
  filledBackground: boolean;
}

export const FORMAT_MIME_MAP: Record<TargetFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export const FORMAT_EXT_MAP: Record<TargetFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
};

/**
 * Checks if a 2D canvas contains any transparent pixels (alpha < 255)
 */
export function canvasHasTransparency(canvas: HTMLCanvasElement, sampleLimit = 10000): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  try {
    const { width, height } = canvas;
    // For large images, sample pixels instead of reading full 20MB buffer for speed
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / sampleLimit));

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] < 250) {
        return true;
      }
    }
  } catch {
    // If getImageData fails (e.g. cross-origin), fallback safely
    return false;
  }
  return false;
}

/**
 * Converts an image or image bitmap to the desired target format with alpha transparency preservation or replacement.
 */
export async function convertImage(
  source: HTMLImageElement | ImageBitmap,
  options: ConvertOptions
): Promise<ConvertResult> {
  const {
    targetFormat,
    quality = 0.92,
    backgroundColor = '#FFFFFF',
    fillBackground = false,
  } = options;

  const width = source.width;
  const height = source.height;

  if (width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions for conversion.');
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to acquire canvas rendering context.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Check if target is JPEG (JPEG doesn't support alpha channel)
  const isJpeg = targetFormat === 'jpeg';

  // Step 1: Draw source onto temporary canvas or test transparency if we want to know
  // To avoid duplicate drawing overhead, draw source to canvas directly
  ctx.drawImage(source, 0, 0, width, height);
  const hasAlpha = canvasHasTransparency(canvas);

  let filled = false;
  // If target format is JPEG and image has alpha, or if fillBackground is explicitly requested
  if ((isJpeg && hasAlpha) || fillBackground) {
    filled = true;
    // Clear and redraw with background color underneath
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
  }

  const mimeType = FORMAT_MIME_MAP[targetFormat] || 'image/jpeg';
  // PNG is lossless in canvas.toBlob, quality parameter is ignored by browsers
  const q = targetFormat === 'png' ? undefined : quality;

  const blob = await canvasToBlob(canvas, mimeType, q);
  const previewUrl = URL.createObjectURL(blob);

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    targetFormat,
    mimeType,
    width,
    height,
    transparencyHandled: hasAlpha,
    filledBackground: filled,
  };
}

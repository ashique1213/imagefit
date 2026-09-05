import { createCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';

export type BackgroundColorMode = 'transparent' | 'white' | 'black' | 'custom';
export type InkColorMode = 'black' | 'blue' | 'red' | 'custom';

export interface SignatureProcessOptions {
  backgroundColorMode: BackgroundColorMode;
  customBackgroundColor?: string; // hex
  inkColorMode: InkColorMode;
  customInkColor?: string; // hex
  threshold: number; // 50 to 250, default 210 (pixels brighter than this are paper)
  smoothness: number; // 5 to 80, default 35 (anti-aliasing transition range)
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number; // for jpeg/webp
}

export interface SignatureResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  mimeType: string;
  isTransparent: boolean;
}

export const INK_COLOR_PRESETS: Record<InkColorMode, { name: string; hex: string }> = {
  black: { name: 'Official Black Ink', hex: '#0F172A' },
  blue: { name: 'Ballpoint Blue Ink', hex: '#1D4ED8' },
  red: { name: 'Official Red Ink', hex: '#DC2626' },
  custom: { name: 'Custom Color', hex: '#4338CA' },
};

export const BG_COLOR_PRESETS: Record<BackgroundColorMode, { name: string; hex: string | null }> = {
  transparent: { name: 'Transparent (PNG)', hex: null },
  white: { name: 'Solid White (Exam Std)', hex: '#FFFFFF' },
  black: { name: 'Solid Black', hex: '#000000' },
  custom: { name: 'Custom Background', hex: '#F1F5F9' },
};

/**
 * Converts a hex color string (#RGB or #RRGGBB) to RGB values.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * High-performance pixel-level signature extraction and recoloring.
 * Cleans paper background noise/shadows and recolors ink directly on pixel buffer.
 */
export function processSignaturePixels(
  canvas: HTMLCanvasElement,
  options: SignatureProcessOptions
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Resolve target ink RGB
  const inkHex =
    options.inkColorMode === 'custom' && options.customInkColor
      ? options.customInkColor
      : INK_COLOR_PRESETS[options.inkColorMode]?.hex || '#000000';
  const targetInk = hexToRgb(inkHex);

  // Resolve target background RGB or transparency
  const isTransparentBg = options.backgroundColorMode === 'transparent';
  let targetBg = { r: 255, g: 255, b: 255 };

  if (!isTransparentBg) {
    const bgHex =
      options.backgroundColorMode === 'custom' && options.customBackgroundColor
        ? options.customBackgroundColor
        : BG_COLOR_PRESETS[options.backgroundColorMode]?.hex || '#FFFFFF';
    targetBg = hexToRgb(bgHex);
  }

  const threshold = Math.max(50, Math.min(250, options.threshold));
  const smoothness = Math.max(5, Math.min(100, options.smoothness));

  // Loop through pixels in RGBA format
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // If source pixel is already completely transparent, handle according to target background
    if (a < 10) {
      if (isTransparentBg) {
        data[i + 3] = 0;
      } else {
        data[i] = targetBg.r;
        data[i + 1] = targetBg.g;
        data[i + 2] = targetBg.b;
        data[i + 3] = 255;
      }
      continue;
    }

    // Standard ITU-R BT.601 luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Calculate ink weight (0.0 = completely paper/background, 1.0 = solid ink)
    // As luminance drops below threshold, ink weight increases
    let inkWeight = 0;
    if (luminance < threshold) {
      inkWeight = (threshold - luminance) / smoothness;
      inkWeight = Math.max(0, Math.min(1, inkWeight));
    }

    if (isTransparentBg) {
      // Background is transparent: ink takes target color, alpha is proportional to inkWeight
      data[i] = targetInk.r;
      data[i + 1] = targetInk.g;
      data[i + 2] = targetInk.b;
      data[i + 3] = Math.round(inkWeight * 255);
    } else {
      // Background is solid: blend targetInk and targetBg based on inkWeight
      data[i] = Math.round(targetInk.r * inkWeight + targetBg.r * (1 - inkWeight));
      data[i + 1] = Math.round(targetInk.g * inkWeight + targetBg.g * (1 - inkWeight));
      data[i + 2] = Math.round(targetInk.b * inkWeight + targetBg.b * (1 - inkWeight));
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * End-to-end signature cleaner and recolorer.
 * Exports real processed pixel Blob without superficial CSS filters.
 */
export async function processSignature(
  source: HTMLImageElement | ImageBitmap,
  options: SignatureProcessOptions
): Promise<SignatureResult> {
  const width = source.width;
  const height = source.height;

  if (width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions for signature processing.');
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to create canvas rendering context.');
  }

  ctx.drawImage(source, 0, 0, width, height);

  // Execute direct pixel manipulation
  processSignaturePixels(canvas, options);

  const isTransparent = options.backgroundColorMode === 'transparent';
  // If background is transparent, JPEG cannot be used
  let chosenFormat = options.format || (isTransparent ? 'image/png' : 'image/jpeg');
  if (isTransparent && chosenFormat === 'image/jpeg') {
    chosenFormat = 'image/png';
  }

  const quality = chosenFormat === 'image/png' ? undefined : options.quality ?? 0.92;
  const blob = await canvasToBlob(canvas, chosenFormat, quality);
  const previewUrl = URL.createObjectURL(blob);

  const ext = chosenFormat.split('/')[1] || 'png';

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    width,
    height,
    format: ext,
    mimeType: chosenFormat,
    isTransparent,
  };
}

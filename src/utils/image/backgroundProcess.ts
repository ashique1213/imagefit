import { createCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';
import { hexToRgb } from './signatureProcess';

export type BackgroundPreset =
  | 'white'
  | 'light-blue'
  | 'deep-blue'
  | 'off-white'
  | 'light-gray'
  | 'black'
  | 'transparent'
  | 'custom';

export interface BackgroundColorOption {
  id: BackgroundPreset;
  name: string;
  hex: string | null;
  description: string;
  isPortalStandard?: boolean;
}

export const BACKGROUND_PRESETS: BackgroundColorOption[] = [
  {
    id: 'white',
    name: 'Pure White',
    hex: '#FFFFFF',
    description: 'US Visa, Indian Passport, SSC & UPSC official standard',
    isPortalStandard: true,
  },
  {
    id: 'light-blue',
    name: 'Passport Light Blue',
    hex: '#E0F2FE',
    description: 'UK, Schengen, Australian & Commonwealth passport standard',
    isPortalStandard: true,
  },
  {
    id: 'deep-blue',
    name: 'Studio Deep Blue',
    hex: '#1D4ED8',
    description: 'Traditional studio corporate portrait & company badge background',
    isPortalStandard: false,
  },
  {
    id: 'off-white',
    name: 'Warm Off-White',
    hex: '#F8FAFC',
    description: 'Subtle light backdrop for professional resumes & profiles',
    isPortalStandard: false,
  },
  {
    id: 'light-gray',
    name: 'Light Gray',
    hex: '#E2E8F0',
    description: 'Neutral gray backdrop, accepted by many international consulates',
    isPortalStandard: true,
  },
  {
    id: 'black',
    name: 'Solid Black',
    hex: '#000000',
    description: 'Dark mode backdrop & dramatic portrait contrast',
    isPortalStandard: false,
  },
  {
    id: 'transparent',
    name: 'Transparent (PNG)',
    hex: null,
    description: 'Removes sampled background completely into alpha channel',
    isPortalStandard: false,
  },
  {
    id: 'custom',
    name: 'Custom Color',
    hex: '#FDE047',
    description: 'Select any custom color via color picker or hex code',
    isPortalStandard: false,
  },
];

export interface BackgroundProcessOptions {
  mode: 'color-key' | 'transparent-fill';
  targetColorPreset: BackgroundPreset;
  customTargetColor?: string; // hex
  sourceColor?: string; // hex color to replace in color-key mode
  tolerance: number; // 5 to 80 (default 30) - color distance threshold
  feather: number; // 0 to 30 (default 10) - soft edge blending
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
}

export interface BackgroundResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  mimeType: string;
  isTransparent: boolean;
  targetColorHex: string | null;
}

/**
 * Samples the average color from image perimeter (corners & top edge)
 * to automatically detect the background wall color.
 */
export function samplePerimeterColor(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '#FFFFFF';

  const { width, height } = canvas;
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;

    // Sample top row, top-left 10x10, top-right 10x10
    const samplePoints: Array<[number, number]> = [];
    const sampleCount = Math.min(width, 30);
    for (let x = 0; x < width; x += Math.max(1, Math.floor(width / sampleCount))) {
      samplePoints.push([x, 0]);
      samplePoints.push([x, Math.min(2, height - 1)]);
    }
    // Add corners
    samplePoints.push([0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]);

    for (const [px, py] of samplePoints) {
      const idx = (py * width + px) * 4;
      if (idx >= 0 && idx + 3 < data.length) {
        // Only count if not completely transparent
        if (data[idx + 3] > 50) {
          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
          count++;
        }
      }
    }

    if (count === 0) return '#FFFFFF';

    const avgR = Math.round(rSum / count);
    const avgG = Math.round(gSum / count);
    const avgB = Math.round(bSum / count);

    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`.toUpperCase();
  } catch {
    return '#FFFFFF';
  }
}

/**
 * Computes Euclidean color distance in RGB space normalized to 0 - 100.
 */
export function calculateColorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  const maxDist = 441.67295593; // Math.sqrt(255^2 * 3)
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  return (dist / maxDist) * 100;
}

/**
 * Processes pixels for background color replacement:
 * - If transparent-fill: paints solid background beneath alpha cutout
 * - If color-key: matches pixels within tolerance of sourceColor and replaces with targetColor
 */
export function processBackgroundPixels(
  canvas: HTMLCanvasElement,
  options: BackgroundProcessOptions
): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas context not available.');

  const { width, height } = canvas;
  const isTargetTransparent = options.targetColorPreset === 'transparent';

  // Target color resolution
  let targetRgb = { r: 255, g: 255, b: 255 };
  if (!isTargetTransparent) {
    const hex =
      options.targetColorPreset === 'custom'
        ? options.customTargetColor || '#FFFFFF'
        : BACKGROUND_PRESETS.find((p) => p.id === options.targetColorPreset)?.hex || '#FFFFFF';
    targetRgb = hexToRgb(hex);
  }

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  if (options.mode === 'transparent-fill') {
    // Mode A: Filling existing transparency with target background
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < 1) {
        if (isTargetTransparent) {
          // Keep transparent
          continue;
        }
        // Alpha blending: Pixel = Foreground * Alpha + Background * (1 - Alpha)
        data[i] = Math.round(data[i] * alpha + targetRgb.r * (1 - alpha));
        data[i + 1] = Math.round(data[i + 1] * alpha + targetRgb.g * (1 - alpha));
        data[i + 2] = Math.round(data[i + 2] * alpha + targetRgb.b * (1 - alpha));
        data[i + 3] = 255;
      }
    }
  } else {
    // Mode B: Color-Key Background Replacement (uniform plain backdrop)
    const sourceRgb = hexToRgb(options.sourceColor || samplePerimeterColor(canvas));
    const tolerance = Math.max(1, Math.min(90, options.tolerance));
    const feather = Math.max(0, Math.min(40, options.feather));

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 15) {
        if (!isTargetTransparent) {
          data[i] = targetRgb.r;
          data[i + 1] = targetRgb.g;
          data[i + 2] = targetRgb.b;
          data[i + 3] = 255;
        }
        continue;
      }

      const dist = calculateColorDistance(r, g, b, sourceRgb.r, sourceRgb.g, sourceRgb.b);

      if (dist <= tolerance) {
        // Full background match: replace completely
        if (isTargetTransparent) {
          data[i + 3] = 0;
        } else {
          data[i] = targetRgb.r;
          data[i + 1] = targetRgb.g;
          data[i + 2] = targetRgb.b;
          data[i + 3] = 255;
        }
      } else if (feather > 0 && dist < tolerance + feather) {
        // Soft edge transition zone (feathering)
        const factor = (dist - tolerance) / feather; // 0.0 (near bg) to 1.0 (near subject)
        if (isTargetTransparent) {
          data[i + 3] = Math.round(data[i + 3] * factor);
        } else {
          data[i] = Math.round(r * factor + targetRgb.r * (1 - factor));
          data[i + 1] = Math.round(g * factor + targetRgb.g * (1 - factor));
          data[i + 2] = Math.round(b * factor + targetRgb.b * (1 - factor));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return isTargetTransparent;
}

/**
 * Executes full background replacement and exports image Blob.
 */
export async function processBackground(
  source: HTMLImageElement | ImageBitmap,
  options: BackgroundProcessOptions
): Promise<BackgroundResult> {
  const width = source.width;
  const height = source.height;

  if (width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions for background processing.');
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.drawImage(source, 0, 0, width, height);

  const isTransparent = processBackgroundPixels(canvas, options);

  let chosenFormat = options.format || (isTransparent ? 'image/png' : 'image/jpeg');
  if (isTransparent && chosenFormat === 'image/jpeg') {
    chosenFormat = 'image/png';
  }

  const quality = chosenFormat === 'image/png' ? undefined : options.quality ?? 0.92;
  const blob = await canvasToBlob(canvas, chosenFormat, quality);
  const previewUrl = URL.createObjectURL(blob);
  const ext = chosenFormat.split('/')[1] || 'jpg';

  const hexTarget =
    options.targetColorPreset === 'custom'
      ? options.customTargetColor || '#FFFFFF'
      : BACKGROUND_PRESETS.find((p) => p.id === options.targetColorPreset)?.hex || null;

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
    targetColorHex: hexTarget,
  };
}

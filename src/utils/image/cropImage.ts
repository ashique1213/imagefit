import { createCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';

export type AspectRatioPreset =
  | 'free'
  | '1:1'
  | '35:45'
  | '4:3'
  | '3:4'
  | '16:9'
  | '2:1'
  | '7:2';

export interface AspectRatioOption {
  id: AspectRatioPreset;
  label: string;
  ratio: number | null; // width / height, or null for freeform
  description: string;
  category: 'common' | 'passport' | 'signature' | 'display';
}

export const CROP_RATIO_PRESETS: AspectRatioOption[] = [
  {
    id: 'free',
    label: 'Freeform',
    ratio: null,
    description: 'Custom crop with no aspect ratio lock',
    category: 'common',
  },
  {
    id: '1:1',
    label: '1:1 Square',
    ratio: 1,
    description: 'Square photo, social profile, US Visa standard',
    category: 'common',
  },
  {
    id: '35:45',
    label: '35:45 Passport',
    ratio: 35 / 45, // 0.7778
    description: 'International & Indian Passport/Visa standard (3.5cm × 4.5cm)',
    category: 'passport',
  },
  {
    id: '3:4',
    label: '3:4 Portrait',
    ratio: 3 / 4, // 0.75
    description: 'Standard upright portrait ratio for ID cards and exams',
    category: 'passport',
  },
  {
    id: '4:3',
    label: '4:3 Standard',
    ratio: 4 / 3, // 1.333
    description: 'Traditional camera landscape photo ratio',
    category: 'display',
  },
  {
    id: '16:9',
    label: '16:9 Wide',
    ratio: 16 / 9, // 1.7778
    description: 'Widescreen landscape, document header, or video ratio',
    category: 'display',
  },
  {
    id: '2:1',
    label: '2:1 Signature',
    ratio: 2 / 1, // 2.0
    description: 'Horizontal signature rectangle (e.g. 140 × 70 px or 200 × 100 px)',
    category: 'signature',
  },
  {
    id: '7:2',
    label: '7:2 Wide Sig',
    ratio: 7 / 2, // 3.5 (e.g. SSC/Bank signature standard: 140 × 60 px approx 2.33 - 3.5)
    description: 'Official wide government exam signature box',
    category: 'signature',
  },
];

export interface PixelCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  cropArea: PixelCropArea;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number; // 0.05 to 1.0
  backgroundColor?: string; // fallback fill for transparent areas in JPEG
}

export interface CropResult {
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
 * Calculates a bounded crop box centered within the image matching the requested aspect ratio.
 */
export function getInitialCropBox(
  containerWidth: number,
  containerHeight: number,
  ratio: number | null
): PixelCropArea {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  // Use 85% of smaller dimension as default size
  if (!ratio) {
    const width = Math.round(containerWidth * 0.85);
    const height = Math.round(containerHeight * 0.85);
    const x = Math.round((containerWidth - width) / 2);
    const y = Math.round((containerHeight - height) / 2);
    return { x, y, width, height };
  }

  let width = containerWidth * 0.85;
  let height = width / ratio;

  if (height > containerHeight * 0.85) {
    height = containerHeight * 0.85;
    width = height * ratio;
  }

  width = Math.max(20, Math.round(width));
  height = Math.max(20, Math.round(height));
  const x = Math.max(0, Math.round((containerWidth - width) / 2));
  const y = Math.max(0, Math.round((containerHeight - height) / 2));

  return { x, y, width, height };
}

/**
 * Clamps crop box dimensions and positions so it stays completely inside container bounds.
 */
export function clampCropBox(
  box: PixelCropArea,
  containerWidth: number,
  containerHeight: number,
  minDimension = 20
): PixelCropArea {
  let width = Math.max(minDimension, Math.min(box.width, containerWidth));
  let height = Math.max(minDimension, Math.min(box.height, containerHeight));

  let x = Math.max(0, Math.min(box.x, containerWidth - width));
  let y = Math.max(0, Math.min(box.y, containerHeight - height));

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Maps displayed crop box coordinates (relative to rendered image on screen)
 * to exact pixel coordinates on the native original image.
 */
export function mapDisplayToNaturalCoords(
  displayCrop: PixelCropArea,
  displayedImageRect: { width: number; height: number },
  naturalWidth: number,
  naturalHeight: number
): PixelCropArea {
  if (
    displayedImageRect.width <= 0 ||
    displayedImageRect.height <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return { x: 0, y: 0, width: naturalWidth, height: naturalHeight };
  }

  const scaleX = naturalWidth / displayedImageRect.width;
  const scaleY = naturalHeight / displayedImageRect.height;

  const naturalX = Math.max(0, Math.min(Math.round(displayCrop.x * scaleX), naturalWidth - 1));
  const naturalY = Math.max(0, Math.min(Math.round(displayCrop.y * scaleY), naturalHeight - 1));

  let naturalW = Math.round(displayCrop.width * scaleX);
  let naturalH = Math.round(displayCrop.height * scaleY);

  // Clamp width & height to natural image boundary
  naturalW = Math.max(1, Math.min(naturalW, naturalWidth - naturalX));
  naturalH = Math.max(1, Math.min(naturalH, naturalHeight - naturalY));

  return {
    x: naturalX,
    y: naturalY,
    width: naturalW,
    height: naturalH,
  };
}

/**
 * Performs high-quality extraction of the cropped region into a new Blob.
 */
export async function cropImage(
  source: HTMLImageElement | ImageBitmap,
  options: CropOptions
): Promise<CropResult> {
  const {
    cropArea,
    format = 'image/jpeg',
    quality = 0.92,
    backgroundColor = '#FFFFFF',
  } = options;

  const { x, y, width, height } = cropArea;

  if (width <= 0 || height <= 0) {
    throw new Error('Invalid crop dimensions: width and height must be greater than zero.');
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to create canvas rendering context for cropping.');
  }

  // Smooth rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If exporting as JPEG, fill background with solid color to avoid black transparency
  if (format === 'image/jpeg') {
    ctx.fillStyle = backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw only the cropped bounding box from the source image
  ctx.drawImage(
    source,
    x,
    y,
    width,
    height, // Source sub-rectangle
    0,
    0,
    width,
    height // Destination canvas
  );

  const q = format === 'image/png' ? undefined : quality;
  const blob = await canvasToBlob(canvas, format, q);
  const previewUrl = URL.createObjectURL(blob);

  const ext = format.split('/')[1] || 'jpg';

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    width,
    height,
    format: ext,
    mimeType: format,
  };
}

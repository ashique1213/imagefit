/**
 * Creates an HTMLCanvasElement with the specified dimensions
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

/**
 * Draws an Image or ImageBitmap onto a canvas, optionally filling background
 */
export function drawImageToCanvas(
  source: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  backgroundColor?: string
): HTMLCanvasElement {
  const canvas = createCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to obtain 2D canvas rendering context.');
  }

  // Optional background color (e.g. for converting transparent PNGs to JPEG with white bg)
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Smooth image scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Converts a Canvas to a Blob asynchronously with fallback
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string = 'image/jpeg',
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const q = quality !== undefined ? Math.max(0.01, Math.min(1.0, quality)) : undefined;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed to produce an image Blob.'));
          }
        },
        format,
        q
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Canvas export failed.'));
    }
  });
}

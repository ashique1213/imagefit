import type { ProcessingResult } from '../../types';
import { drawImageToCanvas, canvasToBlob } from './canvasUtils';
import { formatBytes } from '../formatting/formatSize';

export interface TargetCompressionOptions {
  format?: 'image/jpeg' | 'image/webp';
  allowDimensionReduction?: boolean;
  minQuality?: number;
  maxQuality?: number;
  maxIterations?: number;
}

export interface CompressionResultExtended extends ProcessingResult {
  targetSizeBytes?: number;
  qualityUsed: number;
  dimensionReduced: boolean;
  reductionPercentage: number;
}

/**
 * Compresses an image at a fixed quality factor
 */
export async function compressWithQuality(
  source: HTMLImageElement,
  quality: number,
  format: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg',
  customWidth?: number,
  customHeight?: number
): Promise<CompressionResultExtended> {
  const targetW = customWidth || source.naturalWidth;
  const targetH = customHeight || source.naturalHeight;

  // If PNG is exported as JPEG, fill with white background so transparent areas don't turn black
  const bgColor = format === 'image/jpeg' ? '#ffffff' : undefined;
  const canvas = drawImageToCanvas(source, targetW, targetH, bgColor);

  // PNG ignores quality in standard toBlob; JPEG and WebP accept 0.01 - 1.0
  const q = format === 'image/png' ? undefined : Math.max(0.01, Math.min(1.0, quality));
  const blob = await canvasToBlob(canvas, format, q);
  const previewUrl = URL.createObjectURL(blob);

  let ext = 'JPG';
  if (format === 'image/webp') ext = 'WEBP';
  if (format === 'image/png') ext = 'PNG';

  const originalEstimatedSize = source.src.length; // fallback
  const reductionPercentage = originalEstimatedSize > 0 
    ? Math.max(0, Math.round(((originalEstimatedSize - blob.size) / originalEstimatedSize) * 100))
    : 0;

  return {
    blob,
    previewUrl,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    width: targetW,
    height: targetH,
    format: ext,
    achievableStatus: 'success',
    qualityUsed: quality,
    dimensionReduced: targetW !== source.naturalWidth || targetH !== source.naturalHeight,
    reductionPercentage,
  };
}

/**
 * Performs an efficient binary search to find the optimal quality (and dimensions if needed)
 * to achieve a requested target file size in bytes without unnecessary iterations.
 */
export async function compressToTargetSize(
  source: HTMLImageElement,
  targetSizeBytes: number,
  originalSizeBytes: number,
  options: TargetCompressionOptions = {}
): Promise<CompressionResultExtended> {
  const {
    format = 'image/jpeg',
    allowDimensionReduction = true,
    minQuality = 0.05,
    maxQuality = 0.98,
    maxIterations = 7,
  } = options;

  let currentWidth = source.naturalWidth;
  let currentHeight = source.naturalHeight;

  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let bestDifference = Infinity;

  // Maximum dimension reduction scaling loops if target size is extremely small
  const maxScaleRounds = allowDimensionReduction ? 5 : 1;

  for (let round = 0; round < maxScaleRounds; round++) {
    const canvas = drawImageToCanvas(source, currentWidth, currentHeight, '#ffffff');

    let low = minQuality;
    let high = maxQuality;
    let roundBestBlob: Blob | null = null;
    let roundBestQuality = 0.8;

    for (let i = 0; i < maxIterations; i++) {
      const mid = (low + high) / 2;
      const blob = await canvasToBlob(canvas, format, mid);

      if (blob.size <= targetSizeBytes) {
        // Fits within target!
        roundBestBlob = blob;
        roundBestQuality = mid;
        // Try higher quality to see if we can get even closer to target without exceeding it
        low = mid;
      } else {
        // Exceeds target, need lower quality
        high = mid;
        if (!roundBestBlob || Math.abs(blob.size - targetSizeBytes) < bestDifference) {
          roundBestBlob = blob;
          roundBestQuality = mid;
        }
      }
    }

    if (roundBestBlob) {
      const diff = Math.abs(roundBestBlob.size - targetSizeBytes);
      if (diff < bestDifference || roundBestBlob.size <= targetSizeBytes) {
        bestBlob = roundBestBlob;
        bestQuality = roundBestQuality;
        bestDifference = diff;
      }

      // If we achieved a size <= targetSizeBytes, we are done!
      if (roundBestBlob.size <= targetSizeBytes) {
        break;
      }
    }

    // If still larger than target after lowest quality search and dimension reduction is allowed,
    // scale dimensions down by 15% and try again
    if (allowDimensionReduction && round < maxScaleRounds - 1) {
      currentWidth = Math.max(64, Math.round(currentWidth * 0.85));
      currentHeight = Math.max(64, Math.round(currentHeight * 0.85));
    }
  }

  // Fallback if somehow no blob was produced
  if (!bestBlob) {
    const canvas = drawImageToCanvas(source, currentWidth, currentHeight, '#ffffff');
    bestBlob = await canvasToBlob(canvas, format, 0.5);
  }

  const previewUrl = URL.createObjectURL(bestBlob);
  const ext = format === 'image/webp' ? 'WEBP' : 'JPG';

  // Determine realistic status
  const achievableStatus = bestBlob.size <= targetSizeBytes ? 'success' : 'closest';

  const reductionPercentage = originalSizeBytes > 0
    ? Math.max(0, Math.round(((originalSizeBytes - bestBlob.size) / originalSizeBytes) * 100))
    : 0;

  return {
    blob: bestBlob,
    previewUrl,
    sizeBytes: bestBlob.size,
    formattedSize: formatBytes(bestBlob.size),
    width: currentWidth,
    height: currentHeight,
    format: ext,
    achievableStatus,
    targetSizeBytes,
    qualityUsed: parseFloat(bestQuality.toFixed(2)),
    dimensionReduced: currentWidth !== source.naturalWidth || currentHeight !== source.naturalHeight,
    reductionPercentage,
  };
}

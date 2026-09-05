import JSZip from 'jszip';
import { compressToTargetSize } from './compressImage';
import { resizeImage } from './resizeImage';
import { convertImage } from './convertImage';
import { formatBytes } from '../formatting/formatSize';
import { generateDownloadFilename } from './downloadImage';

export type BatchOperationMode = 'compress' | 'convert' | 'resize';

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  originalSizeBytes: number;
  originalFormattedSize: string;
  previewUrl: string;
  width: number;
  height: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  result?: {
    blob: Blob;
    previewUrl: string;
    sizeBytes: number;
    formattedSize: string;
    width: number;
    height: number;
    outputFilename: string;
    format: string;
  };
}

export interface BatchSettings {
  mode: BatchOperationMode;
  targetMaxKb: number;
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  scalePercentage?: number; // 25, 50, 75, 100
  maxEdgeDimension?: number; // e.g. 1200
  backgroundColor?: string;
}

export const DEFAULT_BATCH_SETTINGS: BatchSettings = {
  mode: 'compress',
  targetMaxKb: 100,
  targetFormat: 'image/jpeg',
  quality: 0.85,
  scalePercentage: 100,
  backgroundColor: '#FFFFFF',
};

/**
 * Loads an HTMLImageElement from an object URL or data URL
 */
export function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image buffer in memory.'));
    img.src = url;
  });
}

/**
 * Processes a single item in the batch according to selected settings.
 */
export async function processBatchItem(
  item: BatchItem,
  settings: BatchSettings
): Promise<BatchItem['result']> {
  const img = await loadImageElement(item.previewUrl);
  const targetExt = settings.targetFormat.split('/')[1] || 'jpg';
  const cleanExt = targetExt === 'jpeg' ? 'jpg' : targetExt;

  if (settings.mode === 'compress') {
    // 1. Batch Target KB Compression (Binary search)
    const compressed = await compressToTargetSize(
      img,
      settings.targetMaxKb * 1024,
      item.originalSizeBytes,
      {
        format: settings.targetFormat === 'image/webp' ? 'image/webp' : 'image/jpeg',
        allowDimensionReduction: true,
        maxIterations: 7,
      }
    );

    const outputFilename = generateDownloadFilename(item.name, 'compressed', cleanExt);

    return {
      blob: compressed.blob,
      previewUrl: compressed.previewUrl,
      sizeBytes: compressed.sizeBytes,
      formattedSize: formatBytes(compressed.sizeBytes),
      width: compressed.width,
      height: compressed.height,
      outputFilename,
      format: cleanExt,
    };
  } else if (settings.mode === 'resize') {
    // 2. Batch Resize (Scale percentage or Max Edge constraint)
    let targetW = img.naturalWidth;
    let targetH = img.naturalHeight;

    if (settings.scalePercentage && settings.scalePercentage !== 100) {
      const factor = settings.scalePercentage / 100;
      targetW = Math.max(1, Math.round(targetW * factor));
      targetH = Math.max(1, Math.round(targetH * factor));
    } else if (settings.maxEdgeDimension) {
      const maxEdge = settings.maxEdgeDimension;
      if (targetW > maxEdge || targetH > maxEdge) {
        if (targetW >= targetH) {
          targetH = Math.max(1, Math.round((targetH * maxEdge) / targetW));
          targetW = maxEdge;
        } else {
          targetW = Math.max(1, Math.round((targetW * maxEdge) / targetH));
          targetH = maxEdge;
        }
      }
    }

    const resized = await resizeImage(img, {
      targetWidth: targetW,
      targetHeight: targetH,
      fitMode: 'exact',
      backgroundColor: settings.backgroundColor || '#FFFFFF',
      format: settings.targetFormat,
      quality: settings.quality,
    });

    const outputFilename = generateDownloadFilename(item.name, `${targetW}x${targetH}`, cleanExt);

    return {
      blob: resized.blob,
      previewUrl: resized.previewUrl,
      sizeBytes: resized.sizeBytes,
      formattedSize: formatBytes(resized.sizeBytes),
      width: resized.width,
      height: resized.height,
      outputFilename,
      format: cleanExt,
    };
  } else {
    // 3. Batch Format Conversion
    const converted = await convertImage(img, {
      targetFormat: settings.targetFormat === 'image/webp' ? 'webp' : settings.targetFormat === 'image/png' ? 'png' : 'jpeg',
      quality: settings.quality,
      backgroundColor: settings.backgroundColor || '#FFFFFF',
      fillBackground: settings.targetFormat === 'image/jpeg',
    });

    const outputFilename = generateDownloadFilename(item.name, 'converted', cleanExt);

    return {
      blob: converted.blob,
      previewUrl: converted.previewUrl,
      sizeBytes: converted.sizeBytes,
      formattedSize: formatBytes(converted.sizeBytes),
      width: converted.width,
      height: converted.height,
      outputFilename,
      format: cleanExt,
    };
  }
}

/**
 * Bundles all processed items into a client-side ZIP archive.
 */
export async function generateBatchZip(
  items: BatchItem[],
  zipFilename = 'imagefit-batch.zip'
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();

  let count = 0;
  for (const item of items) {
    if (item.status === 'done' && item.result) {
      const buffer = await item.result.blob.arrayBuffer();
      zip.file(item.result.outputFilename, buffer);
      count++;
    }
  }

  if (count === 0) {
    throw new Error('No successfully processed files available to package in ZIP archive.');
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return { blob: zipBlob, filename: zipFilename };
}

/**
 * Creates synthetic sample files for testing batch operations and demo walkthroughs.
 */
export async function createSampleBatchFiles(): Promise<File[]> {
  const createOne = (name: string, w: number, h: number, bg: string, label: string, mime: string): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Gradient accent
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        grad.addColorStop(1, 'rgba(147, 51, 234, 0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(20, 20, w - 40, h - 40);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, w - 60, h - 60);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, w / 2, h / 2 - 20);

        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`${w} × ${h} px`, w / 2, h / 2 + 25);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], name, { type: mime }));
          } else {
            resolve(new File([], name, { type: mime }));
          }
        },
        mime,
        0.92
      );
    });
  };

  return Promise.all([
    createOne('candidate_photo.jpg', 600, 800, '#0f172a', 'PASSPORT PHOTO', 'image/jpeg'),
    createOne('scanned_signature.png', 500, 250, '#1e293b', 'SIGNATURE SPECIMEN', 'image/png'),
    createOne('identity_document.jpg', 900, 1200, '#090d16', 'OFFICIAL CERTIFICATE', 'image/jpeg'),
  ]);
}

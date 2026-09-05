import type { ImageMetadata } from '../../types';
import { formatBytes } from '../formatting/formatSize';
import { formatAspectRatio } from '../formatting/formatRatio';
import { MAX_IMAGE_DIMENSION_PX } from '../validation/fileValidation';

/**
 * Safely revokes an Object URL to prevent browser memory leaks
 */
export function revokeObjectUrl(url: string | null | undefined): void {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore if already revoked
    }
  }
}

/**
 * Loads an image File into an HTMLImageElement and extracts complete metadata
 */
export function loadImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = document.createElement('img');

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!width || !height || width <= 0 || height <= 0) {
        revokeObjectUrl(objectUrl);
        reject(new Error('Browser could not determine image dimensions. The image may be damaged.'));
        return;
      }

      if (width > MAX_IMAGE_DIMENSION_PX || height > MAX_IMAGE_DIMENSION_PX) {
        revokeObjectUrl(objectUrl);
        reject(
          new Error(
            `Image dimensions (${width} × ${height} px) exceed safe browser memory limit of ${MAX_IMAGE_DIMENSION_PX}px.`
          )
        );
        return;
      }

      // Determine clean format extension
      let formatExt = 'JPG';
      if (file.type === 'image/png') formatExt = 'PNG';
      else if (file.type === 'image/webp') formatExt = 'WEBP';
      else if (file.name.toLowerCase().endsWith('.png')) formatExt = 'PNG';
      else if (file.name.toLowerCase().endsWith('.webp')) formatExt = 'WEBP';

      const metadata: ImageMetadata = {
        file,
        name: file.name,
        sizeBytes: file.size,
        formattedSize: formatBytes(file.size),
        type: file.type || `image/${formatExt.toLowerCase()}`,
        formatExtension: formatExt,
        width,
        height,
        aspectRatio: formatAspectRatio(width, height),
        aspectRatioNumeric: width / height,
        previewUrl: objectUrl,
      };

      resolve(metadata);
    };

    img.onerror = () => {
      revokeObjectUrl(objectUrl);
      reject(new Error('Browser was unable to decode the image file. It may be corrupt or an unsupported format.'));
    };

    img.src = objectUrl;
  });
}

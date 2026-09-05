export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB
export const MAX_IMAGE_DIMENSION_PX = 12000; // 12,000 px safe browser limit

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: SupportedMimeType;
}

/**
 * Sniffs the magic byte headers of the file to guarantee it is actually
 * a real JPEG, PNG, or WebP file, preventing renamed malicious or non-image files.
 */
export async function verifyImageMagicBytes(file: File): Promise<SupportedMimeType | null> {
  try {
    const headerSlice = file.slice(0, 16);
    const buffer = await headerSlice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length < 4) return null;

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return 'image/png';
    }

    // WebP: RIFF ... WEBP
    if (
      bytes[0] === 0x52 && // R
      bytes[1] === 0x49 && // I
      bytes[2] === 0x46 && // F
      bytes[3] === 0x46 && // F
      bytes[8] === 0x57 && // W
      bytes[9] === 0x45 && // E
      bytes[10] === 0x42 && // B
      bytes[11] === 0x50 // P
    ) {
      return 'image/webp';
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates file type, magic bytes, and file size constraints before processing.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  if (!file) {
    return {
      isValid: false,
      error: 'No file was provided.',
    };
  }

  // Check empty file
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file is empty (0 bytes). Please upload a valid image file.',
    };
  }

  // Check maximum file size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'This image is too large to process safely in your browser. Please select an image under 30 MB.',
    };
  }

  // Verify file mime type or extension loosely first
  const fileExt = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
  const mimeTypeMatches = SUPPORTED_MIME_TYPES.includes(file.type as SupportedMimeType);
  const extMatches = SUPPORTED_EXTENSIONS.includes(fileExt as typeof SUPPORTED_EXTENSIONS[number]);

  if (!mimeTypeMatches && !extMatches) {
    return {
      isValid: false,
      error: 'Please upload a valid JPG, PNG, or WebP image.',
    };
  }

  // Strictly verify magic bytes to ensure file is genuinely a supported image
  const detectedType = await verifyImageMagicBytes(file);
  if (!detectedType) {
    return {
      isValid: false,
      error: 'Please upload a valid JPG, PNG, or WebP image. The file format could not be verified.',
    };
  }

  return {
    isValid: true,
    detectedType,
  };
}

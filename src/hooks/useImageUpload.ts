import { useState, useCallback, useEffect, useRef } from 'react';
import type { ImageMetadata } from '../types';
import { validateImageFile } from '../utils/validation/fileValidation';
import { loadImageMetadata, revokeObjectUrl } from '../utils/image/loadImage';

interface UseImageUploadReturn {
  image: ImageMetadata | null;
  isLoading: boolean;
  error: string | null;
  handleFileSelect: (file: File) => Promise<boolean>;
  clearImage: () => void;
  clearError: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [image, setImage] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep track of active preview URL for reliable cleanup
  const currentPreviewUrlRef = useRef<string | null>(null);

  const clearImage = useCallback(() => {
    if (currentPreviewUrlRef.current) {
      revokeObjectUrl(currentPreviewUrlRef.current);
      currentPreviewUrlRef.current = null;
    }
    setImage(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleFileSelect = useCallback(
    async (file: File): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        // 1. Run file and magic byte validation
        const validation = await validateImageFile(file);
        if (!validation.isValid) {
          setError(validation.error || 'The selected file is not a supported image.');
          setIsLoading(false);
          return false;
        }

        // 2. Load and extract metadata
        const metadata = await loadImageMetadata(file);

        // Revoke previous object URL before updating
        if (currentPreviewUrlRef.current) {
          revokeObjectUrl(currentPreviewUrlRef.current);
        }
        currentPreviewUrlRef.current = metadata.previewUrl;

        setImage(metadata);
        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred while loading the image.';
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  // Clean up Object URL when hook unmounts
  useEffect(() => {
    return () => {
      if (currentPreviewUrlRef.current) {
        revokeObjectUrl(currentPreviewUrlRef.current);
        currentPreviewUrlRef.current = null;
      }
    };
  }, []);

  return {
    image,
    isLoading,
    error,
    handleFileSelect,
    clearImage,
    clearError,
  };
}

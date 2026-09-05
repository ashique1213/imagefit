/**
 * Generates an informative, sanitized download filename
 */
export function generateDownloadFilename(
  originalName: string,
  suffix: string = 'compressed',
  targetFormat: string = 'jpg'
): string {
  // Strip original extension
  const base = originalName.replace(/\.[^/.]+$/, '').trim() || 'image';
  const cleanFormat = targetFormat.toLowerCase().replace('jpeg', 'jpg');
  return `${base}-${suffix}.${cleanFormat}`;
}

/**
 * Triggers a client-side download for a given Blob or object URL
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

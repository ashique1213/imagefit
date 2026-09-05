/**
 * Formats byte values into human-readable strings (B, KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 KB';
  if (!Number.isFinite(bytes) || bytes < 0) return '0 KB';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);
  const value = parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm));

  return `${value} ${sizes[safeIndex]}`;
}

/**
 * Converts KB to Bytes
 */
export function kbToBytes(kb: number): number {
  return Math.round(kb * 1024);
}

/**
 * Converts MB to Bytes
 */
export function mbToBytes(mb: number): number {
  return Math.round(mb * 1024 * 1024);
}

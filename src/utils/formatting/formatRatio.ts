/**
 * Computes Greatest Common Divisor using Euclidean algorithm
 */
function getGcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Calculates and returns a formatted aspect ratio string (e.g. "16:9", "4:3", "1:1", "3:2")
 */
export function formatAspectRatio(width: number, height: number): string {
  if (!width || !height || width <= 0 || height <= 0) {
    return '1:1';
  }

  const gcd = getGcd(width, height);
  const ratioW = width / gcd;
  const ratioH = height / gcd;

  // If numbers are clean integers under 50, use direct ratio
  if (ratioW <= 32 && ratioH <= 32) {
    return `${ratioW}:${ratioH}`;
  }

  // Standard standard approximations for common photo formats
  const decimal = width / height;
  if (Math.abs(decimal - 1.0) < 0.02) return '1:1';
  if (Math.abs(decimal - 1.333) < 0.02) return '4:3';
  if (Math.abs(decimal - 0.75) < 0.02) return '3:4';
  if (Math.abs(decimal - 1.5) < 0.02) return '3:2';
  if (Math.abs(decimal - 0.667) < 0.02) return '2:3';
  if (Math.abs(decimal - 1.777) < 0.02) return '16:9';
  if (Math.abs(decimal - 0.5625) < 0.02) return '9:16';

  return `${decimal.toFixed(2)}:1`;
}

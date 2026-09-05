import { describe, it, expect } from 'vitest';
import { formatBytes, kbToBytes, mbToBytes } from './formatSize';

describe('formatSize', () => {
  it('formats byte values correctly', () => {
    expect(formatBytes(0)).toBe('0 KB');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 100)).toBe('100 KB');
    expect(formatBytes(2.4 * 1024 * 1024, 1)).toBe('2.4 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('converts units correctly', () => {
    expect(kbToBytes(100)).toBe(102400);
    expect(mbToBytes(2)).toBe(2097152);
  });
});

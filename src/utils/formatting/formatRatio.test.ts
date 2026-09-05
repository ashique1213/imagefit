import { describe, it, expect } from 'vitest';
import { formatAspectRatio } from './formatRatio';

describe('formatRatio', () => {
  it('calculates aspect ratios correctly', () => {
    expect(formatAspectRatio(100, 100)).toBe('1:1');
    expect(formatAspectRatio(1200, 800)).toBe('3:2');
    expect(formatAspectRatio(1920, 1080)).toBe('16:9');
    expect(formatAspectRatio(800, 600)).toBe('4:3');
    expect(formatAspectRatio(600, 800)).toBe('3:4');
  });

  it('handles invalid or zero inputs gracefully', () => {
    expect(formatAspectRatio(0, 0)).toBe('1:1');
    expect(formatAspectRatio(-10, 50)).toBe('1:1');
  });
});

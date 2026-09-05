import { describe, it, expect } from 'vitest';
import {
  calculateLockedDimensions,
  calculatePercentageDimensions,
  calculateFitGeometry,
} from './resizeImage';
import { RESIZE_PRESETS } from '../../constants/presets';

describe('calculateLockedDimensions', () => {
  it('correctly calculates height when width changes preserving 3:2 ratio', () => {
    // 1200 x 800 original (1.5 aspect ratio)
    const result = calculateLockedDimensions(1200, 800, 600, undefined, 'width');
    expect(result.width).toBe(600);
    expect(result.height).toBe(400);
  });

  it('correctly calculates width when height changes preserving 4:3 ratio', () => {
    // 800 x 600 original (1.333 ratio)
    const result = calculateLockedDimensions(800, 600, undefined, 300, 'height');
    expect(result.width).toBe(400);
    expect(result.height).toBe(300);
  });

  it('handles square 1:1 aspect ratio properly', () => {
    const result = calculateLockedDimensions(500, 500, 250, undefined, 'width');
    expect(result.width).toBe(250);
    expect(result.height).toBe(250);
  });

  it('clamps invalid, zero, or negative inputs safely to minimum of 1', () => {
    const result = calculateLockedDimensions(1000, 500, -50, undefined, 'width');
    expect(result.width).toBe(1);
    expect(result.height).toBe(1);
  });

  it('clamps excessive dimensions safely to 10000', () => {
    const result = calculateLockedDimensions(1000, 1000, 999999, undefined, 'width');
    expect(result.width).toBe(10000);
    expect(result.height).toBe(10000);
  });
});

describe('calculatePercentageDimensions', () => {
  it('calculates 50% reduction correctly', () => {
    const result = calculatePercentageDimensions(1200, 800, 50);
    expect(result.width).toBe(600);
    expect(result.height).toBe(400);
  });

  it('calculates 200% enlargement correctly', () => {
    const result = calculatePercentageDimensions(300, 200, 200);
    expect(result.width).toBe(600);
    expect(result.height).toBe(400);
  });

  it('rounds fractional pixel dimensions to whole numbers', () => {
    const result = calculatePercentageDimensions(105, 53, 33);
    expect(result.width).toBe(35);
    expect(result.height).toBe(17);
  });
});

describe('calculateFitGeometry', () => {
  it('returns target dimensions exactly when fitMode is exact', () => {
    const geom = calculateFitGeometry(800, 600, 300, 200, 'exact');
    expect(geom.dx).toBe(0);
    expect(geom.dy).toBe(0);
    expect(geom.dWidth).toBe(300);
    expect(geom.dHeight).toBe(200);
  });

  it('calculates centered contain geometry without distortion', () => {
    // 800x400 (2:1) into 400x400 (1:1)
    const geom = calculateFitGeometry(800, 400, 400, 400, 'contain');
    expect(geom.dWidth).toBe(400);
    expect(geom.dHeight).toBe(200);
    expect(geom.dx).toBe(0);
    expect(geom.dy).toBe(100); // vertically centered (400 - 200) / 2
  });

  it('calculates centered cover geometry for cropping fill', () => {
    // 800x400 (2:1) into 400x400 (1:1)
    const geom = calculateFitGeometry(800, 400, 400, 400, 'cover');
    expect(geom.dHeight).toBe(400);
    expect(geom.dWidth).toBe(800);
    expect(geom.dx).toBe(-200); // horizontally cropped (400 - 800) / 2
    expect(geom.dy).toBe(0);
  });
});

describe('RESIZE_PRESETS verification', () => {
  it('ensures all presets have valid positive dimensions and metadata', () => {
    expect(RESIZE_PRESETS.length).toBeGreaterThan(5);
    const seenIds = new Set<string>();

    for (const preset of RESIZE_PRESETS) {
      expect(preset.width).toBeGreaterThan(10);
      expect(preset.height).toBeGreaterThan(10);
      expect(preset.name.length).toBeGreaterThan(3);
      expect(seenIds.has(preset.id)).toBe(false);
      seenIds.add(preset.id);
    }
  });
});

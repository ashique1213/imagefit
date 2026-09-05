import { describe, it, expect } from 'vitest';
import {
  calculateRotatedDimensions,
  calculateContrastFactor,
  applyPixelFilters,
  DEFAULT_EDITOR_SETTINGS,
} from './editImage';

describe('calculateRotatedDimensions', () => {
  it('preserves width and height at 0 and 180 degrees', () => {
    expect(calculateRotatedDimensions(1200, 800, 0)).toEqual({ width: 1200, height: 800 });
    expect(calculateRotatedDimensions(1200, 800, 180)).toEqual({ width: 1200, height: 800 });
  });

  it('swaps width and height at 90 and 270 degrees', () => {
    expect(calculateRotatedDimensions(1200, 800, 90)).toEqual({ width: 800, height: 1200 });
    expect(calculateRotatedDimensions(1200, 800, 270)).toEqual({ width: 800, height: 1200 });
  });
});

describe('calculateContrastFactor', () => {
  it('returns 1.0 when contrast adjustment is 0', () => {
    expect(calculateContrastFactor(0)).toBeCloseTo(1.0, 4);
  });

  it('returns factor > 1.0 when contrast is increased', () => {
    expect(calculateContrastFactor(50)).toBeGreaterThan(1.0);
  });

  it('returns factor < 1.0 when contrast is decreased', () => {
    expect(calculateContrastFactor(-50)).toBeLessThan(1.0);
  });
});

describe('applyPixelFilters', () => {
  it('increases pixel values when brightness is positive', () => {
    const data = new Uint8ClampedArray([100, 100, 100, 255]);
    const imgData = { data } as ImageData;

    applyPixelFilters(imgData, 20, 0, false); // +20% brightness = +51
    expect(data[0]).toBe(151);
    expect(data[1]).toBe(151);
    expect(data[2]).toBe(151);
  });

  it('clamps pixel values to 255 maximum', () => {
    const data = new Uint8ClampedArray([240, 240, 240, 255]);
    const imgData = { data } as ImageData;

    applyPixelFilters(imgData, 50, 0, false);
    expect(data[0]).toBe(255);
    expect(data[1]).toBe(255);
    expect(data[2]).toBe(255);
  });

  it('clamps pixel values to 0 minimum when brightness is negative', () => {
    const data = new Uint8ClampedArray([20, 20, 20, 255]);
    const imgData = { data } as ImageData;

    applyPixelFilters(imgData, -50, 0, false);
    expect(data[0]).toBe(0);
    expect(data[1]).toBe(0);
    expect(data[2]).toBe(0);
  });

  it('converts color pixels to grayscale with luminance weighting', () => {
    // Pure red (255, 0, 0)
    const data = new Uint8ClampedArray([255, 0, 0, 255]);
    const imgData = { data } as ImageData;

    applyPixelFilters(imgData, 0, 0, true);
    // Luminance of pure red = 0.299 * 255 = 76
    expect(data[0]).toBe(76);
    expect(data[1]).toBe(76);
    expect(data[2]).toBe(76);
  });
});

describe('DEFAULT_EDITOR_SETTINGS', () => {
  it('has zero rotation and neutral color adjustments by default', () => {
    expect(DEFAULT_EDITOR_SETTINGS.rotation).toBe(0);
    expect(DEFAULT_EDITOR_SETTINGS.flipHorizontal).toBe(false);
    expect(DEFAULT_EDITOR_SETTINGS.flipVertical).toBe(false);
    expect(DEFAULT_EDITOR_SETTINGS.brightness).toBe(0);
    expect(DEFAULT_EDITOR_SETTINGS.contrast).toBe(0);
    expect(DEFAULT_EDITOR_SETTINGS.grayscale).toBe(false);
  });
});

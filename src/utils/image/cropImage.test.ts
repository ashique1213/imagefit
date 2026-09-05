import { describe, it, expect } from 'vitest';
import {
  getInitialCropBox,
  clampCropBox,
  mapDisplayToNaturalCoords,
  CROP_RATIO_PRESETS,
} from './cropImage';

describe('CROP_RATIO_PRESETS', () => {
  it('contains expected standard aspect ratios', () => {
    const ids = CROP_RATIO_PRESETS.map((p) => p.id);
    expect(ids).toContain('free');
    expect(ids).toContain('1:1');
    expect(ids).toContain('35:45');
    expect(ids).toContain('16:9');
    expect(ids).toContain('2:1');
  });

  it('calculates 35:45 passport ratio correctly', () => {
    const preset = CROP_RATIO_PRESETS.find((p) => p.id === '35:45');
    expect(preset?.ratio).toBeCloseTo(35 / 45, 4);
  });
});

describe('getInitialCropBox', () => {
  it('centers a 1:1 square crop box within a landscape container', () => {
    // Container: 800 x 600
    // 85% of height = 510, width = 510
    const box = getInitialCropBox(800, 600, 1);
    expect(box.width).toBe(510);
    expect(box.height).toBe(510);
    expect(box.x).toBe(145); // (800 - 510) / 2
    expect(box.y).toBe(45);  // (600 - 510) / 2
  });

  it('centers a 16:9 widescreen crop box within a square container', () => {
    // Container: 1000 x 1000
    // 85% width = 850, height = 850 / (16/9) = 478
    const box = getInitialCropBox(1000, 1000, 16 / 9);
    expect(box.width).toBe(850);
    expect(box.height).toBe(478);
    expect(box.x).toBe(75);
    expect(box.y).toBe(261);
  });

  it('handles freeform aspect ratio (null ratio) safely', () => {
    const box = getInitialCropBox(500, 400, null);
    expect(box.width).toBe(425); // 85% of 500
    expect(box.height).toBe(340); // 85% of 400
    expect(box.x).toBe(38);
    expect(box.y).toBe(30);
  });

  it('safely handles zero or negative container dimensions', () => {
    const box = getInitialCropBox(0, 0, 1);
    expect(box.width).toBe(100);
    expect(box.height).toBe(100);
  });
});

describe('clampCropBox', () => {
  it('clamps coordinates to stay inside container width and height', () => {
    // Box starting at -50, -50 with width 200, height 200 in 500x500 container
    const clamped = clampCropBox({ x: -50, y: -50, width: 200, height: 200 }, 500, 500);
    expect(clamped.x).toBe(0);
    expect(clamped.y).toBe(0);
    expect(clamped.width).toBe(200);
    expect(clamped.height).toBe(200);
  });

  it('prevents crop box from overflowing right and bottom edges', () => {
    // Box at x=400, y=400 with width 200, height 200 in 500x500 container
    const clamped = clampCropBox({ x: 400, y: 400, width: 200, height: 200 }, 500, 500);
    expect(clamped.x).toBe(300); // 500 - 200
    expect(clamped.y).toBe(300); // 500 - 200
  });

  it('clamps box width/height larger than container', () => {
    const clamped = clampCropBox({ x: 0, y: 0, width: 800, height: 800 }, 500, 400);
    expect(clamped.width).toBe(500);
    expect(clamped.height).toBe(400);
    expect(clamped.x).toBe(0);
    expect(clamped.y).toBe(0);
  });
});

describe('mapDisplayToNaturalCoords', () => {
  it('accurately scales display crop coordinates to original high-res image dimensions', () => {
    // Display rendered size: 400 × 300
    // Natural image size: 1200 × 900 (3x scale factor)
    // Display crop box: x=50, y=25, w=200, h=150
    const naturalCrop = mapDisplayToNaturalCoords(
      { x: 50, y: 25, width: 200, height: 150 },
      { width: 400, height: 300 },
      1200,
      900
    );

    expect(naturalCrop.x).toBe(150);
    expect(naturalCrop.y).toBe(75);
    expect(naturalCrop.width).toBe(600);
    expect(naturalCrop.height).toBe(450);
  });

  it('clamps natural coordinates so they do not exceed native image bounds', () => {
    const naturalCrop = mapDisplayToNaturalCoords(
      { x: 300, y: 200, width: 200, height: 200 },
      { width: 400, height: 300 },
      800,
      600
    );

    expect(naturalCrop.x + naturalCrop.width).toBeLessThanOrEqual(800);
    expect(naturalCrop.y + naturalCrop.height).toBeLessThanOrEqual(600);
  });
});

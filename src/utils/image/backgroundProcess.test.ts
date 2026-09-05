import { describe, it, expect } from 'vitest';
import {
  calculateColorDistance,
  samplePerimeterColor,
  processBackgroundPixels,
  BACKGROUND_PRESETS,
} from './backgroundProcess';

describe('calculateColorDistance', () => {
  it('returns 0 for identical colors', () => {
    const dist = calculateColorDistance(255, 255, 255, 255, 255, 255);
    expect(dist).toBe(0);
  });

  it('returns 100 for maximum difference (black vs white)', () => {
    const dist = calculateColorDistance(0, 0, 0, 255, 255, 255);
    expect(dist).toBeCloseTo(100, 1);
  });

  it('calculates intermediate distances accurately', () => {
    // Distance between light gray (200, 200, 200) and white (255, 255, 255)
    const dist = calculateColorDistance(200, 200, 200, 255, 255, 255);
    expect(dist).toBeGreaterThan(10);
    expect(dist).toBeLessThan(30);
  });
});

describe('BACKGROUND_PRESETS', () => {
  it('includes official portal standards: white, light-blue, light-gray', () => {
    const ids = BACKGROUND_PRESETS.map((p) => p.id);
    expect(ids).toContain('white');
    expect(ids).toContain('light-blue');
    expect(ids).toContain('light-gray');
    expect(ids).toContain('transparent');
  });

  it('has valid hex values for solid color presets', () => {
    const whitePreset = BACKGROUND_PRESETS.find((p) => p.id === 'white');
    expect(whitePreset?.hex).toBe('#FFFFFF');
    const bluePreset = BACKGROUND_PRESETS.find((p) => p.id === 'light-blue');
    expect(bluePreset?.hex).toBe('#E0F2FE');
  });
});

describe('samplePerimeterColor', () => {
  it('correctly detects uniform perimeter color from mock canvas', () => {
    const mockData = new Uint8ClampedArray(10 * 10 * 4);
    // Fill with light blue (224, 242, 254) = #E0F2FE
    for (let i = 0; i < mockData.length; i += 4) {
      mockData[i] = 224;
      mockData[i + 1] = 242;
      mockData[i + 2] = 254;
      mockData[i + 3] = 255;
    }

    const mockCanvas = {
      width: 10,
      height: 10,
      getContext: () => ({
        getImageData: () => ({ data: mockData }),
      }),
    } as unknown as HTMLCanvasElement;

    const detected = samplePerimeterColor(mockCanvas);
    expect(detected).toBe('#E0F2FE');
  });
});

describe('processBackgroundPixels', () => {
  it('replaces color-keyed background pixels with target color', () => {
    // 2 pixels: Pixel 0 is Light Gray backdrop (220, 220, 220), Pixel 1 is Dark Subject (20, 20, 20)
    const data = new Uint8ClampedArray([
      220, 220, 220, 255, // Backdrop
      20, 20, 20, 255      // Subject
    ]);

    const mockCanvas = {
      width: 2,
      height: 1,
      getContext: () => ({
        getImageData: () => ({ data }),
        putImageData: () => {},
      }),
    } as unknown as HTMLCanvasElement;

    processBackgroundPixels(mockCanvas, {
      mode: 'color-key',
      targetColorPreset: 'white', // Replace with #FFFFFF
      sourceColor: '#DCDCDC',     // Source color ~ (220, 220, 220)
      tolerance: 25,
      feather: 0,
    });

    // Pixel 0 (backdrop): should be replaced with pure white (255, 255, 255)
    expect(data[0]).toBe(255);
    expect(data[1]).toBe(255);
    expect(data[2]).toBe(255);

    // Pixel 1 (subject): should remain intact (20, 20, 20)
    expect(data[4]).toBe(20);
    expect(data[5]).toBe(20);
    expect(data[6]).toBe(20);
  });

  it('blends transparent cutout pixels onto solid target background in transparent-fill mode', () => {
    // 1 pixel with 50% opacity red (255, 0, 0, 128) onto white background (255, 255, 255)
    const data = new Uint8ClampedArray([
      255, 0, 0, 128
    ]);

    const mockCanvas = {
      width: 1,
      height: 1,
      getContext: () => ({
        getImageData: () => ({ data }),
        putImageData: () => {},
      }),
    } as unknown as HTMLCanvasElement;

    processBackgroundPixels(mockCanvas, {
      mode: 'transparent-fill',
      targetColorPreset: 'white',
      tolerance: 20,
      feather: 0,
    });

    // Blended with white: G and B should be ~ 128, R should be 255, Alpha becomes 255
    expect(data[0]).toBe(255);
    expect(data[1]).toBeCloseTo(127, -1);
    expect(data[2]).toBeCloseTo(127, -1);
    expect(data[3]).toBe(255);
  });
});

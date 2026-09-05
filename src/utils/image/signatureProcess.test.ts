import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  processSignaturePixels,
  INK_COLOR_PRESETS,
  BG_COLOR_PRESETS,
} from './signatureProcess';

describe('hexToRgb', () => {
  it('converts 6-character hex strings correctly', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#1D4ED8')).toEqual({ r: 29, g: 78, b: 216 });
  });

  it('converts 3-character short hex strings correctly', () => {
    expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('handles strings without # prefix', () => {
    expect(hexToRgb('1D4ED8')).toEqual({ r: 29, g: 78, b: 216 });
  });

  it('safely handles invalid hex values by returning zeroes', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#XYZ')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('Color presets', () => {
  it('has valid presets for official black, blue, and red ink', () => {
    expect(INK_COLOR_PRESETS.black.hex).toBeDefined();
    expect(INK_COLOR_PRESETS.blue.hex).toBeDefined();
    expect(INK_COLOR_PRESETS.red.hex).toBeDefined();
  });

  it('has valid background presets including transparent and white', () => {
    expect(BG_COLOR_PRESETS.transparent.hex).toBeNull();
    expect(BG_COLOR_PRESETS.white.hex).toBe('#FFFFFF');
  });
});

describe('processSignaturePixels', () => {
  it('turns paper background transparent and recolors dark ink in transparent mode', () => {
    // 2x1 canvas: Pixel 0 is dark ink (RGB 30,30,30), Pixel 1 is bright paper (RGB 240,240,240)
    const pixelData = new Uint8ClampedArray([
      30, 30, 30, 255,   // Dark ink
      240, 240, 240, 255 // Paper background
    ]);

    const mockCtx = {
      getImageData: () => ({ data: pixelData }),
      putImageData: () => {},
    };

    const mockCanvas = {
      width: 2,
      height: 1,
      getContext: () => mockCtx,
    } as unknown as HTMLCanvasElement;

    processSignaturePixels(mockCanvas, {
      backgroundColorMode: 'transparent',
      inkColorMode: 'blue', // Ballpoint Blue (29, 78, 216)
      threshold: 200,
      smoothness: 20,
    });

    // Pixel 0 (ink): should be recolored towards blue with high alpha
    expect(pixelData[0]).toBe(29);  // R
    expect(pixelData[1]).toBe(78);  // G
    expect(pixelData[2]).toBe(216); // B
    expect(pixelData[3]).toBe(255); // Alpha full

    // Pixel 1 (paper): should have alpha = 0 (completely transparent)
    expect(pixelData[7]).toBe(0);
  });

  it('cleans paper to solid white background in white background mode', () => {
    // 1 pixel of off-white/gray paper (RGB 215, 215, 215) with threshold 200
    const pixelData = new Uint8ClampedArray([
      215, 215, 215, 255
    ]);

    const mockCtx = {
      getImageData: () => ({ data: pixelData }),
      putImageData: () => {},
    };

    const mockCanvas = {
      width: 1,
      height: 1,
      getContext: () => mockCtx,
    } as unknown as HTMLCanvasElement;

    processSignaturePixels(mockCanvas, {
      backgroundColorMode: 'white',
      inkColorMode: 'black',
      threshold: 200,
      smoothness: 20,
    });

    // Pixel brightness 215 > threshold 200, so it should become solid pure white (255, 255, 255)
    expect(pixelData[0]).toBe(255);
    expect(pixelData[1]).toBe(255);
    expect(pixelData[2]).toBe(255);
    expect(pixelData[3]).toBe(255);
  });
});

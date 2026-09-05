import { describe, it, expect } from 'vitest';
import {
  FORMAT_MIME_MAP,
  FORMAT_EXT_MAP,
  canvasHasTransparency,
} from './convertImage';
import { generateDownloadFilename } from './downloadImage';

describe('Format Mappings', () => {
  it('maps jpeg to image/jpeg and jpg extension', () => {
    expect(FORMAT_MIME_MAP.jpeg).toBe('image/jpeg');
    expect(FORMAT_EXT_MAP.jpeg).toBe('jpg');
  });

  it('maps png to image/png and png extension', () => {
    expect(FORMAT_MIME_MAP.png).toBe('image/png');
    expect(FORMAT_EXT_MAP.png).toBe('png');
  });

  it('maps webp to image/webp and webp extension', () => {
    expect(FORMAT_MIME_MAP.webp).toBe('image/webp');
    expect(FORMAT_EXT_MAP.webp).toBe('webp');
  });
});

describe('generateDownloadFilename for converter', () => {
  it('generates filename with converted suffix and target format', () => {
    const filename = generateDownloadFilename('passport-photo.png', 'converted', 'jpg');
    expect(filename).toBe('passport-photo-converted.jpg');
  });

  it('handles spaces and special characters in input filename', () => {
    const filename = generateDownloadFilename('my scan 2026.jpeg', 'converted', 'webp');
    expect(filename).toBe('my scan 2026-converted.webp');
  });

  it('correctly maps target format png', () => {
    const filename = generateDownloadFilename('signature.webp', 'converted', 'png');
    expect(filename).toBe('signature-converted.png');
  });
});

describe('canvasHasTransparency', () => {
  it('returns false for mock canvas with opaque pixels', () => {
    const mockCanvas = {
      width: 10,
      height: 10,
      getContext: () => ({
        getImageData: () => ({
          data: new Uint8ClampedArray(10 * 10 * 4).fill(255), // All alpha channels = 255
        }),
      }),
    } as unknown as HTMLCanvasElement;

    expect(canvasHasTransparency(mockCanvas)).toBe(false);
  });

  it('returns true when canvas contains pixels with alpha < 250', () => {
    const pixelData = new Uint8ClampedArray(4 * 4).fill(255);
    // Set first pixel's alpha to 0 (transparent)
    pixelData[3] = 0;

    const mockCanvas = {
      width: 2,
      height: 2,
      getContext: () => ({
        getImageData: () => ({
          data: pixelData,
        }),
      }),
    } as unknown as HTMLCanvasElement;

    expect(canvasHasTransparency(mockCanvas)).toBe(true);
  });

  it('safely handles canvas getContext failure without throwing', () => {
    const mockCanvas = {
      width: 10,
      height: 10,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;

    expect(canvasHasTransparency(mockCanvas)).toBe(false);
  });
});

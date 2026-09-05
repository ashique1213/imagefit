import { describe, it, expect } from 'vitest';
import {
  hasExifMarkers,
  dmsToDecimal,
  inspectImageMetadata,
} from './exifInspector';

describe('exifInspector utilities', () => {
  it('correctly converts DMS coordinates to decimal degrees', () => {
    // 28° 36' 50.04" N
    const lat = dmsToDecimal([28, 36, 50.04], 'N');
    expect(lat).toBeCloseTo(28.6139, 3);

    // 77° 12' 32.4" W (West should be negative)
    const lonWest = dmsToDecimal([77, 12, 32.4], 'W');
    expect(lonWest).toBeLessThan(0);
    expect(lonWest).toBeCloseTo(-77.209, 3);

    // South should be negative
    const latSouth = dmsToDecimal([12, 30, 0], 'S');
    expect(latSouth).toBe(-12.5);
  });

  it('detects absence of EXIF markers in plain synthetic JPEG buffer', () => {
    const plainBuffer = new Uint8Array([
      0xff, 0xd8, // SOI
      0xff, 0xe0, // APP0 (JFIF, not EXIF)
      0x00, 0x10,
      0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0xff, 0xd9, // EOI
    ]).buffer;

    expect(hasExifMarkers(plainBuffer)).toBe(false);
  });

  it('detects presence of JPEG APP1 marker (0xFF 0xE1)', () => {
    const exifBuffer = new Uint8Array([
      0xff, 0xd8, // SOI
      0xff, 0xe1, // APP1 marker!
      0x00, 0x20, // length
      0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // 'Exif\0\0'
    ]).buffer;

    expect(hasExifMarkers(exifBuffer)).toBe(true);
  });

  it('detects PNG metadata text chunks (tEXt)', () => {
    const pngBuffer = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG Signature
      0x00, 0x00, 0x00, 0x0a,
      0x74, 0x45, 0x58, 0x74, // 'tEXt'
      0x53, 0x6f, 0x66, 0x74, 0x77, 0x61, 0x72, 0x65,
    ]).buffer;

    expect(hasExifMarkers(pngBuffer)).toBe(true);
  });

  it('inspects a clean synthetic JPEG file and assigns clean privacy risk', async () => {
    const rawData = new Uint8Array([
      0xff, 0xd8, // SOI
      0xff, 0xe0, // APP0 (JFIF)
      0x00, 0x10,
      0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0xff, 0xd9, // EOI
    ]);
    const file = new File([rawData], 'clean_passport.jpg', { type: 'image/jpeg' });

    const report = await inspectImageMetadata(file);
    expect(report).toBeDefined();
    expect(report.hasExif).toBe(false);
    expect(report.privacyRisk).toBe('clean');
    expect(report.gps).toBeUndefined();
    expect(report.riskReasons).toHaveLength(0);
  });
});

import { describe, it, expect } from 'vitest';
import { validateImageFile, verifyImageMagicBytes } from './fileValidation';

describe('fileValidation', () => {
  it('should detect valid PNG magic bytes', async () => {
    // 89 50 4E 47 0D 0A 1A 0A
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const file = new File([pngHeader], 'test.png', { type: 'image/png' });

    const detected = await verifyImageMagicBytes(file);
    expect(detected).toBe('image/png');

    const result = await validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.detectedType).toBe('image/png');
  });

  it('should detect valid JPEG magic bytes', async () => {
    // FF D8 FF
    const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const file = new File([jpegHeader], 'photo.jpg', { type: 'image/jpeg' });

    const detected = await verifyImageMagicBytes(file);
    expect(detected).toBe('image/jpeg');

    const result = await validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.detectedType).toBe('image/jpeg');
  });

  it('should detect valid WebP magic bytes', async () => {
    // RIFF (52 49 46 46) .... WEBP (57 45 42 50)
    const webpHeader = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20
    ]);
    const file = new File([webpHeader], 'banner.webp', { type: 'image/webp' });

    const detected = await verifyImageMagicBytes(file);
    expect(detected).toBe('image/webp');

    const result = await validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.detectedType).toBe('image/webp');
  });

  it('should reject disguised text files with .jpg extension', async () => {
    const textContent = new TextEncoder().encode('Hello world this is not an image');
    const file = new File([textContent], 'fake.jpg', { type: 'image/jpeg' });

    const detected = await verifyImageMagicBytes(file);
    expect(detected).toBeNull();

    const result = await validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Please upload a valid JPG, PNG, or WebP image');
  });

  it('should reject empty files', async () => {
    const emptyFile = new File([], 'empty.png', { type: 'image/png' });

    const result = await validateImageFile(emptyFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('empty (0 bytes)');
  });

  it('should reject files exceeding 30 MB', async () => {
    const hugeBlob = {
      name: 'large.jpg',
      type: 'image/jpeg',
      size: 35 * 1024 * 1024,
      slice: () => new Blob([]),
    } as unknown as File;

    const result = await validateImageFile(hugeBlob);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('too large to process safely');
  });
});

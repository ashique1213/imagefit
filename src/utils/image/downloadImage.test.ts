import { describe, it, expect } from 'vitest';
import { generateDownloadFilename } from './downloadImage';

describe('downloadImage', () => {
  it('generates informative filenames correctly', () => {
    expect(generateDownloadFilename('passport-photo.png', 'compressed', 'jpg')).toBe('passport-photo-compressed.jpg');
    expect(generateDownloadFilename('signature.jpeg', 'blue', 'png')).toBe('signature-blue.png');
    expect(generateDownloadFilename('document.webp', 'resized', 'webp')).toBe('document-resized.webp');
  });

  it('handles filenames without extension gracefully', () => {
    expect(generateDownloadFilename('myphoto', 'compressed', 'jpg')).toBe('myphoto-compressed.jpg');
  });
});

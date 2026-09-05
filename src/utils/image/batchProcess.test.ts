import { describe, it, expect } from 'vitest';
import {
  generateBatchZip,
  DEFAULT_BATCH_SETTINGS,
} from './batchProcess';
import type { BatchItem } from './batchProcess';

describe('DEFAULT_BATCH_SETTINGS', () => {
  it('defaults to target compression of 100 KB in JPEG format', () => {
    expect(DEFAULT_BATCH_SETTINGS.mode).toBe('compress');
    expect(DEFAULT_BATCH_SETTINGS.targetMaxKb).toBe(100);
    expect(DEFAULT_BATCH_SETTINGS.targetFormat).toBe('image/jpeg');
  });
});

describe('generateBatchZip', () => {
  it('throws error when queue contains no completed items', async () => {
    const emptyItems: BatchItem[] = [
      {
        id: '1',
        file: new File([], 'test.jpg'),
        name: 'test.jpg',
        originalSizeBytes: 1000,
        originalFormattedSize: '1 KB',
        previewUrl: 'blob:test',
        width: 100,
        height: 100,
        status: 'pending',
      },
    ];

    await expect(generateBatchZip(emptyItems)).rejects.toThrow(
      'No successfully processed files available to package in ZIP archive.'
    );
  });

  it('successfully generates a zip archive blob when completed items are present', async () => {
    const mockBlob = new Blob(['sample-image-content'], { type: 'image/jpeg' });

    const completedItems: BatchItem[] = [
      {
        id: '1',
        file: new File([], 'photo.jpg'),
        name: 'photo.jpg',
        originalSizeBytes: 2000,
        originalFormattedSize: '2 KB',
        previewUrl: 'blob:mock-1',
        width: 300,
        height: 400,
        status: 'done',
        result: {
          blob: mockBlob,
          previewUrl: 'blob:mock-res-1',
          sizeBytes: 1500,
          formattedSize: '1.5 KB',
          width: 300,
          height: 400,
          outputFilename: 'photo-compressed.jpg',
          format: 'jpg',
        },
      },
      {
        id: '2',
        file: new File([], 'signature.png'),
        name: 'signature.png',
        originalSizeBytes: 3000,
        originalFormattedSize: '3 KB',
        previewUrl: 'blob:mock-2',
        width: 200,
        height: 100,
        status: 'done',
        result: {
          blob: mockBlob,
          previewUrl: 'blob:mock-res-2',
          sizeBytes: 1800,
          formattedSize: '1.8 KB',
          width: 200,
          height: 100,
          outputFilename: 'signature-compressed.jpg',
          format: 'jpg',
        },
      },
    ];

    const zipResult = await generateBatchZip(completedItems, 'my-application-docs.zip');
    expect(zipResult.filename).toBe('my-application-docs.zip');
    expect(zipResult.blob).toBeInstanceOf(Blob);
    expect(zipResult.blob.size).toBeGreaterThan(0);
  });
});

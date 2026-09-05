import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  Archive,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { BatchDropzone } from '../components/batch/BatchDropzone';
import { BatchQueueList } from '../components/batch/BatchQueueList';
import { BatchSettingsControls } from '../components/batch/BatchSettingsControls';
import { BatchProgressCard } from '../components/batch/BatchProgressCard';
import {
  type BatchItem,
  type BatchSettings,
  DEFAULT_BATCH_SETTINGS,
  processBatchItem,
  createSampleBatchFiles,
} from '../../src/utils/image/batchProcess';
import { loadImageMetadata, revokeObjectUrl } from '../utils/image/loadImage';

export const BatchProcessorPage: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [settings, setSettings] = useState<BatchSettings>(DEFAULT_BATCH_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // Safely cleanup all object URLs when unmounting
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        revokeObjectUrl(item.previewUrl);
        if (item.result?.previewUrl) {
          revokeObjectUrl(item.result.previewUrl);
        }
      });
    };
  }, []);

  const addFilesToQueue = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const invalidNames: string[] = [];

    files.forEach((file) => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      const isAllowed =
        type === 'image/jpeg' ||
        type === 'image/png' ||
        type === 'image/webp' ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.png') ||
        name.endsWith('.webp');

      if (isAllowed) {
        validFiles.push(file);
      } else {
        invalidNames.push(file.name);
      }
    });

    if (invalidNames.length > 0) {
      setError(
        `Skipped unsupported files: ${invalidNames.slice(0, 3).join(', ')}${
          invalidNames.length > 3 ? ` and ${invalidNames.length - 3} more` : ''
        }. Please upload JPG, PNG, or WebP images.`
      );
    }

    if (validFiles.length === 0) return;

    // Load metadata and create preview URLs for new items
    const newItems: BatchItem[] = [];
    for (const file of validFiles) {
      try {
        const meta = await loadImageMetadata(file);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          originalSizeBytes: file.size,
          originalFormattedSize: meta.formattedSize,
          previewUrl: meta.previewUrl,
          width: meta.width,
          height: meta.height,
          status: 'pending',
        });
      } catch (err: any) {
        console.warn(`Failed to inspect ${file.name}:`, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        revokeObjectUrl(target.previewUrl);
        if (target.result?.previewUrl) {
          revokeObjectUrl(target.result.previewUrl);
        }
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    items.forEach((item) => {
      revokeObjectUrl(item.previewUrl);
      if (item.result?.previewUrl) {
        revokeObjectUrl(item.result.previewUrl);
      }
    });
    setItems([]);
    setError(null);
  }, [items]);

  const handleResetBatch = useCallback(() => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.result?.previewUrl) {
          revokeObjectUrl(item.result.previewUrl);
        }
        return {
          ...item,
          status: 'pending',
          error: undefined,
          result: undefined,
        };
      })
    );
  }, []);

  const triggerAddMore = () => {
    hiddenFileInputRef.current?.click();
  };

  const handleHiddenFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(Array.from(e.target.files));
    }
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.value = '';
    }
  };

  const handleProcessBatch = async () => {
    if (items.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setError(null);

    for (let i = 0; i < items.length; i++) {
      const currentItem = items[i];
      // Mark as processing
      setItems((prev) =>
        prev.map((item) =>
          item.id === currentItem.id ? { ...item, status: 'processing', error: undefined } : item
        )
      );

      try {
        const result = await processBatchItem(currentItem, settings);
        setItems((prev) =>
          prev.map((item) =>
            item.id === currentItem.id ? { ...item, status: 'done', result } : item
          )
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === currentItem.id
              ? {
                  ...item,
                  status: 'error',
                  error: err.message || 'Processing failed in browser canvas.',
                }
              : item
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const hasProcessedItems = items.some((i) => i.status === 'done' || i.status === 'error');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hidden file input for "Add More" */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleHiddenFileInputChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="blue" size="md">
          Bulk Multi-File Processing Studio
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Layers className="w-8 h-8 text-blue-400" />
          Batch Processor & ZIP Bundle
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Compress to target KB, convert formats, or resize dozens of photos simultaneously in
          browser memory. Package all processed outputs into a single client-side ZIP archive.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Main Content Area */}
      {items.length === 0 ? (
        <div className="space-y-6">
          {/* Empty state Dropzone */}
          <BatchDropzone onFilesSelected={addFilesToQueue} />

          {/* Quick Demo Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={async () => {
                const samples = await createSampleBatchFiles();
                addFilesToQueue(samples);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-semibold shadow-lg shadow-blue-500/5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Or click here to test with 3 sample applicant images</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Batch Target KB Limits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies binary-search compression across all selected images so every single file
                adheres strictly to job or examination portal size caps (e.g., 50KB or 100KB).
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Archive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Direct Client-Side ZIP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No need to click download 50 times. All finished files are assembled into a clean
                ZIP archive directly inside browser memory without contacting any server.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Server Transmission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All photos, signatures, and certificates stay 100% on your local machine. Ideal for
                confidential ID photos, government cards, and private documents.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Settings & Progress/ZIP */}
          <div className="lg:col-span-6 space-y-6">
            <BatchSettingsControls
              settings={settings}
              onChangeSettings={setSettings}
              onProcessBatch={handleProcessBatch}
              isProcessing={isProcessing}
              totalItems={items.length}
            />

            {(isProcessing || hasProcessedItems) && (
              <BatchProgressCard
                items={items}
                isProcessing={isProcessing}
                onReset={handleResetBatch}
              />
            )}
          </div>

          {/* Right Column: Queue List */}
          <div className="lg:col-span-6">
            <BatchQueueList
              items={items}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onAddMore={triggerAddMore}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

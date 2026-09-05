export type ToolCategory = 'compress' | 'batch' | 'metadata' | 'resize' | 'convert' | 'signature' | 'background' | 'crop' | 'editor';

export interface ToolInfo {
  id: ToolCategory;
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  path: string;
  badge?: string;
  popular?: boolean;
}

export interface ImageMetadata {
  file: File;
  name: string;
  sizeBytes: number;
  formattedSize: string;
  type: string;
  formatExtension: string;
  width: number;
  height: number;
  aspectRatio: string;
  aspectRatioNumeric: number;
  previewUrl: string;
}

export interface ProcessingResult {
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  format: string;
  achievableStatus?: 'exact' | 'closest' | 'success';
}

export interface PresetItem {
  id: string;
  label: string;
  category: 'passport' | 'signature' | 'document' | 'social';
  width: number;
  height: number;
  maxKb?: number;
  format?: 'jpg' | 'png' | 'webp';
  description: string;
}

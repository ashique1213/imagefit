import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ImageCompressorPage } from '../pages/ImageCompressor';
import { ImageResizerPage } from '../pages/ImageResizer';
import { ImageConverterPage } from '../pages/ImageConverter';
import { SignatureToolPage } from '../pages/SignatureTool';
import { BackgroundToolPage } from '../pages/BackgroundTool';
import { CropToolPage } from '../pages/CropTool';
import { ImageEditorPage } from '../pages/ImageEditor';
import { ApplicationPipelinePage } from '../pages/ApplicationPipeline';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pipeline" element={<ApplicationPipelinePage />} />
      <Route path="/compress" element={<ImageCompressorPage />} />
      <Route path="/resize" element={<ImageResizerPage />} />
      <Route path="/convert" element={<ImageConverterPage />} />
      <Route path="/signature" element={<SignatureToolPage />} />
      <Route path="/background" element={<BackgroundToolPage />} />
      <Route path="/crop" element={<CropToolPage />} />
      <Route path="/editor" element={<ImageEditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Eager load homepage for instant initial paint
import { Home } from '../pages/Home';

// Lazy-load dedicated tool suites on demand
const ApplicationPipelinePage = lazy(() =>
  import('../pages/ApplicationPipeline').then((m) => ({ default: m.ApplicationPipelinePage }))
);
const BatchProcessorPage = lazy(() =>
  import('../pages/BatchProcessor').then((m) => ({ default: m.BatchProcessorPage }))
);
const MetadataStripperPage = lazy(() =>
  import('../pages/MetadataStripper').then((m) => ({ default: m.MetadataStripperPage }))
);
const ImageCompressorPage = lazy(() =>
  import('../pages/ImageCompressor').then((m) => ({ default: m.ImageCompressorPage }))
);
const ImageResizerPage = lazy(() =>
  import('../pages/ImageResizer').then((m) => ({ default: m.ImageResizerPage }))
);
const ImageConverterPage = lazy(() =>
  import('../pages/ImageConverter').then((m) => ({ default: m.ImageConverterPage }))
);
const SignatureToolPage = lazy(() =>
  import('../pages/SignatureTool').then((m) => ({ default: m.SignatureToolPage }))
);
const BackgroundToolPage = lazy(() =>
  import('../pages/BackgroundTool').then((m) => ({ default: m.BackgroundToolPage }))
);
const CropToolPage = lazy(() =>
  import('../pages/CropTool').then((m) => ({ default: m.CropToolPage }))
);
const ImageEditorPage = lazy(() =>
  import('../pages/ImageEditor').then((m) => ({ default: m.ImageEditorPage }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pipeline" element={<ApplicationPipelinePage />} />
        <Route path="/batch" element={<BatchProcessorPage />} />
        <Route path="/metadata" element={<MetadataStripperPage />} />
        <Route path="/compress" element={<ImageCompressorPage />} />
        <Route path="/resize" element={<ImageResizerPage />} />
        <Route path="/convert" element={<ImageConverterPage />} />
        <Route path="/signature" element={<SignatureToolPage />} />
        <Route path="/background" element={<BackgroundToolPage />} />
        <Route path="/crop" element={<CropToolPage />} />
        <Route path="/editor" element={<ImageEditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

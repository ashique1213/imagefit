# ImageFit

Client-Side Image and Signature Optimization Engine for Online Applications and Document Portals.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-86%20Passed-brightgreen.svg)](https://vitest.dev/)

---

## Overview

ImageFit is a high-performance, browser-native utility designed to prepare photographs, official identity documents, and handwritten signatures for stringent online portal requirements (such as government exams, passport authorities, and visa applications).

Unlike conventional online image processing services that upload sensitive documents to remote servers, ImageFit executes all decompression, pixel manipulation, encoding, and compression locally within the browser memory using HTML5 Canvas and modern Web APIs. No user data, images, or metadata are ever transmitted over the network.

---

## Core Capabilities

### 1. Target-Size Compression Engine
- Constrains output file size strictly beneath specific thresholds (e.g., `< 20 KB`, `< 50 KB`, `< 100 KB`, `< 200 KB`).
- Implements an iterative binary search algorithm to determine optimal JPEG/WebP quality quantization.
- Includes automated fallback dimension downscaling if compression alone cannot satisfy strict size boundaries.
- Provides dual operational modes: Exact Target Size or Manual Quality Slider (5% to 100%).

### 2. Dimension and Aspect Ratio Resizing
- Precise pixel adjustments with configurable width and height constraints.
- Percentage-based scaling (25%, 50%, 75%, 200%).
- Proportional aspect ratio locking with automated dimension inference.
- Preconfigured portal dimensions including SSC, UPSC, US Visa (600x600 px), Schengen Visa, Passport (35x45 mm), and PAN Card specifications.

### 3. Signature Processing and Recoloring
- Eliminates paper shadows, uneven lighting, notebook lines, and camera glare from captured signatures.
- High-contrast thresholding algorithm that preserves fine pen stroke details.
- Digital ink recoloring: converts faint handwriting into compliant Ballpoint Blue (#0033aa) or Deep Black (#111111).
- Edge smoothing and anti-aliasing to prevent pixelation on submission forms.

### 4. Background Segmentation and Replacement
- Perimeter color sampling for automatic backdrop isolation.
- Chroma-key based background removal with configurable tolerance and edge feathering.
- Instant replacement with official compliance backdrops: Pure White (sRGB 255, 255, 255), Light Blue (sRGB 180, 210, 240), or Transparent PNG.

### 5. Document Cropping
- Fixed-ratio bounding boxes for standard document standards (1:1 Square, 3:5 / 35x45mm Passport, 4:5, 16:9).
- Responsive zoom, drag-to-reposition, and precision cropping coordinates.

### 6. Format Conversion
- High-efficiency encoding between JPEG, PNG, and WebP formats.
- Alpha channel matte handling: automatically applies custom matte backgrounds (Pure White, Neutral Gray, or Custom Hex) when converting transparent PNG assets to JPEG.

### 7. Image Adjustments and Transformations
- Exact rotation controls (90-degree steps and free-form angle adjustments).
- Horizontal and vertical canvas flipping.
- Brightness, contrast, exposure, and monochrome/grayscale tone filters.

### 8. End-to-End Application Wizard
- Streamlined multi-step pipeline executing crop, resize, background normalization, and target compression in a single sequential workflow.
- Preset configurations tailored for major institutional application standards.

### 9. Metadata and EXIF Sanitization
- Parses and inspects embedded EXIF, TIFF, and GPS metadata tags.
- Strips device identification, geolocation coordinates, timestamps, and camera serialization data prior to download.

### 10. High-Throughput Batch Processing
- Parallel image processing pipeline utilizing client-side asynchronous execution.
- Uniform multi-file operations for resizing, compression, and format standardization.
- Automated ZIP packaging and export via JSZip.

---

## Privacy and Security Model

- **Zero Remote Storage**: All image transformations execute strictly in client RAM using the HTML5 Canvas 2D Context and TypedArrays.
- **No Data Telemetry**: No third-party trackers, analytics, or behavioral cookies are embedded.
- **Offline Reliability**: Fully functional without active network connectivity once initialized, supported by service worker caching.

---

## Technical Stack

| Category | Technology |
|---|---|
| Core Framework | React 19, TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS |
| Iconography | Lucide React |
| Archive Generation | JSZip |
| Test Suite | Vitest, React Testing Library |

---

## Project Structure

```
imagefit/
├── src/
│   ├── components/       # UI components, layout, common elements
│   ├── pages/            # Application views and tool interfaces
│   │   ├── tools/        # Tool implementations (Compress, Resize, Signature, etc.)
│   │   └── wizard/       # Guided application pipeline workflow
│   ├── presets/          # Official exam and portal dimension standards
│   ├── types/            # TypeScript interfaces and domain types
│   ├── utils/            # Core processing algorithms and utilities
│   │   ├── image/        # Canvas manipulation, compression, EXIF, and batch logic
│   │   ├── validation/   # MIME type, extension, and file size validation
│   │   └── formatting/   # String and unit formatting utilities
│   ├── App.tsx           # Application route definitions
│   └── main.tsx          # Application entry point
├── tests/                # Unit and integration test suites
├── public/               # Static assets and application manifest
├── package.json          # Dependency declarations and scripts
└── vite.config.ts        # Vite build configuration
```

---

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or later recommended)
- npm (version 9.0.0 or later) or compatible package manager

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ashique1213/imagefit.git
cd imagefit
npm install
```

### Development Server

Start the local development server with hot-module replacement:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Running Tests

Execute the automated test suite:

```bash
npm test
```

### Production Build

Type-check and generate the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run static code analysis:

```bash
npm run lint
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

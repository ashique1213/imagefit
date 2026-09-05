# ImageFit 📸

> **Free, Privacy-First In-Browser Image & Signature Utility for Online Applications & Exam Portals**

ImageFit is an offline-capable, client-side web application designed to help applicants, students, and professionals prepare photos, government IDs, and signatures to exact portal specifications (file size in KB, dimensions in pixels/cm, official backdrops, and format requirements) — **without uploading sensitive personal images to any external server**.

---

## 🌟 Key Features & Tools

ImageFit features 10 dedicated utility modules running 100% in your browser's local memory:

1. **Smart Photo Compressor**
   - Exact Target Size matching (e.g. compress to strictly under 20 KB, 50 KB, 100 KB, or 200 KB).
   - Dynamic quality estimation with automatic dimension downscaling fallback if necessary.
   - Dual mode: Target Size (KB/MB) or Manual Quality slider (5% to 100%).

2. **Dimension Resizer**
   - Pixel dimensions or percentage scaling (25%, 50%, 75%, 200%).
   - Aspect ratio locking with smart auto-dimension calculation.
   - Built-in portal presets (SSC, UPSC, US Visa, Schengen Visa, Passport, PAN Card).

3. **Format Converter**
   - Convert seamlessly between JPEG, PNG, and next-gen WebP.
   - Smart alpha channel handling with configurable matte background (Pure White, Neutral Gray, or Custom).

4. **Signature Cleaner & Recolorer**
   - Eliminates gray shadows, yellowish notebook casts, and mobile camera glare.
   - Recolor faint handwriting directly into official Deep Black or Ballpoint Blue ink.
   - Anti-aliased edge smoothing algorithm for crisp submission quality.

5. **Background Replacement Tool**
   - Automatic perimeter background color sampling and chroma-key removal.
   - Adjustable tolerance and edge feathering.
   - One-click official backdrops (Pure White for US/SSC portals, Light Blue for UK/EU passports, or Transparent PNG).

6. **Aspect Ratio Cropper**
   - Official document ratios (1:1 Square, 3:5 / 35×45mm Passport, 4:5, 16:9, etc.).
   - Interactive draggable crop handles with responsive zoom controls.

7. **Transformations & Adjustments Editor**
   - Fine-grained rotation (90° clockwise/counter-clockwise or custom angles).
   - Horizontal and vertical flipping.
   - Brightness, contrast, and black & white / grayscale filters.

8. **Application Wizard Pipeline**
   - Complete multi-step optimization in a single automated flow.
   - Preset-driven (e.g. "SSC Photo Standard", "UPSC Signature Standard", "US Visa 2x2").

9. **EXIF & Metadata Sanitizer**
   - Inspect all embedded metadata tags (GPS coordinates, camera device models, timestamps, software).
   - One-click EXIF stripping before uploading documents to public portals.

10. **High-Throughput Batch Processor**
    - Process multiple images simultaneously in browser memory.
    - Uniform compression, resizing, and format conversion.
    - One-click ZIP archive generation and download.

---

## 🔒 Privacy & Security Guarantee

- **Zero Server Uploads**: Every byte is decoded, manipulated, and rendered locally via HTML5 Canvas, Web Audio/Image APIs, and Blob URLs.
- **Works 100% Offline**: Integrated Progressive Web App (PWA) with Service Worker caching allows full offline usage once loaded.
- **No Analytics / No Tracking**: No personal tracking cookies or telemetry.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS (sleek dark mode design system)
- **Icons**: Lucide React
- **ZIP Packaging**: JSZip (client-side archiving)
- **PWA**: vite-plugin-pwa (offline service worker cache)
- **Testing**: Vitest + React Testing Library (86 passing unit tests)

---

## 🛠️ Development & Building

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/imagefit.git
cd imagefit

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running Tests
```bash
# Run unit tests via Vitest
npm test -- --run
```

### Building for Production
```bash
# Typecheck and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

MIT License. Free for personal and commercial use.

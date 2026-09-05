/**
 * Lightweight Zero-Dependency Client-Side EXIF & Image Metadata Inspector and Stripper
 *
 * Parses JPEG APP1 (0xFF 0xE1) markers and TIFF IFD structures to extract:
 * - Camera make, model, software
 * - Date/time taken
 * - GPS latitude, longitude, altitude
 * - Exposure settings (ISO, Aperture, Shutter Speed)
 *
 * Also provides canvas-based metadata stripping and binary marker verification.
 */

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
  mapUrl?: string;
}

export interface CameraDetails {
  make?: string;
  model?: string;
  software?: string;
  lensModel?: string;
}

export interface ExposureDetails {
  iso?: number;
  fNumber?: number;
  exposureTime?: string;
  focalLength?: number;
}

export type PrivacyRiskLevel = 'clean' | 'moderate' | 'high';

export interface ExifReport {
  hasExif: boolean;
  privacyRisk: PrivacyRiskLevel;
  riskReasons: string[];
  rawTagCount: number;
  camera: CameraDetails;
  dateTimeOriginal?: string;
  exposure: ExposureDetails;
  gps?: GpsCoordinates;
  dimensions?: { width: number; height: number };
  rawTags: Record<string, string | number>;
}

export interface SanitizationResult {
  sanitizedBlob: Blob;
  previewUrl: string;
  sizeBytes: number;
  formattedSize: string;
  isExifRemoved: boolean;
  format: string;
  filename: string;
}

/**
 * Checks whether an ArrayBuffer contains JPEG APP1 (EXIF) markers (0xFF 0xE1)
 * or PNG metadata chunks (tEXt, iTXt, zTXt).
 */
export function hasExifMarkers(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4) return false;

  // JPEG check: scan for 0xFF 0xE1 (APP1 marker)
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset < bytes.length - 4) {
      if (bytes[offset] === 0xff && bytes[offset + 1] === 0xe1) {
        return true;
      }
      // If Start Of Scan (0xFF 0xDA) is reached, metadata segments have passed
      if (bytes[offset] === 0xff && bytes[offset + 1] === 0xda) {
        break;
      }
      offset++;
    }
  }

  // PNG check: search for tEXt, iTXt, zTXt chunks
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const textSignature = new TextDecoder('latin1').decode(bytes.slice(0, Math.min(bytes.length, 8192)));
    if (
      textSignature.includes('tEXt') ||
      textSignature.includes('iTXt') ||
      textSignature.includes('zTXt')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Converts degrees, minutes, seconds array to decimal degrees
 */
export function dmsToDecimal(dms: [number, number, number], ref: string): number {
  let decimal = dms[0] + dms[1] / 60 + dms[2] / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return Number(decimal.toFixed(6));
}

/**
 * Reads a 16-bit unsigned integer from DataView respecting endianness
 */
function getUint16(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint16(offset, littleEndian);
}

/**
 * Reads a 32-bit unsigned integer from DataView respecting endianness
 */
function getUint32(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint32(offset, littleEndian);
}

/**
 * Parses a TIFF tag value from IFD
 */
function readTagValue(
  view: DataView,
  type: number,
  count: number,
  valOffset: number,
  tiffStart: number,
  littleEndian: boolean
): any {
  // Types: 1=BYTE, 2=ASCII, 3=SHORT, 4=LONG, 5=RATIONAL, 7=UNDEFINED, 9=SLONG, 10=SRATIONAL
  if (type === 2) {
    // ASCII string
    const stringOffset = count > 4 ? tiffStart + valOffset : valOffset;
    let str = '';
    for (let i = 0; i < count - 1; i++) {
      const charCode = view.getUint8(stringOffset + i);
      if (charCode === 0) break;
      str += String.fromCharCode(charCode);
    }
    return str.trim();
  }

  if (type === 3) {
    // SHORT (16-bit)
    return getUint16(view, valOffset, littleEndian);
  }

  if (type === 4) {
    // LONG (32-bit)
    return getUint32(view, valOffset, littleEndian);
  }

  if (type === 5) {
    // RATIONAL (numerator / denominator)
    const ratOffset = tiffStart + valOffset;
    if (ratOffset + 8 <= view.byteLength) {
      const num = getUint32(view, ratOffset, littleEndian);
      const den = getUint32(view, ratOffset + 4, littleEndian);
      return den !== 0 ? num / den : 0;
    }
    return 0;
  }

  return undefined;
}

/**
 * Parses EXIF metadata from a File's ArrayBuffer.
 */
export async function inspectImageMetadata(file: File): Promise<ExifReport> {
  const buffer = await file.slice(0, 128 * 1024).arrayBuffer();
  const view = new DataView(buffer);

  const report: ExifReport = {
    hasExif: false,
    privacyRisk: 'clean',
    riskReasons: [],
    rawTagCount: 0,
    camera: {},
    exposure: {},
    rawTags: {},
  };

  // Must be JPEG to have standard APP1 EXIF
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    // Check PNG for basic text chunks
    if (hasExifMarkers(buffer)) {
      report.hasExif = true;
      report.privacyRisk = 'moderate';
      report.riskReasons.push('Embedded PNG text metadata chunks detected');
      report.rawTags['Format'] = 'PNG Text Metadata (tEXt/iTXt)';
    }
    return report;
  }

  let offset = 2;
  let app1Found = false;

  while (offset < view.byteLength - 4) {
    const marker = view.getUint16(offset);
    if (marker === 0xffe1) {
      // APP1 Marker found
      app1Found = true;
      offset += 2;
      break;
    } else if ((marker & 0xff00) === 0xff00 && marker !== 0xffd8) {
      // Skip other markers
      const length = view.getUint16(offset + 2);
      offset += 2 + length;
    } else {
      break;
    }
  }

  if (!app1Found || offset + 6 > view.byteLength) {
    return report;
  }

  // Check 'Exif\0\0' header (0x45 0x78 0x69 0x66 0x00 0x00)
  const exifHeader = view.getUint32(offset + 2);
  if (exifHeader !== 0x45786966) {
    return report;
  }

  report.hasExif = true;
  const tiffStart = offset + 8;

  // Determine endianness: II (0x4949) = Little Endian, MM (0x4D4D) = Big Endian
  const endianBytes = view.getUint16(tiffStart);
  const littleEndian = endianBytes === 0x4949;

  // Validate 42 marker (0x002A)
  if (getUint16(view, tiffStart + 2, littleEndian) !== 42) {
    return report;
  }

  // Offset to IFD0
  const firstIfdOffset = getUint32(view, tiffStart + 4, littleEndian);
  let ifdOffset = tiffStart + firstIfdOffset;

  let exifSubIfdOffset = 0;
  let gpsSubIfdOffset = 0;

  // Read IFD0 tags
  if (ifdOffset + 2 <= view.byteLength) {
    const tagCount = getUint16(view, ifdOffset, littleEndian);
    ifdOffset += 2;

    for (let i = 0; i < tagCount && ifdOffset + 12 <= view.byteLength; i++) {
      const tag = getUint16(view, ifdOffset, littleEndian);
      const type = getUint16(view, ifdOffset + 2, littleEndian);
      const count = getUint32(view, ifdOffset + 4, littleEndian);
      const valOffset = ifdOffset + 8;

      const value = readTagValue(view, type, count, valOffset, tiffStart, littleEndian);

      if (value !== undefined) {
        report.rawTagCount++;
        if (tag === 0x010f) {
          report.camera.make = String(value);
          report.rawTags['Camera Make'] = String(value);
        } else if (tag === 0x0110) {
          report.camera.model = String(value);
          report.rawTags['Camera Model'] = String(value);
        } else if (tag === 0x0131) {
          report.camera.software = String(value);
          report.rawTags['Software'] = String(value);
        } else if (tag === 0x0132) {
          report.dateTimeOriginal = String(value);
          report.rawTags['DateTime'] = String(value);
        } else if (tag === 0x8769) {
          // Pointer to Exif SubIFD
          exifSubIfdOffset = tiffStart + Number(value);
        } else if (tag === 0x8825) {
          // Pointer to GPS SubIFD
          gpsSubIfdOffset = tiffStart + Number(value);
        }
      }

      ifdOffset += 12;
    }
  }

  // Read Exif SubIFD (Exposure, lens, original timestamps)
  if (exifSubIfdOffset > 0 && exifSubIfdOffset + 2 <= view.byteLength) {
    const tagCount = getUint16(view, exifSubIfdOffset, littleEndian);
    let subOffset = exifSubIfdOffset + 2;

    for (let i = 0; i < tagCount && subOffset + 12 <= view.byteLength; i++) {
      const tag = getUint16(view, subOffset, littleEndian);
      const type = getUint16(view, subOffset + 2, littleEndian);
      const count = getUint32(view, subOffset + 4, littleEndian);
      const valOffset = subOffset + 8;

      const value = readTagValue(view, type, count, valOffset, tiffStart, littleEndian);

      if (value !== undefined) {
        report.rawTagCount++;
        if (tag === 0x9003 || tag === 0x9004) {
          report.dateTimeOriginal = String(value);
          report.rawTags['Date Taken'] = String(value);
        } else if (tag === 0x829d) {
          report.exposure.fNumber = Number(Number(value).toFixed(1));
          report.rawTags['Aperture'] = `f/${report.exposure.fNumber}`;
        } else if (tag === 0x8827) {
          report.exposure.iso = Number(value);
          report.rawTags['ISO'] = Number(value);
        } else if (tag === 0x920a) {
          report.exposure.focalLength = Number(Number(value).toFixed(1));
          report.rawTags['Focal Length'] = `${report.exposure.focalLength} mm`;
        } else if (tag === 0xa434) {
          report.camera.lensModel = String(value);
          report.rawTags['Lens Model'] = String(value);
        }
      }
      subOffset += 12;
    }
  }

  // Read GPS SubIFD
  if (gpsSubIfdOffset > 0 && gpsSubIfdOffset + 2 <= view.byteLength) {
    const tagCount = getUint16(view, gpsSubIfdOffset, littleEndian);
    let gpsOffset = gpsSubIfdOffset + 2;

    let latDms: [number, number, number] | null = null;
    let latRef = 'N';
    let lonDms: [number, number, number] | null = null;
    let lonRef = 'E';
    let altVal: number | undefined = undefined;

    for (let i = 0; i < tagCount && gpsOffset + 12 <= view.byteLength; i++) {
      const tag = getUint16(view, gpsOffset, littleEndian);
      const type = getUint16(view, gpsOffset + 2, littleEndian);
      const count = getUint32(view, gpsOffset + 4, littleEndian);
      const valOffset = gpsOffset + 8;

      if (tag === 0x0001) {
        // Latitude Ref (N / S)
        latRef = String.fromCharCode(view.getUint8(valOffset));
      } else if (tag === 0x0002 && type === 5 && count === 3) {
        // Latitude DMS
        const rOffset = tiffStart + getUint32(view, valOffset, littleEndian);
        if (rOffset + 24 <= view.byteLength) {
          const d = getUint32(view, rOffset, littleEndian) / (getUint32(view, rOffset + 4, littleEndian) || 1);
          const m = getUint32(view, rOffset + 8, littleEndian) / (getUint32(view, rOffset + 12, littleEndian) || 1);
          const s = getUint32(view, rOffset + 16, littleEndian) / (getUint32(view, rOffset + 20, littleEndian) || 1);
          latDms = [d, m, s];
        }
      } else if (tag === 0x0003) {
        // Longitude Ref (E / W)
        lonRef = String.fromCharCode(view.getUint8(valOffset));
      } else if (tag === 0x0004 && type === 5 && count === 3) {
        // Longitude DMS
        const rOffset = tiffStart + getUint32(view, valOffset, littleEndian);
        if (rOffset + 24 <= view.byteLength) {
          const d = getUint32(view, rOffset, littleEndian) / (getUint32(view, rOffset + 4, littleEndian) || 1);
          const m = getUint32(view, rOffset + 8, littleEndian) / (getUint32(view, rOffset + 12, littleEndian) || 1);
          const s = getUint32(view, rOffset + 16, littleEndian) / (getUint32(view, rOffset + 20, littleEndian) || 1);
          lonDms = [d, m, s];
        }
      } else if (tag === 0x0006 && type === 5) {
        // Altitude
        const rOffset = tiffStart + getUint32(view, valOffset, littleEndian);
        if (rOffset + 8 <= view.byteLength) {
          altVal = Number(
            (getUint32(view, rOffset, littleEndian) / (getUint32(view, rOffset + 4, littleEndian) || 1)).toFixed(1)
          );
        }
      }

      gpsOffset += 12;
    }

    if (latDms && lonDms) {
      const lat = dmsToDecimal(latDms, latRef);
      const lon = dmsToDecimal(lonDms, lonRef);
      report.gps = {
        latitude: lat,
        longitude: lon,
        altitude: altVal,
        latitudeRef: latRef,
        longitudeRef: lonRef,
        mapUrl: `https://www.google.com/maps?q=${lat},${lon}`,
      };
      report.rawTags['GPS Coordinates'] = `${lat}, ${lon} (${latRef}/${lonRef})`;
      if (altVal !== undefined) {
        report.rawTags['GPS Altitude'] = `${altVal} meters`;
      }
    }
  }

  // Calculate Privacy Risk Level
  if (report.gps) {
    report.privacyRisk = 'high';
    report.riskReasons.push(
      `Exact GPS location embedded: ${report.gps.latitude}°, ${report.gps.longitude}°`
    );
  }

  if (report.camera.make || report.camera.model) {
    if (report.privacyRisk !== 'high') report.privacyRisk = 'moderate';
    report.riskReasons.push(
      `Device identifiers exposed: ${[report.camera.make, report.camera.model].filter(Boolean).join(' ')}`
    );
  }

  if (report.dateTimeOriginal) {
    if (report.privacyRisk === 'clean') report.privacyRisk = 'moderate';
    report.riskReasons.push(`Exact capture timestamp exposed: ${report.dateTimeOriginal}`);
  }

  if (report.hasExif && report.riskReasons.length === 0) {
    report.riskReasons.push('Standard photographic parameters and tags detected');
  }

  return report;
}

export interface SanitizerOptions {
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number; // 0.1 to 1.0
  customFilename?: string;
}

/**
 * Strips 100% of EXIF, GPS, camera metadata, and thumbnails by rendering
 * onto an HTML5 Canvas and exporting a clean compressed Blob.
 */
export async function stripImageMetadata(
  file: File,
  options: SanitizerOptions = {}
): Promise<SanitizationResult> {
  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Browser canvas context not available.'));
          return;
        }

        // Fill background with white if converting to JPEG
        const targetFormat = options.format || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const quality = options.quality !== undefined ? options.quality : 0.92;

        canvas.toBlob(
          async (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Failed to encode sanitized image blob.'));
              return;
            }

            const cleanBuffer = await blob.arrayBuffer();
            const isExifRemoved = !hasExifMarkers(cleanBuffer);

            const previewUrl = URL.createObjectURL(blob);
            const ext = targetFormat.split('/')[1] || 'jpg';
            const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
            const originalBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const filename = options.customFilename || `${originalBase}_clean.${cleanExt}`;

            resolve({
              sanitizedBlob: blob,
              previewUrl,
              sizeBytes: blob.size,
              formattedSize: formatBytes(blob.size),
              isExifRemoved,
              format: cleanExt.toUpperCase(),
              filename,
            });
          },
          targetFormat,
          quality
        );
      } catch (err: any) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image in memory for sanitization.'));
    };

    img.src = objectUrl;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Creates a synthetic demo image containing simulated EXIF / GPS markers
 * for testing and immediate user demonstration without requiring phone photos.
 */
export async function createSampleExifDemoImage(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Elegant passport background
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 720, 520);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIF PRIVACY TEST SPECIMEN', 400, 260);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Simulated Smartphone Capture (GPS Coordinates & Device Tags)', 400, 310);
    ctx.fillText('Lat: 28.6139° N, Lon: 77.2090° E | iPhone 15 Pro', 400, 350);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(new File([blob!], 'smartphone_portrait_sample.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.95
    );
  });
}

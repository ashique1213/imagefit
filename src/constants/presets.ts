export interface ResizePreset {
  id: string;
  name: string;
  category: 'passport' | 'signature' | 'exam' | 'web';
  width: number;
  height: number;
  description: string;
  defaultFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  aspectRatioNote?: string;
  maxKbEstimate?: number;
}

export const RESIZE_PRESETS: ResizePreset[] = [
  // --- Passport & ID ---
  {
    id: 'passport-standard',
    name: 'Standard Passport (35×45 mm)',
    category: 'passport',
    width: 350,
    height: 450,
    description: '35×45mm standard photo format used across India, Schengen, UK, and international portals.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '7:9 ratio',
  },
  {
    id: 'visa-us',
    name: 'US Visa / 2×2 Inch Passport',
    category: 'passport',
    width: 600,
    height: 600,
    description: 'Standard 2×2 inch (51×51 mm) square format required for US Visas and DS-160 forms.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '1:1 square',
  },
  {
    id: 'passport-schengen',
    name: 'Schengen Visa (35×45 mm)',
    category: 'passport',
    width: 413,
    height: 531,
    description: 'High-DPI 300-DPI specification for European Schengen tourist and work visas.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '7:9 ratio',
  },

  // --- Exam & Government Portals ---
  {
    id: 'exam-admit-card',
    name: 'Exam Admit Card (300×400)',
    category: 'exam',
    width: 300,
    height: 400,
    description: 'Popular portrait dimension requested by SSC, UPSC, State PSCs, and IBPS portals.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '3:4 ratio',
  },
  {
    id: 'exam-jee-neet',
    name: 'National Entrance Exam (JEE/NEET)',
    category: 'exam',
    width: 200,
    height: 250,
    description: 'Candidate photograph standard for NTA entrance exams (4:5 portrait ratio).',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '4:5 ratio',
  },
  {
    id: 'college-application',
    name: 'College & University Portal',
    category: 'exam',
    width: 400,
    height: 500,
    description: 'Standard applicant photograph for university student registrations and portal profiles.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '4:5 ratio',
  },

  // --- Signatures ---
  {
    id: 'signature-official',
    name: 'Official Portal Signature (140×60)',
    category: 'signature',
    width: 140,
    height: 60,
    description: 'Exact aspect ratio and size requested for SSC, UPSC, and banking signature uploads.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '7:3 horizontal',
  },
  {
    id: 'signature-wide',
    name: 'Wide Exam Signature (300×120)',
    category: 'signature',
    width: 300,
    height: 120,
    description: 'High-clarity wide format for legal affidavits, state examinations, and e-signatures.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '5:2 horizontal',
  },
  {
    id: 'signature-compact',
    name: 'Compact Signature (200×100)',
    category: 'signature',
    width: 200,
    height: 100,
    description: '2:1 standard ratio signature box used for bank KYC and online verification forms.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '2:1 horizontal',
  },

  // --- Web & Documents ---
  {
    id: 'web-avatar',
    name: 'Square Profile / Avatar (500×500)',
    category: 'web',
    width: 500,
    height: 500,
    description: 'Clean 1:1 square profile picture for resumes, LinkedIn, and corporate intranet accounts.',
    defaultFormat: 'image/png',
    aspectRatioNote: '1:1 square',
  },
  {
    id: 'web-thumbnail',
    name: 'Thumbnail (200×200)',
    category: 'web',
    width: 200,
    height: 200,
    description: 'Lightweight square preview icon for cards and attachments.',
    defaultFormat: 'image/webp',
    aspectRatioNote: '1:1 square',
  },
  {
    id: 'doc-fhd',
    name: 'Full HD Landscape (1920×1080)',
    category: 'web',
    width: 1920,
    height: 1080,
    description: '16:9 widescreen presentation or documentation snapshot resolution.',
    defaultFormat: 'image/jpeg',
    aspectRatioNote: '16:9 widescreen',
  },
];

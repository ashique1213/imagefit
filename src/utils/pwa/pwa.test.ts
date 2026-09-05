import { describe, it, expect } from 'vitest';
import { registerServiceWorker } from './pwa';

describe('PWA Utilities', () => {
  it('registerServiceWorker executes safely without throwing', () => {
    expect(() => registerServiceWorker()).not.toThrow();
  });

  it('verifies manifest exists and contains required PWA attributes', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const manifestPath = path.resolve(__dirname, '../../../public/manifest.webmanifest');

    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifestContent.name).toBe('ImageFit - In-Browser Image & Signature Utility');
    expect(manifestContent.short_name).toBe('ImageFit');
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.start_url).toBe('/');
    expect(manifestContent.icons).toBeInstanceOf(Array);
    expect(manifestContent.icons.length).toBeGreaterThan(0);
    expect(manifestContent.shortcuts.length).toBeGreaterThanOrEqual(3);
  });

  it('verifies service worker file exists and defines cache lifecycle', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const swPath = path.resolve(__dirname, '../../../public/sw.js');

    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain('imagefit-cache-v1');
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('activate'");
    expect(swContent).toContain("addEventListener('fetch'");
  });
});

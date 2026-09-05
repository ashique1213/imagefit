import { describe, it, expect } from 'vitest';
import { APPLICATION_PORTALS } from '../../constants/applicationPortals';

describe('APPLICATION_PORTALS presets', () => {
  it('contains essential official government and exam portals', () => {
    const ids = APPLICATION_PORTALS.map((p) => p.id);
    expect(ids).toContain('ssc-cgl-photo');
    expect(ids).toContain('ssc-cgl-sig');
    expect(ids).toContain('us-visa-ds160');
    expect(ids).toContain('indian-passport-seva');
    expect(ids).toContain('upsc-civil-photo');
    expect(ids).toContain('ibps-bank-photo');
  });

  it('enforces positive dimensions and valid max file sizes on all portals', () => {
    APPLICATION_PORTALS.forEach((portal) => {
      expect(portal.width).toBeGreaterThan(0);
      expect(portal.height).toBeGreaterThan(0);
      expect(portal.maxKb).toBeGreaterThan(0);
      expect(portal.backgroundColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('matches official SSC requirements (350x450 px, max 50 KB)', () => {
    const sscPhoto = APPLICATION_PORTALS.find((p) => p.id === 'ssc-cgl-photo');
    expect(sscPhoto?.width).toBe(350);
    expect(sscPhoto?.height).toBe(450);
    expect(sscPhoto?.maxKb).toBe(50);
    expect(sscPhoto?.minKb).toBe(20);
    expect(sscPhoto?.format).toBe('image/jpeg');
  });

  it('matches official US Visa square specifications (600x600 px, max 240 KB)', () => {
    const usVisa = APPLICATION_PORTALS.find((p) => p.id === 'us-visa-ds160');
    expect(usVisa?.width).toBe(600);
    expect(usVisa?.height).toBe(600);
    expect(usVisa?.maxKb).toBe(240);
    expect(usVisa?.aspectRatioNumber).toBe(1);
  });
});

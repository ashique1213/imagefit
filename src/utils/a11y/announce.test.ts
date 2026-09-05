import { describe, it, expect } from 'vitest';
import { announceToScreenReader } from './announce';

describe('Aria Announcer Utility', () => {
  it('executes safely in node or SSR without throwing errors', () => {
    expect(() => announceToScreenReader('Test announcement')).not.toThrow();
    expect(() => announceToScreenReader('Error message', 'assertive')).not.toThrow();
  });
});

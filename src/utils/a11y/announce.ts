/**
 * Screen Reader ARIA Live Region Announcement Utility
 *
 * Allows client-side canvas and background processing operations to notify
 * assistive technology users (VoiceOver, NVDA, JAWS) of dynamic milestones
 * (e.g., "Image compressed successfully to 84 KB", "Crop applied", "3 files processed").
 */

let clearTimer: any = null;

/**
 * Initializes or retrieves the live region container
 */
export function getOrCreateLiveRegion(type: 'polite' | 'assertive'): HTMLElement {
  const id = `imagefit-aria-${type}`;
  let el = document.getElementById(id);

  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.setAttribute('aria-live', type);
    el.setAttribute('aria-atomic', 'true');
    // Visually hidden styles (sr-only)
    el.style.position = 'absolute';
    el.style.width = '1px';
    el.style.height = '1px';
    el.style.margin = '-1px';
    el.style.padding = '0';
    el.style.overflow = 'hidden';
    el.style.clip = 'rect(0, 0, 0, 0)';
    el.style.whiteSpace = 'nowrap';
    el.style.border = '0';

    document.body.appendChild(el);
  }

  return el;
}

/**
 * Dispatches an announcement to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  const container = getOrCreateLiveRegion(priority);

  // Clear previous message briefly to trigger announcement if repeated
  container.textContent = '';

  setTimeout(() => {
    container.textContent = message;

    // Auto-clear after 7 seconds to keep DOM clean
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = setTimeout(() => {
      container.textContent = '';
    }, 7000);
  }, 50);
}

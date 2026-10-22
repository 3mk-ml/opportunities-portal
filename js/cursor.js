/**
 * بوابة الفرص — Custom Cursor Hover Dot
 * Follows mouse smoothly. Turns white over blue areas/elements, blue over light/white areas.
 * Touch-disabled, non-blocking (pointer-events: none), highly optimized.
 */
'use strict';

class CustomCursor {
  constructor() {
    // Check if device supports hover / fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.dot = null;
    this.targetX = -100;
    this.targetY = -100;
    this.currentX = -100;
    this.currentY = -100;
    this.isVisible = false;
    this.isLight = false;
    this.isInteractive = false;
    this.rafId = null;

    this.init();
  }

  init() {
    // Create cursor element if not present
    let el = document.getElementById('cursor-dot');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cursor-dot';
      el.className = 'cursor-dot';
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    }
    this.dot = el;

    // Mouse movement
    window.addEventListener('mousemove', e => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.currentX = this.targetX;
        this.currentY = this.targetY;
        this.dot.classList.add('is-visible');
      }

      this.checkHoverTarget(e.target);
    }, { passive: true });

    // Handle mouse leaving/entering window
    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.dot.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.dot.classList.add('is-visible');
    });

    // Disable immediately on touch
    window.addEventListener('touchstart', () => {
      this.destroy();
    }, { passive: true, once: true });

    this.render();
  }

  checkHoverTarget(target) {
    if (!target) return;

    // 1. Check if hovering over blue vs white surface
    const isBlue = this.isTargetBlue(target);
    if (isBlue !== this.isLight) {
      this.isLight = isBlue;
      this.dot.classList.toggle('is-on-blue', this.isLight);
    }

    // 2. Check if hovering over clickable/interactive element
    const isClickable = !!target.closest('a, button, input, textarea, select, .opp-card, .featured-card, .fc-fav, .detail-fav-btn, .detail-share-btn, .detail-back-btn, .detail-official-btn, .detail-add-source-link, .faq-question, .filter-chip, .metric-card, [role="button"], label');
    if (isClickable !== this.isInteractive) {
      this.isInteractive = isClickable;
      this.dot.classList.toggle('is-interactive', this.isInteractive);
    }
  }

  isTargetBlue(el) {
    if (!el || el === document.body || el === document.documentElement) {
      return false;
    }

    let curr = el;
    while (curr && curr !== document.body) {
      // Inner white / light surfaces take precedence over parent blue sections
      if (curr.classList && (
        curr.classList.contains('opp-card') ||
        curr.classList.contains('modal-panel') ||
        curr.classList.contains('filter-search-wrap') ||
        curr.classList.contains('hero-search-inner') ||
        curr.classList.contains('empty-state') ||
        curr.classList.contains('section-white') ||
        curr.classList.contains('detail-header-card') ||
        curr.classList.contains('detail-deadline-card') ||
        curr.classList.contains('detail-specs-section') ||
        curr.classList.contains('detail-desc-card') ||
        curr.classList.contains('detail-cta-box') ||
        curr.classList.contains('detail-trust-card') ||
        curr.classList.contains('detail-error-card') ||
        curr.classList.contains('agent-card') ||
        curr.classList.contains('guide-card') ||
        curr.classList.contains('faq-item')
      )) {
        return false;
      }

      // Blue elements, blue sections, blue cards, blue buttons
      if (curr.classList && (
        curr.classList.contains('section-blue') ||
        curr.classList.contains('hero') ||
        curr.classList.contains('about-hero') ||
        curr.classList.contains('attribution-card') ||
        curr.classList.contains('catalogue') ||
        curr.classList.contains('site-footer') ||
        curr.classList.contains('featured-card') ||
        curr.classList.contains('about-card-preview') ||
        curr.classList.contains('btn-primary') ||
        curr.classList.contains('detail-official-btn') ||
        curr.classList.contains('hero-search-btn') ||
        curr.classList.contains('modal-source-link')
      )) {
        return true;
      }

      curr = curr.parentElement;
    }

    return false;
  }

  render() {
    if (this.isVisible) {
      // Smooth linear interpolation (lerp)
      const ease = 0.28;
      this.currentX += (this.targetX - this.currentX) * ease;
      this.currentY += (this.targetY - this.currentY) * ease;

      this.dot.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) translate(-50%, -50%)`;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.dot && this.dot.parentElement) {
      this.dot.parentElement.removeChild(this.dot);
    }
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.customCursorInstance = new CustomCursor();
});
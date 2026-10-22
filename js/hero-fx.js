/**
 * بوابة الفرص — HeroFX Wave & Constellation Animation
 * Inspired by Media Harbour organic wave streamlines & glowing node constellation.
 * Supports dynamic RTL/LTR flow mirroring, mouse deflection, and high-DPI canvas.
 */
'use strict';

class HeroFX {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.heroSection = this.canvas.closest('.hero') || this.canvas.parentElement;

    // Animation state
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rafId = null;
    this.time = 0;
    this.isRunning = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse state
    this.mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false };

    // Wave parameters
    this.waveCount = 18;
    this.nodes = [];
    this.nodeCount = 28;

    // Palette: Electric cyan, vibrant royal sapphire, luminous sky blue, soft violet
    this.palette = {
      cyan: '47, 217, 255',     // #2fd9ff (Media Harbour cyan)
      blue: '37, 99, 235',      // #2563eb (Royal Blue)
      sky: '56, 189, 248',      // #38bdf8 (Light sky)
      indigo: '79, 70, 229',    // #4f46e5 (Indigo)
      glow: '6, 182, 212'       // #06b6d4 (Glow)
    };

    this.init();
  }

  init() {
    this.resize();
    this.createNodes();

    // Event listeners
    window.addEventListener('resize', () => {
      this.resize();
      this.createNodes();
    }, { passive: true });

    // Track mouse over hero section
    if (this.heroSection) {
      this.heroSection.addEventListener('mousemove', e => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.clientX - rect.left;
        this.mouse.targetY = e.clientY - rect.top;
        this.mouse.active = true;
      }, { passive: true });

      this.heroSection.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.mouse.targetX = -9999;
        this.mouse.targetY = -9999;
      }, { passive: true });
    }

    // Pause animation when hero is off-screen to save 100% CPU/GPU
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.05 });
    obs.observe(this.heroSection);

    // Listen for language changes to update flow direction
    document.addEventListener('langchange', () => {
      this.createNodes();
    });

    this.start();
  }

  isRTL() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createNodes() {
    this.nodes = [];
    const rtl = this.isRTL();
    const count = this.width < 768 ? 14 : this.nodeCount;

    // In RTL, nodes concentrate on the left half (from 0 to 0.65 of width)
    // In LTR, nodes concentrate on the right half (from 0.35 to 1.0 of width)
    const xMin = rtl ? 0.04 * this.width : 0.40 * this.width;
    const xMax = rtl ? 0.60 * this.width : 0.96 * this.width;
    const yMin = 0.18 * this.height;
    const yMax = 0.82 * this.height;

    for (let i = 0; i < count; i++) {
      this.nodes.push({
        baseX: xMin + Math.random() * (xMax - xMin),
        baseY: yMin + Math.random() * (yMax - yMin),
        x: 0,
        y: 0,
        radius: 2.2 + Math.random() * 2.8,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
        driftSpeedX: (Math.random() - 0.5) * 0.25,
        driftSpeedY: (Math.random() - 0.5) * 0.25,
        color: Math.random() > 0.4 ? this.palette.cyan : this.palette.sky,
        connected: []
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.time += 0.012;

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    this.draw();

    if (!this.isReducedMotion) {
      this.rafId = requestAnimationFrame(() => this.animate());
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const rtl = this.isRTL();
    const t = this.time;

    ctx.clearRect(0, 0, w, h);

    // ────────────────────────────────────────────────────────
    // 1. DRAW WAVE STREAMLINES (Curved horizontal fiber lines)
    // ────────────────────────────────────────────────────────
    const numWaves = w < 768 ? 10 : this.waveCount;
    const startX = rtl ? 0 : w;
    const endX = rtl ? w * 0.72 : w * 0.28;
    const step = 20;

    for (let i = 0; i < numWaves; i++) {
      const normI = i / (numWaves - 1);
      // Group wave vertical bases towards the vertical center with organic spread
      const baseY = h * (0.24 + 0.52 * normI);
      const waveFreq = 0.0035 + (i % 3) * 0.0012;
      const waveSpeed = (0.7 + (i % 4) * 0.3) * (rtl ? -1 : 1);
      const phase = (i * 0.45);

      ctx.beginPath();

      const numSteps = Math.ceil(Math.abs(endX - startX) / step);
      let isFirst = true;

      for (let s = 0; s <= numSteps; s++) {
        const x = rtl ? startX + s * step : startX - s * step;
        const progress = s / numSteps; // 0 at origin edge, 1 towards center

        // Taper amplitude: large at origin edge, tapering smoothly towards center
        const taper = Math.sin(progress * Math.PI * 0.95);
        const amp = (18 + 14 * Math.sin(normI * Math.PI)) * (1 - progress * 0.4);

        // Multi-frequency harmonic wave
        let y = baseY +
          Math.sin(x * waveFreq + t * waveSpeed + phase) * amp +
          Math.cos(x * 0.002 - t * 0.5 + phase * 1.5) * (amp * 0.4);

        // Mouse deflection: waves gently bend away from or towards the mouse
        if (this.mouse.active) {
          const dx = x - this.mouse.x;
          const dy = y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 32;
            y += Math.sin((dist / maxDist) * Math.PI) * (dy > 0 ? force : -force);
          }
        }

        if (isFirst) {
          ctx.moveTo(x, y);
          isFirst = false;
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Linear gradient for each line: brightest at outer edge, fading towards center
      const grad = ctx.createLinearGradient(startX, baseY, endX, baseY);
      const color = (i % 3 === 0) ? this.palette.cyan : (i % 3 === 1 ? this.palette.sky : this.palette.blue);

      grad.addColorStop(0, `rgba(${color}, ${0.55 - normI * 0.25})`);
      grad.addColorStop(0.5, `rgba(${color}, ${0.40 - normI * 0.15})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = (i % 4 === 0) ? 1.8 : 1.1;
      ctx.stroke();
    }

    // ────────────────────────────────────────────────────────
    // 2. UPDATE & DRAW CONSTELLATION NODES & CONNECTORS
    // ────────────────────────────────────────────────────────
    const updatedNodes = [];

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      // Organic sinusoidal drift
      const currentX = node.baseX + Math.sin(t * 0.8 + node.phase) * 12;
      const currentY = node.baseY + Math.cos(t * 0.7 + node.phase * 1.2) * 10;

      // Mouse gentle repulsion on nodes
      let finalX = currentX;
      let finalY = currentY;

      if (this.mouse.active) {
        const dx = currentX - this.mouse.x;
        const dy = currentY - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 160;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 22;
          finalX += (dx / dist) * force;
          finalY += (dy / dist) * force;
        }
      }

      node.x = finalX;
      node.y = finalY;
      updatedNodes.push(node);
    }

    // Draw connecting filament lines between nearby nodes
    const maxConnectDist = w < 768 ? 90 : 130;
    for (let i = 0; i < updatedNodes.length; i++) {
      for (let j = i + 1; j < updatedNodes.length; j++) {
        const n1 = updatedNodes[i];
        const n2 = updatedNodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxConnectDist) {
          const alpha = (1 - dist / maxConnectDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${this.palette.cyan}, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // Draw each glowing node
    for (let i = 0; i < updatedNodes.length; i++) {
      const node = updatedNodes[i];
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.5 + node.phase);
      const r = node.radius * pulse;

      // Outer radial glow halo
      const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4.5);
      glowGrad.addColorStop(0, `rgba(${this.palette.cyan}, 0.55)`);
      glowGrad.addColorStop(0.4, `rgba(${this.palette.sky}, 0.20)`);
      glowGrad.addColorStop(1, `rgba(${this.palette.cyan}, 0)`);

      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Sharp luminous core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 1.3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${this.palette.cyan}, 0.9)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('hero-fx-canvas');
  if (canvasEl) {
    window.heroFXInstance = new HeroFX(canvasEl);
  }
});
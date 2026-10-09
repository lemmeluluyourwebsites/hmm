import React, { useRef, useEffect } from 'react';

/**
 * Lightweight interactive fluid ripple and particle simulation.
 * Creates slow-moving glowing pink ripples and viscous liquid trails
 * on touch/mouse drag across the fidget area.
 */
export default function FluidCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ripples array
    const ripples = [];
    const particles = [];

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.maxRadius = Math.random() * 60 + 50;
        this.alpha = 0.6;
        this.speed = Math.random() * 0.8 + 0.6; // slow, mesmerizing speed
        this.hue = Math.random() * 20 + 330; // Soft pink to cherry blossom
      }

      update() {
        this.radius += this.speed;
        this.alpha -= 0.007;
      }

      draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = `hsla(${this.hue}, 100%, 78%, ${this.alpha})`;
        context.lineWidth = 2.5;
        context.shadowBlur = 14;
        context.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`;
        context.stroke();
        context.restore();
      }
    }

    class FluidParticle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx * 0.3;
        this.vy = vy * 0.3;
        this.size = Math.random() * 14 + 6;
        this.alpha = 0.5;
        this.color = Math.random() > 0.5 ? '#ff69b4' : '#ffd1dc';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94; // damping
        this.vy *= 0.94;
        this.alpha -= 0.009;
        this.size *= 0.98;
      }

      draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, Math.max(1, this.size), 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.globalAlpha = Math.max(0, this.alpha);
        context.shadowBlur = 18;
        context.shadowColor = '#ff69b4';
        context.fill();
        context.restore();
      }
    }

    let lastX = 0;
    let lastY = 0;
    let isInteracting = false;

    const addFluidPoint = (x, y) => {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5 || ripples.length === 0) {
        ripples.push(new Ripple(x, y));
        for (let i = 0; i < 2; i++) {
          particles.push(new FluidParticle(x, y, dx + (Math.random() - 0.5) * 2, dy + (Math.random() - 0.5) * 2));
        }
        lastX = x;
        lastY = y;
      }
    };

    const handlePointerDown = (e) => {
      isInteracting = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      lastX = x;
      lastY = y;
      addFluidPoint(x, y);
    };

    const handlePointerMove = (e) => {
      if (!isInteracting && e.type.startsWith('touch')) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      addFluidPoint(x, y);
    };

    const handlePointerUp = () => {
      isInteracting = false;
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        }
      }

      // Update and draw fluid particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      if (canvas) {
        canvas.removeEventListener('mousedown', handlePointerDown);
        canvas.removeEventListener('mousemove', handlePointerMove);
        canvas.removeEventListener('touchstart', handlePointerDown);
        canvas.removeEventListener('touchmove', handlePointerMove);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-pink-400/20 bg-black/60 shadow-[0_0_20px_rgba(255,105,180,0.12)]">
      <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        <span className="text-xs text-pink-300/80 font-medium tracking-wide">
          Interactive Fluid Ripple Zone
        </span>
      </div>
      <p className="absolute bottom-3 left-4 z-10 pointer-events-none text-[11px] text-pink-200/50 font-light">
        Glide your fingers across to create slow luminous ripples
      </p>
      <canvas
        ref={canvasRef}
        className="w-full h-44 cursor-crosshair touch-none block"
      />
    </div>
  );
}

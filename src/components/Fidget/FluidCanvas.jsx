import React, { useRef, useEffect } from 'react';

/**
 * Interactive fluid ripple simulation.
 * Creates clean, fast-dissipating pink ripples and water glows
 * on touch or drag without cluttering the screen.
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

    const ripples = [];
    const particles = [];

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.alpha = 0.75;
        this.speed = Math.random() * 1.2 + 1.2;
        this.hue = Math.random() * 20 + 330;
      }

      update() {
        this.radius += this.speed;
        // Faster decay so ripples dissipate cleanly without getting messy
        this.alpha -= 0.024;
      }

      draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = `hsla(${this.hue}, 100%, 78%, ${this.alpha})`;
        context.lineWidth = 2;
        context.shadowBlur = 10;
        context.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.6)`;
        context.stroke();
        context.restore();
      }
    }

    class FluidParticle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx * 0.25;
        this.vy = vy * 0.25;
        this.size = Math.random() * 8 + 4;
        this.alpha = 0.65;
        this.color = Math.random() > 0.5 ? '#ff69b4' : '#ffd1dc';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.9;
        this.vy *= 0.9;
        // Dissolves quickly
        this.alpha -= 0.035;
        this.size *= 0.94;
      }

      draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, Math.max(1, this.size), 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.globalAlpha = Math.max(0, this.alpha);
        context.shadowBlur = 12;
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

      if (dist > 8 || ripples.length === 0) {
        ripples.push(new Ripple(x, y));
        particles.push(new FluidParticle(x, y, dx, dy));
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

    const animate = () => {
      // Faster trail clear to prevent muddy accumulation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        }
      }

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
    <div className="w-full rounded-3xl overflow-hidden border border-pink-400/20 bg-black/70 shadow-[0_0_20px_rgba(255,105,180,0.12)]">
      <div className="p-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span className="text-xs text-pink-300 font-medium tracking-wide">
            Interactive Fluid Ripple Zone
          </span>
        </div>
        <span className="text-[11px] text-pink-200/50 font-light">
          Glide fingers across
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-72 cursor-crosshair touch-none block"
      />
    </div>
  );
}

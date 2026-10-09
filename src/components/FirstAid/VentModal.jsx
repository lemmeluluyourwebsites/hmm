import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Wind } from 'lucide-react';
import { playBurnSound } from '../../utils/audio';

export default function VentModal({ isOpen, onClose }) {
  const [ventText, setVentText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0); // 0 to 1
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Trigger realistic flame, slow text burning, and rising smoke
  const handleBurn = () => {
    if (!ventText.trim() && !isBurning) {
      setVentText('All the unspoken heaviness, tension, and chaos.');
    }
    setIsBurning(true);
    setBurnProgress(0);
    playBurnSound();

    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 100]);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    // Flame tongue particles
    const flameParticles = [];
    // Rising smoke particles
    const smokeParticles = [];
    // Burning embers
    const embers = [];

    const startTime = performance.now();
    const duration = 2800; // 2.8s for smooth burn and smoke dispersion

    const animateBurn = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setBurnProgress(progress);

      ctx.clearRect(0, 0, width, height);

      // Current burning front line moving from bottom to top
      // 0 to 1.6s flame front travels up
      const flameFrontProgress = Math.min(elapsed / 1700, 1);
      const flameY = height - flameFrontProgress * (height + 40);

      // Spawn flames while burning
      if (flameFrontProgress < 1) {
        for (let i = 0; i < 6; i++) {
          flameParticles.push({
            x: Math.random() * width,
            y: flameY + Math.random() * 30,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 3 + 2.5),
            size: Math.random() * 16 + 10,
            life: 1,
            decay: Math.random() * 0.04 + 0.03,
            hue: Math.random() > 0.4 ? 15 + Math.random() * 25 : 340 + Math.random() * 20, // Orange-gold to hot pink
          });
        }

        // Spawn embers
        for (let i = 0; i < 3; i++) {
          embers.push({
            x: Math.random() * width,
            y: flameY + Math.random() * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -(Math.random() * 4 + 2),
            size: Math.random() * 3 + 1.5,
            alpha: 1,
            decay: Math.random() * 0.03 + 0.02,
          });
        }
      }

      // Spawn wispy smoke particles as flames consume text
      if (elapsed > 400 && elapsed < 2300) {
        if (Math.random() > 0.25) {
          smokeParticles.push({
            x: Math.random() * width,
            y: Math.max(0, flameY + Math.random() * 20),
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.5 + 1.2),
            radius: Math.random() * 8 + 8,
            maxRadius: Math.random() * 30 + 24,
            alpha: 0.45,
            decay: Math.random() * 0.007 + 0.006, // Lingers softly
          });
        }
      }

      // Draw Smoke (behind flames)
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const s = smokeParticles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.radius += 0.35;
        s.alpha -= s.decay;

        if (s.alpha > 0) {
          ctx.save();
          const smokeGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
          smokeGrad.addColorStop(0, `rgba(180, 160, 175, ${s.alpha * 0.7})`);
          smokeGrad.addColorStop(0.6, `rgba(120, 100, 115, ${s.alpha * 0.4})`);
          smokeGrad.addColorStop(1, 'rgba(30, 20, 30, 0)');
          ctx.fillStyle = smokeGrad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          smokeParticles.splice(i, 1);
        }
      }

      // Draw Flames
      for (let i = flameParticles.length - 1; i >= 0; i--) {
        const f = flameParticles[i];
        f.x += f.vx;
        f.y += f.vy;
        f.size *= 0.94;
        f.life -= f.decay;

        if (f.life > 0 && f.size > 1) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, f.life);
          const fGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
          fGrad.addColorStop(0, '#fff4cc');
          fGrad.addColorStop(0.4, `hsl(${f.hue}, 100%, 60%)`);
          fGrad.addColorStop(1, 'rgba(255, 105, 180, 0)');
          ctx.fillStyle = fGrad;
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#ff69b4';
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          flameParticles.splice(i, 1);
        }
      }

      // Draw Embers
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.alpha -= e.decay;

        if (e.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, e.alpha);
          ctx.fillStyle = '#ffb7ce';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffa500';
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          embers.splice(i, 1);
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateBurn);
      } else {
        // Finished burn and smoke
        ctx.clearRect(0, 0, width, height);
        setIsBurning(false);
        setBurnProgress(0);
        setVentText('');
        onClose();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateBurn);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isBurning && onClose()}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl p-6 bg-[#0a0a0c] border border-pink-400/25 shadow-[0_0_40px_rgba(255,105,180,0.15)] flex flex-col gap-4 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-400/30">
                <Flame className="w-4 h-4 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Safe Release
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isBurning}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full flex items-center justify-center text-pink-200/70 hover:text-white hover:bg-pink-500/10 active:scale-95 transition-all touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-pink-200/70 font-light leading-relaxed">
            Pour your unedited frustrations, thoughts, or tears here. When you hit burn, it vanishes forever into smoke.
          </p>

          {/* Text Area Container with Flame within the bubble */}
          <div className="relative w-full rounded-2xl overflow-hidden min-h-[170px] bg-black/60 border border-pink-300/20">
            {/* The Text Area */}
            <textarea
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              disabled={isBurning}
              placeholder="Type out all the annoyances here..."
              style={{
                // Gradually disappears, chars and blurs as burn progress advances
                opacity: isBurning ? Math.max(0, 1 - burnProgress * 1.8) : 1,
                filter: isBurning
                  ? `blur(${burnProgress * 8}px) brightness(${1 + burnProgress * 1.2}) sepia(${burnProgress * 0.8})`
                  : 'none',
                transform: isBurning ? `translateY(-${burnProgress * 8}px)` : 'none',
              }}
              className="w-full h-44 p-4 text-sm bg-transparent text-pink-100 placeholder-pink-300/40 resize-none outline-none font-light leading-relaxed transition-all duration-300"
            />

            {/* Small decorative flame in the text bubble */}
            <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-[10px] text-pink-300">
              <Flame
                className={`w-3.5 h-3.5 text-pink-400 transition-transform ${
                  isBurning ? 'scale-125 animate-pulse text-yellow-300' : 'animate-bounce'
                }`}
              />
              <span className="font-light">
                {isBurning ? 'Burning...' : 'Ready to burn'}
              </span>
            </div>

            {/* Canvas Overlay for Burning Flames and Rising Smoke */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 pointer-events-none w-full h-full ${
                isBurning ? 'block' : 'hidden'
              }`}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleBurn}
            disabled={isBurning}
            className={`w-full min-h-[48px] py-3.5 px-6 rounded-2xl font-medium tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 touch-manipulation shadow-lg ${
              isBurning
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-pink-500/40 animate-pulse'
                : 'bg-gradient-to-r from-pink-500/90 to-rose-400 text-white hover:brightness-110 active:scale-[0.98] shadow-pink-500/25'
            }`}
          >
            <Flame className={`w-5 h-5 ${isBurning ? 'animate-bounce text-yellow-200' : 'text-white'}`} />
            <span>{isBurning ? 'Burning away into smoke...' : 'Burn It'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

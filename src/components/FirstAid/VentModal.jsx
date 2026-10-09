import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Feather } from 'lucide-react';
import { playBurnSound } from '../../utils/audio';

export default function VentModal({ isOpen, onClose }) {
  const [ventText, setVentText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Trigger flame particle dissolution animation
  const handleBurn = () => {
    if (!ventText.trim() && !isBurning) {
      setVentText('All the unspoken heaviness, tension, and chaos.');
    }
    setIsBurning(true);
    playBurnSound();

    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 100]);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    // Particle system for embers and fire
    const particles = [];
    const colors = ['#ff69b4', '#ffb7ce', '#ff1493', '#ffd1dc', '#ff8da1', '#ffffff'];

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * width,
        y: height - Math.random() * 40,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 4 + 2.5),
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: Math.random() * 0.6 + 0.4,
        decay: Math.random() * 0.015 + 0.012,
      });
    }

    const startTime = performance.now();
    const duration = 2000;

    const animateParticles = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, width, height);

      // Draw embers
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ff69b4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateParticles);
      } else {
        // Complete burn
        ctx.clearRect(0, 0, width, height);
        setIsBurning(false);
        setVentText('');
        onClose();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateParticles);
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

          {/* Text Area Container */}
          <div className="relative w-full rounded-2xl overflow-hidden min-h-[170px] bg-black/60 border border-pink-300/20">
            <textarea
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              disabled={isBurning}
              placeholder="Type out all the annoyances here..."
              className={`w-full h-44 p-4 text-sm bg-transparent text-pink-100 placeholder-pink-300/40 resize-none outline-none font-light leading-relaxed transition-all duration-700 ${
                isBurning
                  ? 'opacity-0 scale-95 blur-md filter'
                  : 'opacity-100'
              }`}
            />

            {/* Fire and Ash Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 pointer-events-none w-full h-full ${
                isBurning ? 'block' : 'hidden'
              }`}
            />

            {/* Dissolution overlay glow */}
            {isBurning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 1, 0] }}
                transition={{ duration: 1.8 }}
                className="absolute inset-0 bg-gradient-to-t from-pink-600/40 via-pink-400/20 to-transparent pointer-events-none"
              />
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleBurn}
            disabled={isBurning}
            className={`w-full min-h-[48px] py-3.5 px-6 rounded-2xl font-medium tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 touch-manipulation shadow-lg ${
              isBurning
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-pink-500/40 animate-pulse'
                : 'bg-gradient-to-r from-pink-500/90 to-rose-400 text-white hover:brightness-110 active:scale-[0.98] shadow-pink-500/25'
            }`}
          >
            <Flame className={`w-5 h-5 ${isBurning ? 'animate-bounce text-yellow-200' : 'text-white'}`} />
            <span>{isBurning ? 'Burning into Ashes...' : 'Burn It'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

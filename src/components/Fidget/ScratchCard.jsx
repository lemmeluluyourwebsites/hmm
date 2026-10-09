import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, X, RotateCcw, Heart, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PERSONAL_PHOTOS, SAMPLE_COUPLE_PHOTOS } from '../../config/mediaConfig';

export default function ScratchCard() {
  const { currentUser } = useAuth();

  // Influencer sees public sample couple photos; personal users see their own photos
  const photoPool = currentUser?.isInfluencer ? SAMPLE_COUPLE_PHOTOS : PERSONAL_PHOTOS;

  const [isOpen, setIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(photoPool[0]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const hasCelebratedRef = useRef(false);

  // Pick a random photo different from current
  const pickRandomPhoto = useCallback(() => {
    const candidates = photoPool.filter((p) => p.id !== currentPhoto?.id);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || photoPool[0];
    setCurrentPhoto(chosen);
  }, [currentPhoto, photoPool]);

  // Open pop-up with a fresh random photo
  const handleOpen = () => {
    pickRandomPhoto();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsRevealed(false);
    setScratchPercent(0);
    hasCelebratedRef.current = false;
  };

  // Initialize or reset canvas coating
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    setIsRevealed(false);
    setScratchPercent(0);
    hasCelebratedRef.current = false;
    ctx.globalCompositeOperation = 'source-over';

    // Soft pink coating
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f48fb1');
    grad.addColorStop(1, '#ff8da1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle polka dot pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let x = 0; x < w; x += 20) {
      for (let y = 0; y < h; y += 20) {
        if ((x + y) % 40 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Centered "Scratch Me" overlay text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.fillText('✨ Scratch Me ✨', w / 2, h / 2 - 10);

    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fff0f5';
    ctx.fillText('Rub with your finger', w / 2, h / 2 + 16);
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        initCanvas();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentPhoto, initCanvas]);

  // Accurate percentage sampling across the entire canvas
  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (w <= 0 || h <= 0) return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let totalSampled = 0;
    let transparentSampled = 0;
    const step = 6;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        totalSampled++;
        // Alpha channel < 35 means erased
        if (data[idx + 3] < 35) {
          transparentSampled++;
        }
      }
    }

    const percent = totalSampled > 0 ? Math.round((transparentSampled / totalSampled) * 100) : 0;
    setScratchPercent(percent);

    // Hard work threshold: strictly reveals the whole card only when >= 90%
    if (percent >= 90 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setIsRevealed(true);
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ffd1dc', '#ffffff', '#f48fb1'],
      });
      if (navigator.vibrate) {
        navigator.vibrate([40, 40, 80]);
      }
    }
  };

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (navigator.vibrate && Math.random() > 0.8) {
      navigator.vibrate(10);
    }
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX !== undefined && clientY !== undefined) {
      scratchAt(clientX, clientY);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX !== undefined && clientY !== undefined) {
      scratchAt(clientX, clientY);
      calculateProgress();
    }
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      calculateProgress();
    }
  };

  const handleScratchAnother = () => {
    pickRandomPhoto();
  };

  return (
    <>
      {/* Trigger Card in Fidget Zone */}
      <div className="w-full rounded-3xl p-5 bg-[#0e0711] border border-pink-400/25 shadow-[0_0_25px_rgba(255,105,180,0.15)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center">
              <Gift className="w-4 h-4 text-pink-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide">
                Mystery Scratch Card
              </h3>
              <p className="text-[11px] text-pink-200/60 font-light">
                A surprise keepsake waiting underneath
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-pink-400" />
        </div>

        <button
          onClick={handleOpen}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500/90 to-rose-400/90 text-white font-medium text-sm hover:brightness-110 active:scale-[0.98] transition-all touch-manipulation flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
        >
          <Gift className="w-4 h-4 text-white" />
          <span>Open Mystery Scratch Card</span>
        </button>
      </div>

      {/* Pop-up Box Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Pop-up Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-3xl p-5 bg-[#0d0711] border border-pink-400/30 shadow-[0_0_40px_rgba(255,105,180,0.25)] flex flex-col items-center gap-4 z-10 overflow-hidden max-h-[90vh]"
            >
              {/* Header with Close Button */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400/50" />
                  <span className="text-sm font-semibold text-white tracking-wide">
                    Scratch to Reveal
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-black/50 text-pink-200 border border-pink-400/30 hover:text-white hover:bg-pink-500/20 active:scale-95 transition-all touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Adaptive Aspect Ratio Card Container */}
              <div className="w-full flex justify-center items-center overflow-hidden py-1">
                <div
                  ref={containerRef}
                  style={{
                    aspectRatio: `${currentPhoto.ratio}`,
                    maxHeight: '58vh',
                    maxWidth: '100%',
                  }}
                  className="relative rounded-2xl overflow-hidden bg-black border-2 border-pink-400/40 select-none touch-none shadow-inner"
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                >
                  {/* Photo with zero captions or descriptions */}
                  <img
                    src={currentPhoto.url}
                    alt="Mystery surprise"
                    className="w-full h-full object-contain bg-black select-none pointer-events-none"
                    onLoad={initCanvas}
                  />

                  {/* Scratchable Canvas Layer */}
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                      isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'
                    }`}
                  />
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="w-full flex items-center justify-between text-xs text-pink-200/80 pt-1 border-t border-pink-400/15">
                <span>Scratched: {scratchPercent}%</span>
                <span className="text-pink-300 font-medium">
                  {isRevealed
                    ? 'Revealed!'
                    : scratchPercent >= 90
                    ? 'Almost there'
                    : 'Reveal requires 90%'}
                </span>
              </div>

              {/* Actions */}
              <div className="w-full flex items-center gap-2">
                <button
                  onClick={initCanvas}
                  className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-200 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all text-xs font-medium flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scratch Again</span>
                </button>
                <button
                  onClick={handleScratchAnother}
                  className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/80 to-rose-400/80 text-white active:scale-95 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 touch-manipulation shadow-md shadow-pink-500/20"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Next Surprise</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

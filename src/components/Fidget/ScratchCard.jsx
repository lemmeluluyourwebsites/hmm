import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart, Eye } from 'lucide-react';

const DEFAULT_PHOTO_URL =
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';

export default function ScratchCard({ photoUrl = DEFAULT_PHOTO_URL }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);
  const hasCelebratedRef = useRef(false);

  // Initialize canvas layer
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = container.offsetWidth);
    const height = (canvas.height = container.offsetHeight);

    // Reset state
    setIsRevealed(false);
    setScratchPercent(0);
    hasCelebratedRef.current = false;
    ctx.globalCompositeOperation = 'source-over';

    // Solid soft pink background
    ctx.fillStyle = '#f48fb1';
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative pattern or tint
    ctx.fillStyle = '#ffb7ce';
    for (let i = 0; i < width; i += 24) {
      for (let j = 0; j < height; j += 24) {
        if ((i + j) % 48 === 0) {
          ctx.beginPath();
          ctx.arc(i, j, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // "Scratch Me" text overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 8;
    ctx.fillText('✨ Scratch Me ✨', width / 2, height / 2 - 10);

    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffe4ec';
    ctx.fillText('A sweet memory is hidden below', width / 2, height / 2 + 18);

    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate scratched area percentage
  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Sample pixels for performance
    const sampleStep = 8;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let transparentPixels = 0;
    let totalSampled = 0;

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const index = (y * width + x) * 4;
        totalSampled++;
        if (data[index + 3] === 0) {
          transparentPixels++;
        }
      }
    }

    const percent = Math.round((transparentPixels / totalSampled) * 100);
    setScratchPercent(percent);

    if (percent >= 45 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setIsRevealed(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff69b4', '#ffd1dc', '#ffffff'],
      });
      if (navigator.vibrate) {
        navigator.vibrate([40, 40, 80]);
      }
    }
  };

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (navigator.vibrate && Math.random() > 0.75) {
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

  return (
    <div className="w-full rounded-3xl p-5 bg-[#0e0711] border border-pink-400/25 shadow-[0_0_25px_rgba(255,105,180,0.15)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-pink-300 fill-pink-300/40" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Scratch to Reveal
            </h3>
            <p className="text-[11px] text-pink-200/60 font-light">
              Rub the soft pink surface with your finger
            </p>
          </div>
        </div>

        <button
          onClick={initCanvas}
          className="min-h-[48px] min-w-[48px] px-3.5 py-2 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all text-xs font-medium flex items-center justify-center gap-1.5 touch-manipulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scratch Canvas Area */}
      <div
        ref={containerRef}
        className="relative w-full h-56 rounded-2xl overflow-hidden bg-black border border-pink-400/30 select-none touch-none shadow-inner"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Hidden Photo Underneath */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={photoUrl}
            alt="Revealed cute memory"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
            <span className="text-xs font-medium text-pink-100 drop-shadow">
              You are unconditionally cherished.
            </span>
          </div>
        </div>

        {/* Scratchable Pink Canvas Layer */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'
          }`}
        />
      </div>

      {/* Progress & Message */}
      <div className="flex items-center justify-between text-xs text-pink-200/70 pt-1 border-t border-pink-400/15">
        <span>Revealed: {scratchPercent}%</span>
        <span className="text-pink-300 font-medium">
          {isRevealed
            ? 'Fully Unveiled'
            : scratchPercent > 20
            ? 'Almost there'
            : 'Scratch anywhere'}
        </span>
      </div>
    </div>
  );
}

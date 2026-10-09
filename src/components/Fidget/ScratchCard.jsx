import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart, ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon } from 'lucide-react';

const MEDIA_ITEMS = [
  {
    id: 1,
    type: 'image',
    url: '/media/photo-1.jpg',
    title: 'Pure Joy',
    caption: 'Lessgooooo! A precious golden celebration.',
  },
  {
    id: 2,
    type: 'image',
    url: '/media/photo-2.jpg',
    title: 'Warm Smiles',
    caption: 'Surrounded by the warmest smiles and love.',
  },
  {
    id: 3,
    type: 'image',
    url: '/media/photo-3.jpg',
    title: 'Shared Moments',
    caption: 'Wristbands and unforgettable shared times.',
  },
  {
    id: 4,
    type: 'image',
    url: '/media/photo-4.jpg',
    title: 'Vintage Cool',
    caption: 'Cool shades and timeless charm.',
  },
  {
    id: 5,
    type: 'image',
    url: '/media/photo-5.jpg',
    title: 'Starry Eyes',
    caption: 'Bright stars and innocence from day one.',
  },
  {
    id: 6,
    type: 'image',
    url: '/media/photo-6.png',
    title: 'Precious Memory',
    caption: 'A cherished snapshot etched in our hearts.',
  },
  {
    id: 7,
    type: 'video',
    url: '/media/video-1.mp4',
    title: 'Cozy Clip 1',
    caption: 'A moving memory full of life and giggles.',
  },
  {
    id: 8,
    type: 'video',
    url: '/media/video-2.mp4',
    title: 'Cozy Clip 2',
    caption: 'Moments in motion that bring instant comfort.',
  },
];

export default function ScratchCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const isDrawingRef = useRef(false);
  const hasCelebratedRef = useRef(false);

  const currentMedia = MEDIA_ITEMS[currentIndex];

  // Initialize or reset canvas for current media
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = container.offsetWidth);
    const height = (canvas.height = container.offsetHeight);

    setIsRevealed(false);
    setScratchPercent(0);
    hasCelebratedRef.current = false;
    ctx.globalCompositeOperation = 'source-over';

    // Soft pink gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#f48fb1');
    grad.addColorStop(1, '#ff8da1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dotted pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < width; i += 22) {
      for (let j = 0; j < height; j += 22) {
        if ((i + j) % 44 === 0) {
          ctx.beginPath();
          ctx.arc(i, j, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Card Badge and Text Overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.fillText('✨ Scratch Me ✨', width / 2, height / 2 - 20);

    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fff0f5';
    ctx.fillText(
      currentMedia.type === 'video' ? 'Video hidden inside' : 'Photo hidden inside',
      width / 2,
      height / 2 + 14
    );

    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Rub with your finger to reveal', width / 2, height / 2 + 38);

    ctx.shadowBlur = 0;
  }, [currentMedia]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, currentIndex]);

  // Handle video play when revealed
  useEffect(() => {
    if (currentMedia.type === 'video' && videoRef.current) {
      if (isRevealed) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isRevealed, currentMedia]);

  // Calculate scratched area percentage
  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const sampleStep = 10;
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

    if (percent >= 40 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setIsRevealed(true);
      confetti({
        particleCount: 50,
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
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MEDIA_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MEDIA_ITEMS.length) % MEDIA_ITEMS.length);
  };

  return (
    <div className="w-full rounded-3xl p-5 bg-[#0e0711] border border-pink-400/25 shadow-[0_0_25px_rgba(255,105,180,0.15)] flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center">
            {currentMedia.type === 'video' ? (
              <Film className="w-4 h-4 text-pink-300" />
            ) : (
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300/40" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Scratch to Reveal
            </h3>
            <p className="text-[11px] text-pink-200/60 font-light">
              Memory {currentIndex + 1} of {MEDIA_ITEMS.length} ({currentMedia.title})
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

      {/* 9:16 Aspect Ratio Scratch Container */}
      <div className="w-full flex justify-center py-1">
        <div
          ref={containerRef}
          className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-pink-400/40 select-none touch-none shadow-[0_0_25px_rgba(255,105,180,0.2)]"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Media Hidden Underneath */}
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            {currentMedia.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                controls={isRevealed}
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.title}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            )}

            {/* Bottom Caption Pill */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col pointer-events-none">
              <span className="text-xs font-semibold text-white drop-shadow">
                {currentMedia.title}
              </span>
              <span className="text-[11px] text-pink-200/90 font-light mt-0.5">
                {currentMedia.caption}
              </span>
            </div>
          </div>

          {/* Scratchable Soft Pink Canvas */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'
            }`}
          />
        </div>
      </div>

      {/* Media Selector Dots and Navigation Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={handlePrev}
          aria-label="Previous memory"
          className="min-h-[48px] px-3.5 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-200 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all text-xs font-medium flex items-center gap-1.5 touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-2 max-w-[170px] scrollbar-none">
          {MEDIA_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to memory ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-pink-400 shadow-[0_0_8px_rgba(255,105,180,0.8)]'
                  : 'w-2.5 bg-pink-500/25 hover:bg-pink-500/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next memory"
          className="min-h-[48px] px-3.5 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-200 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all text-xs font-medium flex items-center gap-1.5 touch-manipulation"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Footer */}
      <div className="flex items-center justify-between text-xs text-pink-200/70 pt-1 border-t border-pink-400/15">
        <span>Revealed: {scratchPercent}%</span>
        <span className="text-pink-300 font-medium">
          {isRevealed
            ? 'Memory Unlocked 💕'
            : scratchPercent > 20
            ? 'Almost there'
            : 'Scratch to reveal'}
        </span>
      </div>
    </div>
  );
}

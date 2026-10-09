import React, { useRef, useEffect, useState } from 'react';
import { Heart, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { playHeartChime } from '../../utils/audio';

const PRAISES = [
  { min: 0, text: 'Take a gentle breath and catch when you are ready.' },
  { min: 3, text: 'You are doing wonderfully.' },
  { min: 7, text: 'So gentle and soothing.' },
  { min: 12, text: 'Your heart is soft and precious.' },
  { min: 18, text: 'You are loved beyond measure.' },
  { min: 25, text: 'Pure peace and warmth collected.' },
  { min: 35, text: 'Endless hugs and adoration for you.' },
];

const EMOJIS = ['💖', '💕', '🌸', '✨', '💗', '🎀'];

export default function CatchHeartsGame() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPlayingRef = useRef(true);
  const scoreRef = useRef(0);
  const basketXRef = useRef(150);
  const heartsRef = useRef([]);
  const floatingNoticesRef = useRef([]);
  const lastSpawnRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  isPlayingRef.current = isPlaying;
  scoreRef.current = score;

  const getPraise = (currentScore) => {
    let matched = PRAISES[0].text;
    for (const p of PRAISES) {
      if (currentScore >= p.min) {
        matched = p.text;
      }
    }
    return matched;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    basketXRef.current = width / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const spawnEmoji = (now) => {
      if (now - lastSpawnRef.current > 1050) {
        lastSpawnRef.current = now;
        heartsRef.current.push({
          x: Math.random() * (width - 70) + 35,
          y: -25,
          baseX: Math.random() * (width - 70) + 35,
          swayOffset: Math.random() * Math.PI * 2,
          speed: Math.random() * 50 + 65, // Pixels per second
          size: Math.random() * 6 + 24,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        });
      }
    };

    const updateAndRender = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#09030c');
      bgGrad.addColorStop(1, '#150717');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (isPlayingRef.current) {
        spawnEmoji(now);

        const basketX = basketXRef.current;
        const basketY = height - 42;
        const basketW = 86;
        const basketH = 34;

        // Update emojis
        const surviving = [];
        for (let i = 0; i < heartsRef.current.length; i++) {
          const item = heartsRef.current[i];
          item.y += item.speed * dt;
          item.x = item.baseX + Math.sin(item.y * 0.025 + item.swayOffset) * 20;

          // Catch collision
          if (
            item.y >= basketY - 10 &&
            item.y <= basketY + basketH &&
            Math.abs(item.x - basketX) < basketW / 2 + 12
          ) {
            playHeartChime();
            if (navigator.vibrate) {
              navigator.vibrate(25);
            }
            const nextScore = scoreRef.current + 1;
            scoreRef.current = nextScore;
            setScore(nextScore);

            floatingNoticesRef.current.push({
              x: basketX,
              y: basketY - 15,
              alpha: 1,
            });
          } else if (item.y < height + 35) {
            surviving.push(item);
          }
        }
        heartsRef.current = surviving;

        // Update floating notices
        for (let i = floatingNoticesRef.current.length - 1; i >= 0; i--) {
          const fn = floatingNoticesRef.current[i];
          fn.y -= 38 * dt;
          fn.alpha -= 1.2 * dt;
          if (fn.alpha <= 0) {
            floatingNoticesRef.current.splice(i, 1);
          }
        }
      }

      // Draw all falling emojis
      for (let i = 0; i < heartsRef.current.length; i++) {
        const item = heartsRef.current[i];
        ctx.font = `${item.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, item.x, item.y);
      }

      // Draw floating notices
      for (let i = 0; i < floatingNoticesRef.current.length; i++) {
        const fn = floatingNoticesRef.current[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, fn.alpha);
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ff69b4';
        ctx.textAlign = 'center';
        ctx.fillText('+1 💕', fn.x, fn.y);
        ctx.restore();
      }

      // Draw the Basket
      const currentBasketX = basketXRef.current;
      const bY = height - 42;
      const bW = 86;
      const bH = 32;

      ctx.save();
      // Ribbon
      ctx.font = '14px "Segoe UI Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎀', currentBasketX, bY - 4);

      // Basket shape
      ctx.beginPath();
      ctx.roundRect(currentBasketX - bW / 2, bY, bW, bH, [6, 6, 16, 16]);
      ctx.fillStyle = '#22081d';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#f48fb1';
      ctx.stroke();

      // Inner highlight
      ctx.beginPath();
      ctx.roundRect(currentBasketX - bW / 2 + 10, bY + 6, bW - 20, 2, 2);
      ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(updateAndRender);
    };

    animFrameRef.current = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePointer = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX === undefined) return;

    const x = Math.max(45, Math.min(rect.width - 45, clientX - rect.left));
    basketXRef.current = x;
  };

  const handleReset = () => {
    setScore(0);
    scoreRef.current = 0;
    heartsRef.current = [];
    floatingNoticesRef.current = [];
    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
  };

  return (
    <div className="w-full rounded-3xl p-5 bg-[#0d0711] border border-pink-400/25 shadow-[0_0_25px_rgba(255,105,180,0.15)] flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-pink-300 fill-pink-300/40" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Catch the Hearts
            </h3>
            <p className="text-[11px] text-pink-200/60 font-light">
              Slide gently to catch the drifting emojis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause game' : 'Resume game'}
            className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset score"
            className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Banner */}
      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-pink-400/20 text-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-pink-300/80 font-medium">
            Emojis Collected
          </span>
          <span className="text-xl font-bold text-pink-300 drop-shadow-[0_0_8px_rgba(255,105,180,0.4)]">
            {score}
          </span>
        </div>
        <p className="text-xs text-pink-100/90 font-light italic transition-all duration-300">
          "{getPraise(score)}"
        </p>
      </div>

      {/* Lag-Free Canvas Arena */}
      <div
        className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-pink-400/30 touch-none select-none cursor-pointer"
        onMouseMove={handlePointer}
        onTouchMove={handlePointer}
        onTouchStart={handlePointer}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <span className="text-sm font-medium text-pink-200">Game Paused</span>
            <button
              onClick={() => setIsPlaying(true)}
              className="min-h-[48px] px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all touch-manipulation"
            >
              Resume Catching
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-pink-200/60">
        <span>No time limits. No penalties.</span>
        <span>Drag anywhere to move basket</span>
      </div>
    </div>
  );
}

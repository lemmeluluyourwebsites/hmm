import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function CatchHeartsGame() {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [basketX, setBasketX] = useState(150);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Game loop state refs
  const scoreRef = useRef(0);
  const isPlayingRef = useRef(true);
  const basketXRef = useRef(150);
  const heartsRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);

  // Synchronize refs
  scoreRef.current = score;
  isPlayingRef.current = isPlaying;
  basketXRef.current = basketX;

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
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth || 340;
    const height = 400;
    setBasketX(width / 2);
    basketXRef.current = width / 2;

    let heartId = 0;

    const spawnHeart = (time) => {
      // Spawn a heart every ~1100ms for slow and relaxing gameplay
      if (time - lastSpawnRef.current > 1100) {
        lastSpawnRef.current = time;
        const emojis = ['💖', '💕', '🌸', '✨', '💗', '🎀'];
        heartsRef.current.push({
          id: heartId++,
          x: Math.random() * (width - 60) + 30,
          y: -20,
          baseX: Math.random() * (width - 60) + 30,
          swayOffset: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.9 + 0.8, // Very slow, forgiving speed
          size: Math.random() * 6 + 24,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }
    };

    const updateGame = (time) => {
      if (isPlayingRef.current) {
        spawnHeart(time);

        const currentBasketX = basketXRef.current;
        const basketY = height - 55;
        const basketWidth = 90; // Generous catching area

        // Update each heart
        const remainingHearts = [];

        for (let i = 0; i < heartsRef.current.length; i++) {
          const h = heartsRef.current[i];
          h.y += h.speed;
          // Gentle sinusoidal sway like a leaf or petal
          h.x = h.baseX + Math.sin(h.y * 0.02 + h.swayOffset) * 22;

          // Check collision with basket
          const isCaught =
            h.y >= basketY - 15 &&
            h.y <= basketY + 30 &&
            Math.abs(h.x - currentBasketX) < basketWidth / 2 + 10;

          if (isCaught) {
            // Heart caught
            playHeartChime();
            if (navigator.vibrate) {
              navigator.vibrate(25);
            }

            const newScore = scoreRef.current + 1;
            scoreRef.current = newScore;
            setScore(newScore);

            // Trigger floating text
            const textId = Math.random();
            setFloatingTexts((prev) => [
              ...prev.slice(-4),
              { id: textId, x: currentBasketX, y: basketY - 20, text: '+1 💕' },
            ]);
            setTimeout(() => {
              setFloatingTexts((prev) => prev.filter((t) => t.id !== textId));
            }, 900);
          } else if (h.y < height + 40) {
            // Heart still on screen
            remainingHearts.push(h);
          }
        }

        heartsRef.current = remainingHearts;
      }

      animFrameRef.current = requestAnimationFrame(updateGame);
    };

    animFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Pointer drag handling for mobile basket
  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX === undefined) return;

    const x = Math.max(45, Math.min(rect.width - 45, clientX - rect.left));
    setBasketX(x);
    basketXRef.current = x;
  };

  const handleReset = () => {
    setScore(0);
    scoreRef.current = 0;
    heartsRef.current = [];
    if (navigator.vibrate) {
      navigator.vibrate(40);
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
              Slide gently to catch the drifting hearts
            </p>
          </div>
        </div>

        {/* Buttons */}
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

      {/* Gentle Score Banner & Praise */}
      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-pink-400/20 text-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-pink-300/80 font-medium">
            Hearts Collected
          </span>
          <span className="text-xl font-bold text-pink-300 drop-shadow-[0_0_8px_rgba(255,105,180,0.4)]">
            {score}
          </span>
        </div>
        <p className="text-xs text-pink-100/90 font-light italic transition-all duration-300">
          "{getPraise(score)}"
        </p>
      </div>

      {/* Interactive Game Arena */}
      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onTouchStart={handlePointerMove}
        className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#09030c] to-[#150717] border border-pink-400/30 select-none touch-none shadow-inner cursor-pointer"
      >
        {/* Subtle background stars and glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-12 w-1 h-1 bg-pink-300 rounded-full animate-ping" />
          <div className="absolute top-28 right-16 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-48 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
        </div>

        {/* Falling Hearts */}
        {heartsRef.current.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none select-none transition-transform duration-75"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: `${h.size}px`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.45))',
            }}
          >
            {h.emoji}
          </div>
        ))}

        {/* Floating score notices */}
        {floatingTexts.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -35, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="absolute pointer-events-none text-xs font-bold text-pink-300 drop-shadow"
            style={{
              left: `${f.x}px`,
              top: `${f.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {f.text}
          </motion.div>
        ))}

        {/* The Cute Basket */}
        <div
          className="absolute bottom-5 pointer-events-none transition-[left] duration-75 flex flex-col items-center"
          style={{
            left: `${basketX}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Basket ribbon decoration */}
          <div className="text-xs mb-[-6px] z-10 filter drop-shadow-[0_2px_4px_rgba(255,105,180,0.5)]">
            🎀
          </div>

          {/* Woven glass basket SVG */}
          <div className="relative w-24 h-12 rounded-b-2xl rounded-t-lg bg-gradient-to-b from-[#2a0f25] to-[#1a0516] border-2 border-pink-400/60 shadow-[0_4px_20px_rgba(255,105,180,0.4)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ff69b4_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />
            <div className="w-16 h-1 rounded-full bg-pink-400/50 mb-1" />
          </div>
        </div>

        {/* Paused Overlay */}
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

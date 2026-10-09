import React, { useRef, useEffect, useState } from 'react';
import { Heart, Play, Pause, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { playHeartChime, playBonusChime, playPenaltySound } from '../../utils/audio';

const PRAISES = [
  { min: 1, text: 'Take a gentle breath and catch when you are ready.' },
  { min: 5, text: 'You are doing wonderfully.' },
  { min: 10, text: 'So gentle and soothing.' },
  { min: 16, text: 'Your heart is soft and precious.' },
  { min: 24, text: 'You are loved beyond measure.' },
  { min: 35, text: 'Pure peace and warmth collected.' },
  { min: 50, text: 'Endless hugs and adoration for you.' },
];

// Emoji pools and weights
const HEART_EMOJIS = ['💖', '💕', '💗', '❤️', '💓', '💝', '💞'];
const BONUS_EMOJIS = ['🫂', '💋', '😘'];
const PENALTY_EMOJIS = ['⚡', '🌧️', '💣', '🕸️', '🥀', '🌪️'];

const INITIAL_SCORE = 5;

export default function CatchHeartsGame() {
  const [score, setScore] = useState(INITIAL_SCORE);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPlayingRef = useRef(true);
  const isGameOverRef = useRef(false);
  const scoreRef = useRef(INITIAL_SCORE);
  const basketXRef = useRef(150);
  const itemsRef = useRef([]);
  const floatingNoticesRef = useRef([]);
  const lastSpawnRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  isPlayingRef.current = isPlaying;
  isGameOverRef.current = isGameOver;
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

  const restartGame = () => {
    setScore(INITIAL_SCORE);
    scoreRef.current = INITIAL_SCORE;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPlaying(true);
    isPlayingRef.current = true;
    itemsRef.current = [];
    floatingNoticesRef.current = [];
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
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

    const spawnItem = (now) => {
      if (now - lastSpawnRef.current > 950) {
        lastSpawnRef.current = now;

        // Probabilities: ~65% Heart (+1), ~15% Bonus Hug/Kiss (+2), ~20% Distraction (-1)
        const rand = Math.random();
        let emoji = '💖';
        let type = 'heart';
        let points = 1;

        if (rand < 0.65) {
          type = 'heart';
          emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
          points = 1;
        } else if (rand < 0.80) {
          type = 'bonus';
          emoji = BONUS_EMOJIS[Math.floor(Math.random() * BONUS_EMOJIS.length)];
          points = 2;
        } else {
          type = 'penalty';
          emoji = PENALTY_EMOJIS[Math.floor(Math.random() * PENALTY_EMOJIS.length)];
          points = -1;
        }

        itemsRef.current.push({
          x: Math.random() * (width - 70) + 35,
          y: -25,
          baseX: Math.random() * (width - 70) + 35,
          swayOffset: Math.random() * Math.PI * 2,
          speed: Math.random() * 45 + 70, // Relaxed falling speed
          size: Math.random() * 6 + 24,
          emoji,
          type,
          points,
        });
      }
    };

    const updateAndRender = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#09030c');
      bgGrad.addColorStop(1, '#150717');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (isPlayingRef.current && !isGameOverRef.current) {
        spawnItem(now);

        const basketX = basketXRef.current;
        const basketY = height - 42;
        const basketW = 86;
        const basketH = 34;

        const surviving = [];
        for (let i = 0; i < itemsRef.current.length; i++) {
          const item = itemsRef.current[i];
          item.y += item.speed * dt;
          item.x = item.baseX + Math.sin(item.y * 0.025 + item.swayOffset) * 20;

          // Catch collision
          if (
            item.y >= basketY - 10 &&
            item.y <= basketY + basketH &&
            Math.abs(item.x - basketX) < basketW / 2 + 12
          ) {
            // Calculate new score
            const nextScore = Math.max(0, scoreRef.current + item.points);
            scoreRef.current = nextScore;
            setScore(nextScore);

            // Play corresponding sound and notice
            if (item.type === 'bonus') {
              playBonusChime();
              if (navigator.vibrate) navigator.vibrate([20, 20, 40]);
              floatingNoticesRef.current.push({
                x: basketX,
                y: basketY - 15,
                text: '+2 💖',
                color: '#ff69b4',
                alpha: 1,
              });
            } else if (item.type === 'heart') {
              playHeartChime();
              if (navigator.vibrate) navigator.vibrate(25);
              floatingNoticesRef.current.push({
                x: basketX,
                y: basketY - 15,
                text: '+1 💕',
                color: '#f48fb1',
                alpha: 1,
              });
            } else {
              playPenaltySound();
              if (navigator.vibrate) navigator.vibrate([60, 40]);
              floatingNoticesRef.current.push({
                x: basketX,
                y: basketY - 15,
                text: '-1 💔',
                color: '#fb7185',
                alpha: 1,
              });
            }

            // Game over condition when score reaches 0
            if (nextScore <= 0) {
              setIsGameOver(true);
              isGameOverRef.current = true;
            }
          } else if (item.y < height + 35) {
            surviving.push(item);
          }
        }
        itemsRef.current = surviving;

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

      // Draw items
      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];
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
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = fn.color;
        ctx.textAlign = 'center';
        ctx.fillText(fn.text, fn.x, fn.y);
        ctx.restore();
      }

      // Draw the Basket
      const currentBasketX = basketXRef.current;
      const bY = height - 42;
      const bW = 86;
      const bH = 32;

      ctx.save();
      ctx.font = '14px "Segoe UI Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎀', currentBasketX, bY - 4);

      ctx.beginPath();
      ctx.roundRect(currentBasketX - bW / 2, bY, bW, bH, [6, 6, 16, 16]);
      ctx.fillStyle = '#22081d';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#f48fb1';
      ctx.stroke();

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
              Catch hearts and sweet hugs, skip distractions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isGameOver && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause game' : 'Resume game'}
              className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={restartGame}
            aria-label="Restart game"
            className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Indicator Badges */}
      <div className="flex items-center justify-between text-[11px] px-1 py-1 rounded-xl bg-black/40 border border-pink-400/15 text-pink-200/80">
        <span className="flex items-center gap-1">💖 Hearts <b className="text-pink-300">+1</b></span>
        <span className="flex items-center gap-1">🫂/💋 Bonuses <b className="text-pink-300">+2</b></span>
        <span className="flex items-center gap-1">⚡ Distractions <b className="text-rose-400">-1</b></span>
      </div>

      {/* Score Banner */}
      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-pink-400/20 text-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-pink-300/80 font-medium">
            Emojis Collected
          </span>
          <span className="text-2xl font-bold text-pink-300 drop-shadow-[0_0_8px_rgba(255,105,180,0.4)]">
            {score}
          </span>
        </div>
        <p className="text-xs text-pink-100/90 font-light italic transition-all duration-300">
          "{isGameOver ? 'Deep breath. You can always restart.' : getPraise(score)}"
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

        {/* Game Over Screen Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3.5 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-wide">
                Game Over
              </h4>
              <p className="text-xs text-pink-200/70 font-light mt-1 max-w-xs">
                Score reached 0. Take a gentle breath and try again whenever you are ready.
              </p>
            </div>
            <button
              onClick={restartGame}
              className="min-h-[48px] px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-semibold shadow-lg shadow-pink-500/30 active:scale-95 transition-all touch-manipulation flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Game</span>
            </button>
          </div>
        )}

        {/* Paused Screen Overlay */}
        {!isPlaying && !isGameOver && (
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
        <span>No time limits. Game ends at 0 points.</span>
        <span>Drag anywhere to move basket</span>
      </div>
    </div>
  );
}

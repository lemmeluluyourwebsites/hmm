import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playPopSound } from '../../utils/audio';

const TOTAL_BUBBLES = 20;

export default function BubbleWrap() {
  const [poppedStates, setPoppedStates] = useState(
    Array(TOTAL_BUBBLES).fill(false)
  );

  const handlePop = (index) => {
    // Play sound and haptics even if re-popping, or toggle pop
    playPopSound();

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setPoppedStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleReset = () => {
    setPoppedStates(Array(TOTAL_BUBBLES).fill(false));
    if (navigator.vibrate) {
      navigator.vibrate([20, 20, 40]);
    }
  };

  const poppedCount = poppedStates.filter(Boolean).length;

  return (
    <div className="w-full rounded-3xl p-5 bg-[#0e0711] border border-pink-400/25 shadow-[0_0_25px_rgba(255,105,180,0.15)] flex flex-col gap-4">
      {/* Header and counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Haptic Bubble Wrap
            </h3>
            <p className="text-[11px] text-pink-200/60 font-light">
              Tap each bubble to pop stress away
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[48px] min-w-[48px] px-3.5 py-2 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-pink-300 hover:text-white hover:bg-pink-500/25 active:scale-95 transition-all text-xs font-medium flex items-center justify-center gap-1.5 touch-manipulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Bubble Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 justify-items-center py-2">
        {poppedStates.map((isPopped, idx) => (
          <button
            key={idx}
            onClick={() => handlePop(idx)}
            aria-label={`Bubble ${idx + 1}`}
            className="w-14 h-14 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center touch-manipulation outline-none transition-transform duration-200"
            style={{
              transform: isPopped ? 'scale(0.8)' : 'scale(1)',
              opacity: isPopped ? 0.35 : 1,
            }}
          >
            {/* Pink Glassmorphism Styled SVG Bubble */}
            <svg
              viewBox="0 0 60 60"
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(255,105,180,0.25)]"
            >
              <defs>
                <radialGradient
                  id={`bubbleGrad-${idx}`}
                  cx="32%"
                  cy="28%"
                  r="70%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={isPopped ? '0.2' : '0.8'} />
                  <stop offset="35%" stopColor="#ffb7ce" stopOpacity={isPopped ? '0.15' : '0.5'} />
                  <stop offset="70%" stopColor="#f48fb1" stopOpacity={isPopped ? '0.08' : '0.3'} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={isPopped ? '0.05' : '0.15'} />
                </radialGradient>
              </defs>

              {/* Main Sphere */}
              <circle
                cx="30"
                cy="30"
                r="26"
                fill={`url(#bubbleGrad-${idx})`}
                stroke={isPopped ? 'rgba(255, 182, 193, 0.2)' : 'rgba(255, 192, 203, 0.7)'}
                strokeWidth={isPopped ? '1' : '1.8'}
              />

              {/* Glass Glare Highlights */}
              {!isPopped && (
                <>
                  <ellipse
                    cx="22"
                    cy="20"
                    rx="7"
                    ry="4"
                    transform="rotate(-25 22 20)"
                    fill="rgba(255, 255, 255, 0.75)"
                  />
                  <circle
                    cx="39"
                    cy="39"
                    r="2.5"
                    fill="rgba(255, 255, 255, 0.45)"
                  />
                </>
              )}

              {/* Indentation ring when popped */}
              {isPopped && (
                <circle
                  cx="30"
                  cy="30"
                  r="14"
                  fill="none"
                  stroke="rgba(255, 182, 193, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="2,3"
                />
              )}
            </svg>
          </button>
        ))}
      </div>

      {/* Progress feedback */}
      <div className="flex items-center justify-between text-xs text-pink-200/70 pt-1 border-t border-pink-400/15">
        <span>Popped: {poppedCount} of {TOTAL_BUBBLES}</span>
        <span>{poppedCount === TOTAL_BUBBLES ? 'All calm and relaxed' : 'Keep popping'}</span>
      </div>
    </div>
  );
}

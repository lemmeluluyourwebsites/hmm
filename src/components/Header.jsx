import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function Header() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => {
        console.log('Audio autoplay prevented:', e);
      });
    }
  };

  return (
    <header className="w-full max-w-lg mx-auto pt-6 pb-2 px-4 flex items-center justify-between">
      <audio ref={audioRef} src="/media/bgm.mp3" loop preload="none" />

      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-pink-300/20 border border-pink-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,105,180,0.3)]">
          <span className="text-base select-none">🎀</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
            Mood Hamper
          </h1>
          <p className="text-[10px] text-pink-300/70 font-light">
            Your pocket safe space
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? 'Mute soothing melody' : 'Play soothing melody'}
          className={`min-h-[38px] px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all touch-manipulation ${
            isPlayingMusic
              ? 'bg-pink-500/25 border-pink-400 text-pink-200 shadow-[0_0_12px_rgba(255,105,180,0.4)] animate-pulse'
              : 'bg-pink-500/10 border-pink-400/20 text-pink-300/70 hover:text-pink-200'
          }`}
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink-300" />
              <span>Music On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-pink-300/60" />
              <span>Music</span>
            </>
          )}
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] text-pink-300">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
          <span className="font-medium">Cozy & Calm</span>
        </div>
      </div>
    </header>
  );
}

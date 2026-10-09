import React from 'react';

export default function Header() {
  return (
    <header className="w-full max-w-lg mx-auto pt-6 pb-2 px-4 flex items-center justify-between">
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

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] text-pink-300">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
        <span className="font-medium">Cozy & Calm</span>
      </div>
    </header>
  );
}

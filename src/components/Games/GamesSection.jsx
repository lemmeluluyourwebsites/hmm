import React from 'react';
import { Gamepad2, Sparkles, Clock } from 'lucide-react';
import CatchHeartsGame from './CatchHeartsGame';

export default function GamesSection() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-24 pt-2">
      {/* Section Header */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs font-medium text-pink-300 mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
          <span>Cozy Mini-Games</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Gentle Heart Catching
        </h2>
        <p className="text-xs text-pink-200/70 font-light mt-1 max-w-xs mx-auto">
          A mindless, slow, and soothing activity made solely to ease your thoughts.
        </p>
      </div>

      {/* Main Game Card */}
      <CatchHeartsGame />

      {/* More Games Coming Soon Card */}
      <div className="w-full rounded-3xl p-5 bg-[#0e0711] border border-pink-400/20 flex items-center justify-between gap-3 text-pink-300 shadow-[0_0_20px_rgba(255,105,180,0.1)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-500/15 border border-pink-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              More Games Coming Soon
            </h4>
            <p className="text-[11px] text-pink-200/60 font-light mt-0.5">
              New cozy mini-games will be added here for extra peace and smiles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[10px] text-pink-300 font-medium shrink-0">
          <Clock className="w-3 h-3 text-pink-400" />
          <span>Soon</span>
        </div>
      </div>
    </div>
  );
}

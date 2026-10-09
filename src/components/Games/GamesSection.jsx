import React from 'react';
import { Gamepad2 } from 'lucide-react';
import CatchHeartsGame from './CatchHeartsGame';

export default function GamesSection() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-24 pt-2">
      {/* Section Header */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs font-medium text-pink-300 mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
          <span>Cozy Mini-Game</span>
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
    </div>
  );
}

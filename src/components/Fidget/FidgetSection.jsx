import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import FluidCanvas from './FluidCanvas';
import BubbleWrap from './BubbleWrap';
import ScratchCard from './ScratchCard';

export default function FidgetSection() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-24 pt-2">
      {/* Section Header */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs font-medium text-pink-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>The Sensory Fidget Zone</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Tactile Stress Release
        </h2>
        <p className="text-xs text-pink-200/70 font-light mt-1 max-w-xs mx-auto">
          Engage your senses with soft pops, fluid ripples, and calming touch responses.
        </p>
      </div>

      {/* Fluid Simulation Ribbon */}
      <FluidCanvas />

      {/* Haptic Bubble Wrap */}
      <BubbleWrap />

      {/* Scratch-to-Reveal */}
      <ScratchCard />
    </div>
  );
}

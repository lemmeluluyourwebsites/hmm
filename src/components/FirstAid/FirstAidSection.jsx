import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Heart, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import VentModal from './VentModal';
import ComfortModal from './ComfortModal';
import OpenWhenCard from './OpenWhenCard';

export default function FirstAidSection() {
  const [ventOpen, setVentOpen] = useState(false);
  const [comfortType, setComfortType] = useState(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-24 pt-2">
      {/* Introduction Banner */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs font-medium text-pink-300 mb-2">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          <span>Emotional First Aid Kit</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Safe Haven for Your Heart
        </h2>
        <p className="text-xs text-pink-200/70 font-light mt-1 max-w-xs mx-auto">
          Whenever big feelings arrive, breathe deeply. You have gentle comfort right here.
        </p>
      </div>

      {/* The Vent Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <button
          onClick={() => setVentOpen(true)}
          className="w-full min-h-[58px] p-4 rounded-3xl bg-gradient-to-r from-[#1f0b16] via-[#290d1e] to-[#1a0813] border border-pink-400/50 shadow-[0_0_25px_rgba(255,105,180,0.25)] hover:shadow-[0_0_35px_rgba(255,105,180,0.4)] transition-all flex items-center justify-between gap-3 text-left touch-manipulation group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,105,180,0.3)]">
              <Flame className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-base font-semibold text-white tracking-wide block">
                Need to Vent?
              </span>
              <span className="text-xs text-pink-200/60 font-light block">
                Type it out and burn it into thin air.
              </span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-medium text-pink-300 shrink-0">
            Open
          </div>
        </button>
      </motion.div>

      {/* Comfort Buttons Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-pink-300/80">
            Quick Comfort Delivery
          </span>
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* I need a hug */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setComfortType('hug')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-[#120810] border border-pink-400/30 hover:border-pink-400/70 shadow-[0_0_15px_rgba(255,105,180,0.15)] hover:shadow-[0_0_25px_rgba(255,105,180,0.3)] flex items-center justify-center gap-2.5 text-pink-100 hover:text-white transition-all touch-manipulation"
          >
            <span className="text-lg">🫂</span>
            <span className="text-sm font-medium tracking-wide">I need a hug</span>
          </motion.button>

          {/* I need a kiss */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setComfortType('kiss')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-[#120810] border border-pink-400/30 hover:border-pink-400/70 shadow-[0_0_15px_rgba(255,105,180,0.15)] hover:shadow-[0_0_25px_rgba(255,105,180,0.3)] flex items-center justify-center gap-2.5 text-pink-100 hover:text-white transition-all touch-manipulation"
          >
            <span className="text-lg">💋</span>
            <span className="text-sm font-medium tracking-wide">I need a kiss</span>
          </motion.button>

          {/* I need both */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setComfortType('both')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-gradient-to-r from-[#1e0a19] to-[#260e20] border border-pink-400/40 hover:border-pink-400/80 shadow-[0_0_18px_rgba(255,105,180,0.2)] hover:shadow-[0_0_30px_rgba(255,105,180,0.35)] flex items-center justify-center gap-2.5 text-pink-100 hover:text-white transition-all touch-manipulation sm:col-span-1"
          >
            <span className="text-lg">💖</span>
            <span className="text-sm font-semibold tracking-wide">I need both</span>
          </motion.button>
        </div>
      </div>

      {/* Open When Letters Collection */}
      <div className="flex flex-col gap-2 pt-2">
        <OpenWhenCard />
      </div>

      {/* Modals */}
      <VentModal isOpen={ventOpen} onClose={() => setVentOpen(false)} />
      <ComfortModal
        type={comfortType}
        isOpen={Boolean(comfortType)}
        onClose={() => setComfortType(null)}
      />
    </div>
  );
}

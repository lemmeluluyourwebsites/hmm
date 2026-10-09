import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink, Heart } from 'lucide-react';

const LETTERS_URL =
  'https://openwhenletters.app/c/50985211-70cc-4705-85b2-2b786a28429c/v/e589b11821d520f4346a76b611480fb81e7197d3d31d608900fe0cc4b5d7b927';

export default function OpenWhenCard() {
  const handleOpenLetters = () => {
    window.open(LETTERS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleOpenLetters}
      className="relative w-full rounded-3xl p-5 cursor-pointer bg-gradient-to-br from-[#140b12] to-[#0a0a0c] border border-pink-400/40 shadow-[0_0_25px_rgba(255,105,180,0.2)] pulse-glow-card flex items-center justify-between gap-4 touch-manipulation group"
    >
      {/* Background delicate glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 z-10">
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-pink-300/20 border border-pink-300/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,105,180,0.3)]">
          <Mail className="w-7 h-7 text-pink-300 group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
          </span>
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-semibold text-white tracking-wide">
              My Open When Letters
            </h4>
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/60" />
          </div>
          <p className="text-xs text-pink-200/70 font-light mt-0.5">
            Heartfelt letters written specially for every feeling and moment.
          </p>
        </div>
      </div>

      <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-300 shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-all">
        <ExternalLink className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

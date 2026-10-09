import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';

const COMFORT_DATA = {
  hug: {
    title: 'A Warm Tight Hug',
    subtitle: 'Wrapping you in the softest, safest embrace right now.',
    gifUrl: '/media/hug.gif',
    fallbackEmoji: '🫂',
  },
  kiss: {
    title: 'Sweet Gentle Kiss',
    subtitle: 'A sweet peck on your cheeks to melt away the stress.',
    gifUrl: '/media/kiss.gif',
    fallbackEmoji: '💋',
  },
  both: {
    title: 'Warm Hug & Sweet Kiss',
    subtitle: 'All the cuddles, love, and sweet kisses reserved just for you.',
    gifUrl: '/media/both.gif',
    fallbackEmoji: '💖',
  },
};

export default function ComfortModal({ type, isOpen, onClose }) {
  if (!isOpen || !type || !COMFORT_DATA[type]) return null;

  const content = COMFORT_DATA[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl p-5 bg-[#0d0d11] border border-pink-400/30 shadow-[0_0_40px_rgba(255,105,180,0.2)] flex flex-col items-center text-center gap-3.5 z-10 overflow-hidden"
        >
          {/* Close Button at top right */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 text-pink-200 border border-pink-400/30 hover:text-white hover:bg-pink-500/20 active:scale-95 transition-all z-20 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Comfort Delivered</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide">
            {content.title}
          </h3>

          {/* Looping GIF Display */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/40 border border-pink-300/20 flex items-center justify-center shadow-inner">
            <img
              src={content.gifUrl}
              alt={content.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // If external network is offline, show charming fallback
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = 'flex';
                }
              }}
            />
            <div
              style={{ display: 'none' }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-pink-300 bg-pink-950/20"
            >
              <span className="text-6xl">{content.fallbackEmoji}</span>
              <span className="text-xs text-pink-300/80">Wrapped in endless love</span>
            </div>
          </div>

          <p className="text-xs text-pink-200/80 font-light leading-relaxed px-2">
            {content.subtitle}
          </p>

          {/* Thumb-friendly Dismiss Button */}
          <button
            onClick={onClose}
            className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500/80 to-rose-400/80 text-white font-medium text-sm hover:brightness-110 active:scale-[0.98] transition-all touch-manipulation flex items-center justify-center gap-2 shadow-md shadow-pink-500/20"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>I feel better now</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

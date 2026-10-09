import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Sparkles, Gamepad2 } from 'lucide-react';

export const TABS = [
  {
    id: 'first-aid',
    label: 'First Aid',
    icon: HeartHandshake,
  },
  {
    id: 'fidget',
    label: 'Fidget',
    icon: Sparkles,
  },
  {
    id: 'games',
    label: 'Games',
    icon: Gamepad2,
  },
];

export default function Navbar({ activeTab, onChangeTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2 pointer-events-none flex justify-center">
      <div className="w-full max-w-md pointer-events-auto rounded-3xl bg-[#0b080e]/90 backdrop-blur-xl border border-pink-400/30 shadow-[0_8px_32px_rgba(255,105,180,0.18)] p-1.5 flex items-center justify-between">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex-1 min-h-[52px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all touch-manipulation focus:outline-none"
            >
              {/* Active pill halo background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/25 via-pink-400/20 to-pink-500/25 border border-pink-400/50 shadow-[0_0_16px_rgba(255,105,180,0.3)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon and label */}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-pink-300 scale-110 drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]'
                      : 'text-pink-200/50 hover:text-pink-200/80'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${
                    isActive ? 'text-white font-semibold' : 'text-pink-200/50'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

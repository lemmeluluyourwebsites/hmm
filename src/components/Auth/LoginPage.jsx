import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (!res.success) {
        setErrorMsg('Incorrect username or password. Please try again.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#ffd1dc] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-pink-500/30 selection:text-white">
      {/* Background delicate ambient pink glow */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-3xl p-6 sm:p-8 bg-[#0b080e]/90 backdrop-blur-xl border border-pink-400/30 shadow-[0_0_40px_rgba(255,105,180,0.18)] flex flex-col gap-6 relative z-10"
      >
        {/* Emblem and Title */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500/30 to-pink-300/20 border border-pink-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,105,180,0.35)] mb-1">
            <span className="text-2xl select-none">🎀</span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500" />
            </span>
          </div>

          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-1.5">
            Mood Hamper
          </h1>
          <p className="text-xs text-pink-200/70 font-light max-w-xs">
            A private and cozy sanctuary. Enter your credentials to unlock.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-pink-300/90 pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-pink-300/60">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-pink-400/30 text-white placeholder-pink-300/30 text-sm outline-none focus:border-pink-400 focus:shadow-[0_0_15px_rgba(255,105,180,0.25)] transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-pink-300/90 pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-pink-300/60">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full min-h-[48px] pl-11 pr-11 py-3 rounded-2xl bg-black/60 border border-pink-400/30 text-white placeholder-pink-300/30 text-sm outline-none focus:border-pink-400 focus:shadow-[0_0_15px_rgba(255,105,180,0.25)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 p-1 text-pink-300/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-400 bg-rose-950/20 border border-rose-500/20 rounded-xl p-2.5 text-center font-light"
            >
              {errorMsg}
            </motion.p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500/90 to-rose-400/90 text-white font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all touch-manipulation flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 mt-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isLoading ? 'Unlocking...' : 'Unlock Hamper'}</span>
          </button>
        </form>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-pink-200/50">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400/40" />
          <span>Private and personalized access</span>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FirstAidSection from './components/FirstAid/FirstAidSection';
import FidgetSection from './components/Fidget/FidgetSection';
import GamesSection from './components/Games/GamesSection';

function HamperApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('first-aid');

  // If user is not authenticated, display the secret login landing page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-black text-[#ffd1dc] flex flex-col items-center justify-between selection:bg-pink-500/30 selection:text-white relative overflow-x-hidden">
      {/* Delicate background ambient glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <Header />

      {/* Main Content Area with Smooth Tab Transitions */}
      <main className="w-full flex-1 px-4 max-w-lg mx-auto flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {activeTab === 'first-aid' && (
            <motion.div
              key="first-aid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="w-full"
            >
              <FirstAidSection />
            </motion.div>
          )}

          {activeTab === 'fidget' && (
            <motion.div
              key="fidget"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="w-full"
            >
              <FidgetSection />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="w-full"
            >
              <GamesSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation */}
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HamperApp />
    </AuthProvider>
  );
}

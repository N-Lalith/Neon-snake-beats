import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col relative overflow-hidden font-sans select-none">
      {/* Background ambient light effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/20 blur-[120px] pointer-events-none" />
      
      {/* Grid overlay for aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header */}
      <header className="w-full p-6 relative z-10 flex justify-between items-center bg-gray-950/50 border-b border-gray-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500 shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
            <span className="font-bold text-gray-950 text-xl leading-none">N</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 uppercase">
            Nexus <span className="opacity-70 font-light">Arcade</span>
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-4 lg:p-8 relative z-10 w-full max-w-7xl mx-auto hCustom">
        
        {/* Left/Top: Snake Game */}
        <div className="flex-1 w-full flex items-center justify-center">
            <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player Widget */}
        <div className="w-full lg:w-auto flex justify-center items-center lg:items-start lg:mt-16 relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 blur-xl rounded-full opacity-50 z-0"></div>
             <div className="relative z-10">
                 <MusicPlayer />
             </div>
        </div>
        
      </main>

    </div>
  );
}


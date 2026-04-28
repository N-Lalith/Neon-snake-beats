import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Neon Drive', artist: 'Neural Network', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: 'text-cyan-400' },
  { id: 2, title: 'Synthwave Generation', artist: 'Algorithm X', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: 'text-pink-400' },
  { id: 3, title: 'Digital Dreams', artist: 'DeepMind DJ', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: 'text-green-400' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col items-center gap-4">
        {/* Neon Equalizer/Visualizer fake */}
        <div className="flex space-x-1 h-8 items-end w-full justify-center opacity-80 overflow-hidden">
           {[...Array(12)].map((_, i) => (
             <div 
                key={i} 
                className={`w-2 rounded-t-sm ${currentTrack.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] transition-all duration-300 ease-in-out`}
                style={{ 
                    height: isPlaying ? `${Math.random() * 100 + 10}%` : '10%',
                    animation: isPlaying ? `pulse-bar ${0.5 + Math.random()}s infinite alternate` : 'none' 
                }}
             />
           ))}
        </div>

        <div className="text-center w-full truncate">
          <h2 className={`text-xl font-bold ${currentTrack.color} drop-shadow-[0_0_8px_currentColor] truncate`}>
            {currentTrack.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1 truncate">{currentTrack.artist}</p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <button 
            onClick={handlePrev}
            className="p-2 text-gray-400 hover:text-white transition-colors hover:scale-110"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full bg-gray-800 border-2 ${currentTrack.color.replace('text-', 'border-')} ${currentTrack.color} shadow-[0_0_15px_currentColor] hover:scale-105 transition-transform`}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-gray-400 hover:text-white transition-colors hover:scale-110"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between w-full mt-2 border-t border-gray-800 pt-4">
            <button onClick={toggleMute} className="text-gray-500 hover:text-gray-300 transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                Now Playing : {currentTrackIndex + 1}/{TRACKS.length}
            </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onEnded={handleEnded}
        muted={isMuted}
        // loop={false}
      />
      
      <style>{`
        @keyframes pulse-bar {
            0% { transform: scaleY(0.3); opacity: 0.5; }
            100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

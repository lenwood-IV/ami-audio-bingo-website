import React, { useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Library, FileText, Play, Pause, SkipForward, SkipBack, LocateFixed } from 'lucide-react';

import HomePage from './pages/HomePage';
import GameView from './pages/GameView';
import CaseStudy from './pages/CaseStudy';
import { useAudio } from './context/AudioContext';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, playlist, currentIndex, progress, showMiniPlayer } = useAudio();

  useEffect(() => {
    if (scrollContainerRef.current && !location.state?.scrollTo) {
      scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]); 

  // NEW: Dedicated function to locate and scroll to the active track
  const handleJumpToTrack = (e) => {
    if (e) e.stopPropagation();
    if (currentTrack && currentTrack.characterId) {
      const safeId = currentTrack.matchKey.replace(/\s+/g, '-');
      navigate(`/game/${encodeURIComponent(currentTrack.characterId)}?type=${currentTrack.gameType}`, { 
        state: { scrollTo: safeId, t: Date.now() } 
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden content-padding-fix">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GameView />} />
          <Route path="/case-study" element={<CaseStudy />} />
        </Routes>
      </div>

      <div className="bottom-nav-container flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 relative">
        
        {/* FULL MINI PLAYER */}
        {showMiniPlayer && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/95 backdrop-blur-md">
            
            <div className="flex flex-col flex-1 overflow-hidden mr-4">
              <span className="text-sm font-bold truncate text-white">
                {currentTrack ? currentTrack.title : "No Track Playing"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 truncate mt-0.5 mb-1.5">
                {currentTrack ? currentTrack.script : "Select a game to start"}
              </span>
              
              <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ami-orange transition-[width] duration-300 ease-linear" 
                  style={{ width: `${currentTrack ? progress : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              
              {/* NEW: DEDICATED LOCATE BUTTON */}
              <button 
                onClick={handleJumpToTrack}
                disabled={!currentTrack}
                title="Locate playing track"
                className={`transition-all active:scale-90 ${!currentTrack ? 'text-slate-700' : 'text-slate-400 hover:text-ami-orange'}`}
              >
                <LocateFixed size={18} />
              </button>

              {/* DIVIDER */}
              <div className="w-px h-6 bg-white/10 mx-1"></div>

              <button 
                onClick={prevTrack}
                disabled={currentIndex <= 0}
                className={`transition-colors active:scale-90 ${currentIndex <= 0 ? 'text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button 
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 ${
                  currentTrack ? 'bg-gradient-to-r from-ami-orange to-red-600 shadow-orange-500/20' : 'bg-slate-800 text-slate-500'
                }`}
                onClick={togglePlayPause}
                disabled={!currentTrack}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              
              <button 
                onClick={nextTrack}
                disabled={currentIndex >= playlist.length - 1}
                className={`transition-colors active:scale-90 ${currentIndex >= playlist.length - 1 ? 'text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY NAVIGATION BAR */}
        <nav className="flex justify-center items-center py-2 px-4 w-full bg-slate-950/90 backdrop-blur-md overflow-x-auto no-scrollbar">
          <div className="flex items-center shrink-0 mx-auto">
            
            {/* TABS */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0">
              <Link to="/" className="group flex flex-col items-center gap-1 transition-colors w-20 sm:w-24">
                 <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/' || location.pathname.includes('/game') ? 'bg-white/10 text-ami-orange' : 'text-slate-400 group-hover:text-white'}`}>
                    <Library size={22} />
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${location.pathname === '/' || location.pathname.includes('/game') ? 'text-white' : 'text-slate-500'}`}>
                   Inventory
                 </span>
              </Link>
              <Link to="/case-study" className="group flex flex-col items-center gap-1 transition-colors w-20 sm:w-24">
                 <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/case-study' ? 'bg-white/10 text-ami-orange' : 'text-slate-400 group-hover:text-white'}`}>
                    <FileText size={22} />
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${location.pathname === '/case-study' ? 'text-white' : 'text-slate-500'}`}>
                   Case Study
                 </span>
              </Link>
            </div>

            {/* COMPACT AUDIO CONTROLS */}
            {!showMiniPlayer && currentTrack && (
              <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-6 ml-4 sm:ml-6 border-l border-white/10 shrink-0 h-10">
                
                {/* NEW: DEDICATED COMPACT LOCATE BUTTON */}
                <button 
                  onClick={handleJumpToTrack}
                  title="Locate playing track"
                  className="transition-all active:scale-90 text-slate-400 hover:text-ami-orange mr-1 sm:mr-2"
                >
                  <LocateFixed size={18} />
                </button>

                {/* DIVIDER */}
                <div className="w-px h-5 bg-white/10 mx-0 sm:mx-1"></div>

                <button 
                  onClick={prevTrack}
                  disabled={currentIndex <= 0}
                  className={`transition-colors active:scale-90 ${currentIndex <= 0 ? 'text-slate-700' : 'text-slate-400 hover:text-white'}`}
                >
                  <SkipBack size={18} fill="currentColor" />
                </button>
                
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 bg-gradient-to-r from-ami-orange to-red-600 shadow-orange-500/20"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <button 
                  onClick={nextTrack}
                  disabled={currentIndex >= playlist.length - 1}
                  className={`transition-colors active:scale-90 ${currentIndex >= playlist.length - 1 ? 'text-slate-700' : 'text-slate-400 hover:text-white'}`}
                >
                  <SkipForward size={18} fill="currentColor" />
                </button>
              </div>
            )}
            
          </div>
        </nav>

      </div>
    </div>
  );
}
import React, { useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Library, FileText, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

import HomePage from './pages/HomePage';
import GameView from './pages/GameView';
import CaseStudy from './pages/CaseStudy';
import { useAudio } from './context/AudioContext';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, playlist, currentIndex, progress } = useAudio();

  // ONLY reset scroll to top if we aren't specifically targeting a track
  useEffect(() => {
    if (scrollContainerRef.current && !location.state?.scrollTo) {
      scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]); 

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
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/95 backdrop-blur-md">
          
          <div 
            className="flex flex-col flex-1 overflow-hidden mr-4 cursor-pointer hover:bg-white/5 p-1 -ml-1 rounded transition-colors"
            onClick={() => {
              if (currentTrack && currentTrack.characterId) {
                // Pass the model-agnostic matchKey so the DOM can always find it
                const safeId = currentTrack.matchKey.replace(/\s+/g, '-');
                navigate(`/game/${encodeURIComponent(currentTrack.characterId)}?type=${currentTrack.gameType}`, { 
                  state: { scrollTo: safeId, t: Date.now() } 
                });
              }
            }}
          >
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

        <nav className="flex justify-center items-center p-2 w-full bg-slate-950/90 backdrop-blur-md gap-8">
          <Link to="/" className="group flex flex-col items-center gap-1 transition-colors w-24">
             <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/' || location.pathname.includes('/game') ? 'bg-white/10 text-ami-orange' : 'text-slate-400 group-hover:text-white'}`}>
                <Library size={22} />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-widest ${location.pathname === '/' || location.pathname.includes('/game') ? 'text-white' : 'text-slate-500'}`}>
               Inventory
             </span>
          </Link>
          <Link to="/case-study" className="group flex flex-col items-center gap-1 transition-colors w-24">
             <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/case-study' ? 'bg-white/10 text-ami-orange' : 'text-slate-400 group-hover:text-white'}`}>
                <FileText size={22} />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-widest ${location.pathname === '/case-study' ? 'text-white' : 'text-slate-500'}`}>
               Case Study
             </span>
          </Link>
        </nav>

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mic2, Dices, Play, Info } from 'lucide-react';
import inventory from '../data/inventory.json';
import { useAudio } from '../context/AudioContext';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('type') || 'standard_bingo';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Bring in the audio context to control the mini player toggle
  const { showMiniPlayer, toggleMiniPlayer } = useAudio();

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && typeFromUrl !== activeTab) {
      setActiveTab(typeFromUrl);
    }
  }, [searchParams, activeTab]);

  const formatName = (name) => {
    if (!name) return "Unknown";
    return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const rawGames = inventory[activeTab] || [];
  const groupedGames = {};

  rawGames.forEach(game => {
    let correctedModel = game.model;
    if (activeTab === 'trivia_bingo' && !game.id.includes('V2')) {
      correctedModel = 'V3';
    }

    const rawCharName = game.character_or_theme || 'Unknown';
    const cleanCharName = formatName(rawCharName);

    if (!groupedGames[cleanCharName]) {
      groupedGames[cleanCharName] = {
        name: cleanCharName,
        rawName: rawCharName,
        modelsAvailable: [correctedModel],
        totalTracks: game.audio_files ? game.audio_files.length : 0,
      };
    } else {
      if (!groupedGames[cleanCharName].modelsAvailable.includes(correctedModel)) {
        groupedGames[cleanCharName].modelsAvailable.push(correctedModel);
      }
      groupedGames[cleanCharName].totalTracks += (game.audio_files ? game.audio_files.length : 0);
    }
  });

  const consolidatedGames = Object.values(groupedGames);
  const sortedGames = [...consolidatedGames].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-6 pt-12 pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2 text-white">Audio Bingo Inventory</h1>
        <p className="text-slate-400">Select a game type and character to preview the generated audio.</p>
      </div>
      
      <div className="flex space-x-2 p-1 bg-slate-900 rounded-xl border border-white/5 mb-6">
        <button 
          onClick={() => {
            setActiveTab('standard_bingo');
            setSearchParams({ type: 'standard_bingo' });
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'standard_bingo' 
              ? 'bg-gradient-to-r from-ami-orange to-red-600 text-white shadow-lg shadow-orange-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mic2 size={18} />
          Standard Bingo
        </button>
        <button 
          onClick={() => {
            setActiveTab('trivia_bingo');
            setSearchParams({ type: 'trivia_bingo' });
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'trivia_bingo' 
              ? 'bg-gradient-to-r from-ami-orange to-red-600 text-white shadow-lg shadow-orange-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Dices size={18} />
          Trivia Bingo
        </button>
      </div>

      {/* NEW: EXPLAINER BLURB */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-inner">
        <Info className="text-ami-orange shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-slate-300 leading-relaxed">
          {activeTab === 'standard_bingo' ? (
            <p><strong className="text-white font-bold">Standard Bingo:</strong> Select a virtual host with a distinct style and personality to call a classic, fully-produced game of Bingo. Each host brings their own unique flavor to the numbers.</p>
          ) : (
            <p><strong className="text-white font-bold">Trivia Bingo:</strong> Test your crowd's knowledge! Choose a thematic host to guide players through specialized trivia questions where the answers live on their Bingo cards.</p>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS & MINI PLAYER TOGGLE */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {sortedGames.length} {activeTab === 'standard_bingo' ? 'Voices' : 'Games'}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mini Player</span>
          <button 
            onClick={toggleMiniPlayer}
            className={`w-10 h-5 rounded-full relative transition-colors ${showMiniPlayer ? 'bg-ami-orange' : 'bg-slate-700'}`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${showMiniPlayer ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {sortedGames.map((game) => {
          return (
            <Link 
              key={game.name} 
              to={`/game/${encodeURIComponent(game.rawName)}?type=${activeTab}`}
              className="group flex items-center justify-between bg-slate-900 border border-white/5 rounded-xl p-4 hover:bg-slate-800 hover:scale-[1.02] hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ami-orange/0 to-ami-orange/0 group-hover:from-ami-orange/5 group-hover:to-transparent transition-all" />
              
              <div className="flex flex-col relative z-10 pr-2">
                <h3 className="text-xl font-black tracking-tight text-white leading-tight">
                  {game.name}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  {game.totalTracks} Tracks
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-3 relative z-10 shrink-0">
                
                <div className="flex gap-1.5">
                  {[...game.modelsAvailable].sort().map(model => (
                    <span key={model} className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest shadow-sm ${
                      model === 'V3' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {model}
                    </span>
                  ))}
                </div>
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ami-orange to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-orange-500/40 transition-all">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            </Link>
          )
        })}
        
        {sortedGames.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl font-bold">
            No games found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
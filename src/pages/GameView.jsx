import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Shuffle, ArrowDownAZ, Play, Pause, ChevronDown, ChevronUp, FileText, Mic2 } from 'lucide-react';
import inventory from '../data/inventory.json';
import CharacterMenu from '../components/CharacterMenu';
import { useAudio } from '../context/AudioContext';

export default function GameView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation(); 
  const gameType = searchParams.get('type') || 'standard_bingo';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { playTrack, currentTrack, isPlaying, togglePlayPause, progress } = useAudio();
  
  const availableVersions = useMemo(() => {
    const rawGames = inventory[gameType] || [];
    const characterGames = rawGames.filter(g => g.character_or_theme === id);
    return characterGames.map(game => {
      let correctedModel = game.model;
      if (gameType === 'trivia_bingo' && !game.id.includes('V2')) correctedModel = 'V3';
      return { ...game, model: correctedModel };
    });
  }, [gameType, id]);

  const hasV3 = availableVersions.some(g => g.model === 'V3');
  const hasV2 = availableVersions.some(g => g.model === 'V2');
  
  const [selectedModel, setSelectedModel] = useState((hasV3 && hasV2) ? 'Compare' : (hasV3 ? 'V3' : 'V2'));
  const [isShuffled, setIsShuffled] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState(null);
  const [shuffleCount, setShuffleCount] = useState(0); 
  const [pendingPlay, setPendingPlay] = useState(false);

  const rawGames = inventory[gameType] || [];
  const uniqueCharacters = [...new Set(rawGames.map(g => g.character_or_theme))].sort();

  useEffect(() => {
    setSelectedModel((hasV3 && hasV2) ? 'Compare' : (hasV3 ? 'V3' : 'V2'));
    setShuffleCount(0);
    setExpandedTrack(null);
    setPendingPlay(false);
  }, [id, hasV3, hasV2]);

  useEffect(() => {
    if (currentTrack) setExpandedTrack(currentTrack.uniqueId);
  }, [currentTrack?.uniqueId]);

  // UPDATED: Smooth Scroll Interceptor now forces the track to expand
  useEffect(() => {
    if (location.state?.scrollTo) {
      
      // 1. Force the script open if it was manually collapsed
      if (currentTrack) {
        setExpandedTrack(currentTrack.uniqueId);
      }

      // 2. Execute the smooth scroll
      setTimeout(() => {
        const el = document.getElementById(`track-${location.state.scrollTo}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.scrollTo, location.state?.t]);

  const v3GameData = useMemo(() => availableVersions.find(g => g.model === 'V3'), [availableVersions]);
  const v2GameData = useMemo(() => availableVersions.find(g => g.model === 'V2'), [availableVersions]);

  const formatName = (name) => name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  const cleanScript = (text) => text ? text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : "No script available.";

  const { v3Playlist, v2Playlist } = useMemo(() => {
    const parseGameData = (gameData, modelType) => {
      if (!gameData) return null;
      let anchors = [];
      let calls = [];

      (gameData.audio_files || []).forEach(filename => {
        const baseFilename = filename.replace('.mp3', '').toUpperCase();
        const matchingRow = (gameData.csv_data || []).find(row => {
          const fileKey = Object.keys(row).find(k => k.toUpperCase().replace(/\s/g, '') === 'FILENAME');
          return fileKey && row[fileKey]?.toUpperCase() === baseFilename;
        });

        let scriptText = "No script available.";
        let questionText = "";
        let answerText = "";

        if (matchingRow) {
          const scriptKey = Object.keys(matchingRow).find(k => k.toUpperCase().includes('SCRIPT') || k.toUpperCase() === 'TEXT');
          if (scriptKey) scriptText = cleanScript(matchingRow[scriptKey]);
          
          const qKey = Object.keys(matchingRow).find(k => k.toUpperCase().includes('QUESTION'));
          if (qKey) questionText = matchingRow[qKey];
          
          const aKey = Object.keys(matchingRow).find(k => k.toUpperCase().includes('ANSWER'));
          if (aKey) answerText = matchingRow[aKey];
        }
        
        const getMatchKey = (fname) => {
            const cleanName = fname.replace('.mp3', '');
            const parts = cleanName.split('_');
            if (parts.length >= 2 && /^\d+$/.test(parts[0]) && /^[BINGO]-\d+$/.test(parts[1])) {
                return `${parts[0]}_${parts[1]}`;
            }
            return cleanName;
        };

        const trackObj = { 
          id: filename, 
          uniqueId: `${modelType}_${filename}`, 
          matchKey: getMatchKey(filename), 
          filename, 
          folderPath: gameData.path, 
          script: scriptText, 
          question: questionText,
          answer: answerText,
          isAnchor: false, 
          insertAfter: -1,
          model: modelType,
          characterId: id,
          gameType: gameType
        };
        
        const upperFile = filename.toUpperCase();
        if (upperFile.includes('PREVIEW')) {
          trackObj.isAnchor = true;
          trackObj.title = "Game Preview";
          anchors.push(trackObj);
        } else if (upperFile.includes('HOST')) {
          trackObj.isAnchor = true;
          if (upperFile.includes('START')) {
            trackObj.insertAfter = 0;
            trackObj.title = "Host Announcement - Game Start";
          } else {
            const match = upperFile.match(/HOST_(\d+)/);
            const num = match ? parseInt(match[1], 10) : 0;
            trackObj.insertAfter = num;
            trackObj.title = num > 0 ? `Host Announcement - ${num} Tracks In` : "Host Announcement";
          }
          anchors.push(trackObj);
        } else {
          if (gameType === 'trivia_bingo' && answerText) {
             trackObj.title = answerText;
          } else if (gameType === 'standard_bingo') {
             const match = filename.match(/([BINGO]-\d+)/i);
             trackObj.title = match ? match[1].toUpperCase() : filename.replace('.mp3', '').replace(/_/g, ' ');
          } else {
             trackObj.title = filename.replace('.mp3', '').replace(/_/g, ' ');
          }
          calls.push(trackObj);
        }
      });
      return { anchors, calls };
    };

    const v3Data = parseGameData(v3GameData, 'V3');
    const v2Data = parseGameData(v2GameData, 'V2');

    let masterCalls = v3Data ? [...v3Data.calls] : (v2Data ? [...v2Data.calls] : []);
    
    if (shuffleCount > 0) {
      for (let i = masterCalls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [masterCalls[i], masterCalls[j]] = [masterCalls[j], masterCalls[i]];
      }
    } else {
      masterCalls.sort((a, b) => a.title.localeCompare(b.title));
    }

    const assembleFinal = (data, sortedMaster) => {
      if (!data) return [];
      
      const orderedCalls = sortedMaster.map(masterCall => 
        data.calls.find(c => c.matchKey === masterCall.matchKey)
      ).filter(Boolean);

      let finalPlaylist = [];
      const preview = data.anchors.find(a => a.insertAfter === -1);
      if (preview) finalPlaylist.push(preview);
      const startHost = data.anchors.find(a => a.insertAfter === 0);
      if (startHost) finalPlaylist.push(startHost);

      let callCounter = 0;
      orderedCalls.forEach(call => {
        callCounter++;
        finalPlaylist.push({ ...call, displayNumber: callCounter });
        const hostTrack = data.anchors.find(a => a.insertAfter === callCounter);
        if (hostTrack) finalPlaylist.push(hostTrack);
      });
      return finalPlaylist;
    };

    return {
      v3Playlist: assembleFinal(v3Data, masterCalls),
      v2Playlist: assembleFinal(v2Data, masterCalls)
    };
  }, [v3GameData, v2GameData, shuffleCount, id, gameType]);

  const isCompareMode = selectedModel === 'Compare';
  const activePlaylist = selectedModel === 'V2' ? v2Playlist : v3Playlist;

  useEffect(() => {
    if (pendingPlay && activePlaylist.length > 0) {
      playTrack(activePlaylist[0], activePlaylist);
      setPendingPlay(false);
    }
  }, [activePlaylist, pendingPlay, playTrack]);

  if (!activePlaylist.length) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="p-6 pt-8 pb-32">
      <Link to={`/?type=${gameType}`} className="inline-flex items-center text-ami-orange hover:text-white transition-colors mb-6 font-bold text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2 cursor-pointer w-fit group" onClick={() => setIsMenuOpen(true)}>
            <h1 className="text-4xl font-black text-white uppercase leading-none group-hover:text-ami-orange transition-colors">{formatName(id)}</h1>
            <ChevronDown size={24} className="text-slate-600 group-hover:text-ami-orange transition-colors" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">{gameType.replace('_', ' ')} • {activePlaylist.length} Total Tracks</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1.5 border border-white/5 pl-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">11Labs Model:</span>
          <div className="flex bg-slate-950 rounded-md border border-white/5">
            {hasV3 && (
              <button onClick={() => setSelectedModel('V3')} className={`px-5 py-1.5 rounded text-xs font-black tracking-widest transition-all ${selectedModel === 'V3' ? 'bg-gradient-to-r from-ami-orange to-red-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>
                V3
              </button>
            )}
            {hasV2 && (
              <button onClick={() => setSelectedModel('V2')} className={`px-5 py-1.5 rounded text-xs font-black tracking-widest transition-all ${selectedModel === 'V2' ? 'bg-gradient-to-r from-ami-orange to-red-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>
                V2
              </button>
            )}
            {hasV3 && hasV2 && (
              <button onClick={() => setSelectedModel('Compare')} className={`px-4 py-1.5 rounded text-xs font-black tracking-widest transition-all ${selectedModel === 'Compare' ? 'bg-gradient-to-r from-ami-orange to-red-600 text-white shadow-md shadow-orange-500/20' : 'text-slate-500 hover:text-white'}`}>
                COMPARE
              </button>
            )}
          </div>
        </div>
      </div>

      <CharacterMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} characters={uniqueCharacters} gameType={gameType} currentId={id} />

      <div className="flex justify-between items-center bg-slate-900 border border-white/5 rounded-xl p-4 mb-6 sticky top-4 z-20 shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="flex gap-2">
          <button 
            onClick={() => { setShuffleCount(0); setPendingPlay(true); }} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${shuffleCount === 0 ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <ArrowDownAZ size={16} /> A-Z
          </button>
          
          <button 
            onClick={() => { setShuffleCount(c => c + 1); setPendingPlay(true); }} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${shuffleCount > 0 ? 'bg-ami-orange text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Shuffle size={16} /> Shuffle
          </button>
        </div>
        
        <button 
          onClick={() => playTrack(activePlaylist[0], activePlaylist)}
          className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-ami-orange to-red-600 text-white font-black text-sm rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all`}
        >
          <Play size={16} fill="currentColor" /> {isCompareMode ? "PLAY ALL (V3)" : "PLAY ALL"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {activePlaylist.map((track, index) => {
          
          const v2Equivalent = isCompareMode ? v2Playlist.find(t => t.matchKey === track.matchKey) : null;
          
          const isV3Playing = currentTrack?.uniqueId === track.uniqueId;
          const isV2Playing = isCompareMode && currentTrack?.uniqueId === v2Equivalent?.uniqueId;
          const isCurrentlyPlaying = isV3Playing || isV2Playing;
          
          const isExpanded = expandedTrack === track.uniqueId || (isCompareMode && v2Equivalent && expandedTrack === v2Equivalent.uniqueId);
          
          return (
            <div 
              key={track.uniqueId + index} 
              id={`track-${track.matchKey.replace(/\s+/g, '-')}`} 
              className={`flex flex-col border transition-all rounded-xl overflow-hidden ${isCurrentlyPlaying ? 'border-ami-orange/50 bg-ami-orange/5' : track.isAnchor ? 'border-ami-orange/30 bg-slate-900/50' : 'border-white/5 bg-slate-900/50'}`}
            >
              
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedTrack(isExpanded ? null : track.uniqueId)}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-8 flex justify-center text-xs font-bold text-slate-500 shrink-0">
                    {isCurrentlyPlaying ? (
                      <div className="flex items-end gap-0.5 h-3">
                        <div className="w-1 bg-ami-orange animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                        <div className="w-1 bg-ami-orange animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }}></div>
                        <div className="w-1 bg-ami-orange animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}></div>
                      </div>
                    ) : track.isAnchor ? <Mic2 size={14} className="text-ami-orange" /> : track.displayNumber}
                  </div>
                  
                  {isCompareMode && v2Equivalent ? (
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0 mr-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); isV3Playing && isPlaying ? togglePlayPause() : playTrack(track, v3Playlist); }}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${isV3Playing && isPlaying ? 'bg-ami-orange text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-ami-orange hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-ami-orange/50'}`}
                      >
                        {isV3Playing && isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor" />} V3
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); isV2Playing && isPlaying ? togglePlayPause() : playTrack(v2Equivalent, v2Playlist); }}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${isV2Playing && isPlaying ? 'bg-slate-500 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-500'}`}
                      >
                        {isV2Playing && isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor" />} V2
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); isCurrentlyPlaying ? togglePlayPause() : playTrack(track, activePlaylist); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 mr-2 ${isCurrentlyPlaying && isPlaying ? 'bg-ami-orange text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                    >
                      {isCurrentlyPlaying && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                    </button>
                  )}
                  
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-2">
                      <span className={`font-black tracking-tight truncate ${isCurrentlyPlaying ? 'text-ami-orange' : track.isAnchor ? 'text-ami-orange/80' : 'text-white'}`}>{track.title}</span>
                      {!isCompareMode && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest hidden sm:inline-block ${selectedModel === 'V3' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>{selectedModel}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5 truncate">
                      {track.isAnchor ? 'Host Event' : (track.question ? track.question : 'Game Call')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 text-slate-500 ml-4">
                  <FileText size={16} className={isExpanded ? 'text-white' : ''} />
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-16 pb-6 pt-2">
                  <div className="bg-slate-950 rounded-lg p-4 border border-white/5 relative overflow-hidden">
                    
                    {isCurrentlyPlaying && (
                      <div 
                        className={`absolute inset-y-0 left-0 transition-[width] duration-300 ease-linear z-0 ${isCompareMode && isV2Playing ? 'bg-slate-500/20' : 'bg-ami-orange/15'}`}
                        style={{ width: `${progress}%` }}
                      />
                    )}

                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 relative z-10">Voice Script</span>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                      "{isV2Playing && v2Equivalent ? v2Equivalent.script : track.script}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
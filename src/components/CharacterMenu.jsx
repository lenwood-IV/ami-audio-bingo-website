import React from 'react';
import { Link } from 'react-router-dom';
import { X, Mic2, Dices } from 'lucide-react';

export default function CharacterMenu({ isOpen, onClose, characters, gameType, currentId }) {
  if (!isOpen) return null;

  return (
    // Z-INDEX 99999 ensures this sits above absolutely everything
    <div className="fixed inset-0 z-[99999] flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Slide-Up Panel: Using 70svh ensures it never gets hidden by the bottom nav */}
      <div className="relative bg-slate-900 w-full max-h-[70svh] rounded-t-3xl border-t border-white/10 p-6 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-black text-white">Select Character</h2>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable list area */}
        <div className="overflow-y-auto space-y-2 pb-6">
          {characters.map((char) => (
            <Link
              key={char}
              to={`/game/${encodeURIComponent(char)}?type=${gameType}`}
              onClick={onClose}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                char === currentId 
                  ? 'bg-ami-orange/10 border-ami-orange text-ami-orange' 
                  : 'bg-slate-800 border-transparent hover:bg-slate-700 text-white'
              }`}
            >
              {gameType === 'standard_bingo' ? <Mic2 size={20} /> : <Dices size={20} />}
              <span className="font-bold uppercase tracking-widest">{char.replace(/_/g, ' ')}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
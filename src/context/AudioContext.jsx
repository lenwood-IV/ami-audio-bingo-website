import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [progress, setProgress] = useState(0); // NEW: Track progress percentage

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (currentIndex < playlist.length - 1) {
        const nextTrack = playlist[currentIndex + 1];
        playTrack(nextTrack, playlist);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // NEW: Fire continuously while audio plays
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [playlist, currentIndex]);

  const playTrack = (track, newPlaylist = null) => {
    const activePlaylist = newPlaylist || playlist;
    if (newPlaylist) setPlaylist(newPlaylist);
    
    const index = activePlaylist.findIndex(t => t.id === track.id);
    setCurrentIndex(index);
    setCurrentTrack(track);
    setProgress(0); // Reset progress on new track

    const audio = audioRef.current;
    
    const newSrc = `/${track.folderPath}/${track.filename}`;
    if (!audio.src.endsWith(newSrc)) {
      audio.src = newSrc;
    }
    
    audio.play().catch(e => console.error("Audio playback blocked by browser:", e));
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Playback failed:", e));
    }
  };

  const nextTrack = () => {
    if (currentIndex < playlist.length - 1) {
      playTrack(playlist[currentIndex + 1]);
    }
  };

  const prevTrack = () => {
    if (currentIndex > 0) {
      playTrack(playlist[currentIndex - 1]);
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrack,
      playlist,
      currentIndex,
      progress, // EXPORT PROGRESS
      playTrack,
      togglePlayPause,
      nextTrack,
      prevTrack
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
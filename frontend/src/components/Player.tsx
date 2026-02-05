import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../lib/utils';
import { tracksApi, userApi } from '../lib/api';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    repeat,
    shuffle,
    togglePlay,
    playNext,
    playPrevious,
    setCurrentTime,
    setVolume,
    setRepeat,
    toggleShuffle,
    setIsPlaying,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.fileUrl;
    audioRef.current.play();
    
    tracksApi.play(currentTrack.id).catch(console.error);
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleFavorite = async () => {
    if (!currentTrack) return;
    
    try {
      if (isFavorite) {
        await userApi.removeFavorite(currentTrack.id);
      } else {
        await userApi.addFavorite(currentTrack.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const cycleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    setRepeat(modes[(currentIndex + 1) % modes.length]);
  };

  if (!currentTrack) {
    return (
      <div className="h-24 bg-dark-100 border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-400">No track playing</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-dark-100 border-t border-gray-800 px-4 flex items-center justify-between">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-4 w-1/4">
        {currentTrack.coverUrl && (
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-14 h-14 rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {currentTrack.artist.name}
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-white transition"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-primary text-primary' : ''}
          />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 w-2/4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`transition ${
              shuffle ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle size={20} />
          </button>
          
          <button
            onClick={playPrevious}
            className="text-gray-400 hover:text-white transition"
          >
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:scale-105 transition"
          >
            {isPlaying ? (
              <Pause size={24} className="text-black" />
            ) : (
              <Play size={24} className="text-black ml-1" />
            )}
          </button>
          
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition"
          >
            <SkipForward size={24} />
          </button>
          
          <button
            onClick={cycleRepeat}
            className={`transition ${
              repeat !== 'off' ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat size={20} />
            {repeat === 'one' && (
              <span className="text-xs absolute ml-3 -mt-2">1</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400">
            {formatDuration(Math.floor(currentTime))}
          </span>
          <input
            type="range"
            min="0"
            max={currentTrack.duration}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">
            {formatDuration(currentTrack.duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-1/4 justify-end">
        <Volume2 size={20} className="text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
          border: none;
        }

        .slider:hover::-webkit-slider-thumb {
          background: #1ed760;
        }

        .slider:hover::-moz-range-thumb {
          background: #1ed760;
        }
      `}</style>
    </div>
  );
}

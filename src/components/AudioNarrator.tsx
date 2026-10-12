import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw, Sparkles } from 'lucide-react';

interface AudioNarratorProps {
  textToRead: string;
  personaName: string;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({ textToRead, personaName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Stop speech when text or component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToRead]);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const cleanText = textToRead.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    utterance.rate = rate;

    if (voices.length > 0 && voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      handleTogglePlay();
      setTimeout(handleTogglePlay, 50);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20 text-white">
          <Volume2 className="w-5 h-5" />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Voice Narration
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {personaName} Mode
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200">
            {isPlaying ? 'Recapping your day aloud...' : 'Listen to this recap as an audio debrief'}
          </p>
        </div>
      </div>

      {/* Waveform Animation when playing */}
      <div className="hidden sm:flex items-center gap-1 h-6 px-3 py-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
        {[40, 70, 30, 90, 60, 45, 85, 35, 75, 50].map((h, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse'
                : 'bg-slate-700 h-2'
            }`}
            style={{
              height: isPlaying ? `${Math.max(6, (h * Math.random()) % 22 + 4)}px` : '4px',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Speed Controls */}
        <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
          {[1.0, 1.2, 1.4].map((s) => (
            <button
              key={s}
              onClick={() => handleRateChange(s)}
              className={`px-2 py-1 rounded-md transition-colors ${
                rate === s
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Play / Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Read Aloud</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsPlaying(false);
            }}
            title="Stop & Reset"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

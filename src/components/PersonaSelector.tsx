import React, { useState } from 'react';
import { Mic, Briefcase, Skull, Flower2, Search, Copy, Check, Sparkles } from 'lucide-react';
import { SummaryPersonaKey } from '../types';

interface PersonaSelectorProps {
  personas: {
    podcaster: string;
    executive: string;
    roast: string;
    zen: string;
    detective: string;
  };
  activePersona: SummaryPersonaKey;
  onSelectPersona: (key: SummaryPersonaKey) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  activePersona,
  onSelectPersona,
}) => {
  const [copied, setCopied] = useState(false);

  const personaConfig: Record<
    SummaryPersonaKey,
    { label: string; icon: React.ReactNode; desc: string; color: string; badge: string }
  > = {
    podcaster: {
      label: 'The Podcaster',
      icon: <Mic className="w-4 h-4" />,
      desc: 'High-energy, conversational daily debrief podcast host',
      color: 'from-amber-500 to-orange-500',
      badge: 'Energetic & Charismatic',
    },
    executive: {
      label: 'C-Suite Memo',
      icon: <Briefcase className="w-4 h-4" />,
      desc: 'Crisp corporate throughput analysis & efficiency diagnosis',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Analytical & Direct',
    },
    roast: {
      label: 'Brutal Roast',
      icon: <Skull className="w-4 h-4" />,
      desc: 'Savage internet roast of your procrastinations and guilty pleasures',
      color: 'from-rose-500 to-red-600',
      badge: 'Unfiltered Comedy',
    },
    zen: {
      label: 'Zen Reflection',
      icon: <Flower2 className="w-4 h-4" />,
      desc: 'Mindful monk honoring breath, stillness, and small victories',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Calm & Grounding',
    },
    detective: {
      label: 'Noir Detective',
      icon: <Search className="w-4 h-4" />,
      desc: 'Gritty 1940s private investigator tracking your digital footprints',
      color: 'from-purple-500 to-slate-700',
      badge: 'Atmospheric Noir',
    },
  };

  const currentSummary = personas[activePersona] || personas.podcaster;
  const currentMeta = personaConfig[activePersona];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-lg">AI Persona Narratives</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch how your day's story is told—from corporate memos to brutal roasts
          </p>
        </div>

        {/* Persona Pill Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(Object.keys(personaConfig) as SummaryPersonaKey[]).map((key) => {
            const item = personaConfig[key];
            const isSelected = activePersona === key;
            return (
              <button
                key={key}
                onClick={() => onSelectPersona(key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-purple-500/20 ring-2 ring-white/20`
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Narrative Display Card */}
      <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5 sm:p-6 shadow-inner">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {currentMeta.label}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {currentMeta.badge}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        {/* Narrative Text */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line selection:bg-purple-500/40 selection:text-white">
          {currentSummary}
        </p>

        {/* Persona tip footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{currentMeta.desc}</span>
          <span className="text-purple-400">Audio playback available above ↑</span>
        </div>
      </div>
    </div>
  );
};

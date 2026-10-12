import React, { useState } from 'react';
import { Clock, Music2, Mail, Video, Calendar, Footprints, Filter } from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineViewProps {
  items: TimelineItem[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ items }) => {
  const [filter, setFilter] = useState<'all' | 'spotify' | 'gmail' | 'tiktok' | 'calendar' | 'health'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'spotify':
        return {
          icon: <Music2 className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-500/15 border-emerald-500/30',
          textColor: 'text-emerald-400',
          ringColor: 'border-emerald-500',
        };
      case 'gmail':
        return {
          icon: <Mail className="w-4 h-4 text-rose-400" />,
          bgColor: 'bg-rose-500/15 border-rose-500/30',
          textColor: 'text-rose-400',
          ringColor: 'border-rose-500',
        };
      case 'tiktok':
        return {
          icon: <Video className="w-4 h-4 text-cyan-400" />,
          bgColor: 'bg-cyan-500/15 border-cyan-500/30',
          textColor: 'text-cyan-400',
          ringColor: 'border-cyan-500',
        };
      case 'calendar':
        return {
          icon: <Calendar className="w-4 h-4 text-purple-400" />,
          bgColor: 'bg-purple-500/15 border-purple-500/30',
          textColor: 'text-purple-400',
          ringColor: 'border-purple-500',
        };
      case 'health':
        return {
          icon: <Footprints className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-500/15 border-amber-500/30',
          textColor: 'text-amber-400',
          ringColor: 'border-amber-500',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-indigo-400" />,
          bgColor: 'bg-indigo-500/15 border-indigo-500/30',
          textColor: 'text-indigo-400',
          ringColor: 'border-indigo-500',
        };
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-lg">Integrated Daily Chronology</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            How your apps and behaviors wove together across 24 hours
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {(
            [
              { id: 'all', label: 'All Events' },
              { id: 'spotify', label: 'Spotify' },
              { id: 'gmail', label: 'Gmail' },
              { id: 'tiktok', label: 'TikTok' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'health', label: 'Health' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === t.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {filteredItems.map((item, index) => {
          const details = getCategoryDetails(item.category);
          return (
            <div key={index} className="relative group">
              {/* Dot Icon Indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-slate-900 border-2 ${details.ringColor} shadow-md transition-transform group-hover:scale-110`}
              >
                {details.icon}
              </div>

              {/* Card Body */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-slate-700 hover:bg-slate-950/90 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.time}
                    </span>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${details.bgColor} ${details.textColor}`}
                  >
                    {item.vibeBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

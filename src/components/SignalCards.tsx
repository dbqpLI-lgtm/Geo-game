import React from 'react';
import { Music2, Mail, Video, Calendar, Footprints, Flame, AlertCircle, Headphones, Sparkles, Clock, CheckCircle2, Bookmark, BarChart3 } from 'lucide-react';
import { DayDataPayload } from '../types';

interface SignalCardsProps {
  data: DayDataPayload;
}

export const SignalCards: React.FC<SignalCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. SPOTIFY SIGNAL CARD */}
      <div className="relative group bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 group-hover:bg-emerald-500/15 transition-all" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Spotify Audio Trail</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {data.spotify.topGenre}
                </span>
              </div>
              <p className="text-xs text-slate-400">Auditory focus & mood regulation</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400">{data.spotify.minutesListened}m</div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Minutes streamed</span>
          </div>
        </div>

        {/* Top Tracks Breakdown */}
        <div className="space-y-2.5 mb-5">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Peak Tracks Today</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Headphones className="w-3 h-3" /> Heavy Rotation
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.spotify.topTracks.slice(0, 4).map((track, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-bold text-white truncate">{track.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-medium whitespace-nowrap shrink-0 border border-emerald-800/40">
                  {track.vibe}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Progression */}
        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Sonic Energy Timeline
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{data.spotify.audioMood}</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-14 pt-2">
            {data.spotify.energyProgression.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-md transition-all group-hover/bar:brightness-125"
                  style={{ height: `${(item.energy / 100) * 36}px` }}
                />
                <span className="text-[9px] text-slate-400 font-mono">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guilty Pleasure */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-emerald-300 font-medium">Guilty Pleasure: </strong>
            {data.spotify.guiltyPleasure}
          </span>
        </div>
      </div>

      {/* 2. GMAIL SIGNAL CARD */}
      <div className="relative group bg-slate-900/70 border border-slate-800/80 hover:border-rose-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 group-hover:bg-rose-500/15 transition-all" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Gmail Influx & Urgency</h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    data.gmail.stressRating === 'Chill'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : data.gmail.stressRating === 'Moderate'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {data.gmail.stressRating} Stress
                </span>
              </div>
              <p className="text-xs text-slate-400">{data.gmail.inboxZeroStatus}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-rose-400">{data.gmail.receivedCount}</div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Inbound Received</span>
          </div>
        </div>

        {/* Urgent Threads List */}
        <div className="space-y-2.5 mb-5">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>High-Priority Inquiries</span>
            <span className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {data.gmail.urgentThreads.length} Flagged
            </span>
          </div>
          <div className="space-y-2">
            {data.gmail.urgentThreads.map((thread, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white truncate">{thread.sender}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      thread.priority === 'high'
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                        : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                    }`}
                  >
                    {thread.priority}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-300 truncate mb-1">{thread.subject}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{thread.summary}</div>
                <div className="mt-2 text-[10px] text-rose-300 flex items-center gap-1 font-medium bg-rose-950/40 px-2 py-1 rounded-md border border-rose-900/30">
                  <CheckCircle2 className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Action: {thread.actionRequired}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase">Sent Responses</span>
            <div className="text-sm font-bold text-white mt-0.5">{data.gmail.sentCount} replies dispatched</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase">Fluff Filtered</span>
            <div className="text-sm font-bold text-white mt-0.5">{data.gmail.newsletterCount} newsletters triaged</div>
          </div>
        </div>
      </div>

      {/* 3. TIKTOK SIGNAL CARD */}
      <div className="relative group bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 group-hover:bg-cyan-500/15 transition-all" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">TikTok & Short Form</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {data.tiktok.videosWatched} swiped
                </span>
              </div>
              <p className="text-xs text-slate-400">Algorithmic intake & scroll rabbit holes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-cyan-400">{data.tiktok.screenTimeMinutes}m</div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Watch Time</span>
          </div>
        </div>

        {/* Rabbit hole spotlight */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 mb-4">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Dominant Rabbit Hole
            </span>
            <span className="text-[11px] font-mono text-slate-400">{data.tiktok.rabbitHoleTime}</span>
          </div>
          <div className="text-xs font-bold text-white mb-1">"{data.tiktok.rabbitHoleTheme}"</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.tiktok.topHashtags.map((tag, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Saved gems */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Saved Gems
            </span>
            <span className="text-[11px] text-slate-400">{data.tiktok.savedVideos.length} bookmarks</span>
          </div>
          <div className="space-y-1.5">
            {data.tiktok.savedVideos.slice(0, 2).map((vid, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-xs font-medium text-white truncate">{vid.caption}</div>
                  <div className="text-[10px] text-slate-400">{vid.creator}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono shrink-0">
                  {vid.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ratio bar */}
        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex justify-between text-[11px] font-semibold mb-1.5">
            <span className="text-pink-400">Pure Leisure ({data.tiktok.brainRotRatio}%)</span>
            <span className="text-emerald-400">Educational/Intel ({data.tiktok.learningRatio}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400" style={{ width: `${data.tiktok.brainRotRatio}%` }} />
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${data.tiktok.learningRatio}%` }} />
          </div>
        </div>
      </div>

      {/* 4. CALENDAR, HEALTH & DEVICE "EVERYTHING" CARD */}
      <div className="relative group bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 group-hover:bg-purple-500/15 transition-all" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Calendar & Biometrics</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {data.calendar.focusHours}h Deep Focus
                </span>
              </div>
              <p className="text-xs text-slate-400">Physical strain vs cognitive output</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-purple-400">{data.calendar.meetingsCount}</div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Meetings Sync</span>
          </div>
        </div>

        {/* Health Rings Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{data.health.steps.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400 uppercase">Steps Walked</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{data.health.activeCalories} kcal</div>
              <span className="text-[10px] text-slate-400 uppercase">Active Energy</span>
            </div>
          </div>
        </div>

        {/* Calendar Events Peek */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Synchronous Engagements</span>
            <span className="text-[11px] text-purple-400">{data.calendar.totalMeetingMinutes} min total</span>
          </div>
          <div className="space-y-1.5">
            {data.calendar.events.slice(0, 2).map((ev, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-900/40">
                    {ev.time}
                  </span>
                  <span className="font-semibold text-white truncate">{ev.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{ev.attendees} attendees</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Screen Time */}
        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Device Usage</span>
            <div className="font-bold text-white mt-0.5">{data.device.totalScreenTime} total screen time</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase">Pickups</span>
            <div className="font-bold text-purple-300 mt-0.5">{data.device.pickups} unlocks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

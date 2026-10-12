export interface SpotifySignal {
  minutesListened: number;
  topArtists: Array<{ name: string; genre: string; track: string }>;
  topTracks: Array<{ title: string; artist: string; timeOfDay: string; vibe: string }>;
  topGenre: string;
  energyProgression: Array<{ hour: string; energy: number; label: string }>;
  guiltyPleasure: string;
  audioMood: string;
}

export interface TikTokSignal {
  screenTimeMinutes: number;
  videosWatched: number;
  rabbitHoleTheme: string;
  rabbitHoleTime: string;
  savedVideos: Array<{ creator: string; caption: string; category: string }>;
  topHashtags: string[];
  brainRotRatio: number; // e.g. 70 (%)
  learningRatio: number;  // e.g. 30 (%)
}

export interface GmailSignal {
  receivedCount: number;
  sentCount: number;
  urgentThreads: Array<{
    sender: string;
    subject: string;
    summary: string;
    priority: 'high' | 'medium' | 'low';
    actionRequired: string;
  }>;
  newsletterCount: number;
  inboxZeroStatus: string;
  stressRating: 'Chill' | 'Moderate' | 'Spicy' | 'Code Red';
}

export interface CalendarSignal {
  meetingsCount: number;
  totalMeetingMinutes: number;
  events: Array<{ time: string; title: string; attendees: number; type: string }>;
  focusHours: number;
}

export interface HealthSignal {
  steps: number;
  activeCalories: number;
  sleepScore: number;
  waterGlasses: number;
}

export interface DeviceSignal {
  totalScreenTime: string;
  pickups: number;
  topApp: string;
}

export interface DayDataPayload {
  id: string;
  presetName: string;
  date: string;
  userPersonaName: string;
  spotify: SpotifySignal;
  tiktok: TikTokSignal;
  gmail: GmailSignal;
  calendar: CalendarSignal;
  health: HealthSignal;
  device: DeviceSignal;
  customNotes?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  category: 'spotify' | 'gmail' | 'tiktok' | 'calendar' | 'health';
  description: string;
  vibeBadge: string;
}

export interface DaySummaryResult {
  headline: string;
  dayScore: number;
  dayScoreTitle: string;
  vibeCategory: string;
  executiveSummary: string;
  timeline: TimelineItem[];
  personas: {
    podcaster: string;
    executive: string;
    roast: string;
    zen: string;
    detective: string;
  };
  keyWins: string[];
  actionItemsForTomorrow: string[];
  musicAnalysis: string;
  scrollAnalysis: string;
  digitalBalanceScore: {
    focusVsDistraction: number;
    mentalEnergy: number;
    movementScore: number;
    verdict: string;
  };
  tomorrowForecast: string;
  generatedAt: string;
}

export type SummaryPersonaKey = 'podcaster' | 'executive' | 'roast' | 'zen' | 'detective';

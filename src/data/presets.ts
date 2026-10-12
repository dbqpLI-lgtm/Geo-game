import { DayDataPayload } from '../types';

export const PRESETS: DayDataPayload[] = [
  {
    id: 'tech-hustle',
    presetName: 'Startup Crunch & Code Day',
    date: 'Today',
    userPersonaName: 'Alex Rivers',
    spotify: {
      minutesListened: 218,
      topArtists: [
        { name: 'Fred again..', genre: 'Electronic Dance', track: 'adore u' },
        { name: 'Overmono', genre: 'UK Garage', track: 'Good Lies' },
        { name: 'Max Richter', genre: 'Modern Classical', track: 'On the Nature of Daylight' },
        { name: 'Peggy Gou', genre: 'House', track: '(It Goes Like) Nanana' }
      ],
      topTracks: [
        { title: 'adore u', artist: 'Fred again..', timeOfDay: '09:15 AM', vibe: 'Caffeinated Focus' },
        { title: 'Good Lies', artist: 'Overmono', timeOfDay: '02:40 PM', vibe: 'Sprint Energy' },
        { title: 'On the Nature of Daylight', artist: 'Max Richter', timeOfDay: '08:20 PM', vibe: 'Late Deep Work' },
        { title: 'Midnight City', artist: 'M83', timeOfDay: '11:10 PM', vibe: 'Night Drive Euphoria' }
      ],
      topGenre: 'Progressive Electronic / Lo-Fi Beats',
      energyProgression: [
        { hour: '8 AM', energy: 75, label: 'Morning Kickoff' },
        { hour: '11 AM', energy: 90, label: 'Feature Sprint' },
        { hour: '2 PM', energy: 65, label: 'Post-Lunch Slump' },
        { hour: '5 PM', energy: 85, label: 'Release Push' },
        { hour: '9 PM', energy: 40, label: 'Ambient Unwind' }
      ],
      guiltyPleasure: 'Listening to 2012 Club Hits remix while writing SQL queries',
      audioMood: 'Hypnotic electronic focus gradually resolving into atmospheric neo-classical'
    },
    tiktok: {
      screenTimeMinutes: 68,
      videosWatched: 124,
      rabbitHoleTheme: 'Japanese convenience store food reviews & bespoke mechanical keyboard switches',
      rabbitHoleTime: '11:35 PM (32 mins non-stop)',
      savedVideos: [
        { creator: '@devtips_daily', caption: '3 CSS tricks senior engineers hide from you', category: 'Coding' },
        { creator: '@tokyo_eats', caption: '7-Eleven egg salad sandwich tier list', category: 'Food' },
        { creator: '@desksetupguy', caption: 'Clean minimal desk lighting hack for under $20', category: 'Lifestyle' }
      ],
      topHashtags: ['#techtok', '#japanesefood', '#desksetup', '#productivityhacks', '#comedy'],
      brainRotRatio: 58,
      learningRatio: 42
    },
    gmail: {
      receivedCount: 54,
      sentCount: 16,
      urgentThreads: [
        {
          sender: 'Sarah Lin (VP Product)',
          subject: 'URGENT: Q4 Roadmap Sign-off needed before tomorrow 9 AM',
          summary: 'Needs confirmation on sprint deliverables and budget approval for cloud credits.',
          priority: 'high',
          actionRequired: 'Review draft deck and send approval email.'
        },
        {
          sender: 'DevOps Automated Alerts',
          subject: '[RESOLVED] Latency spike in US-East-1 cluster',
          summary: 'Spike subsided after autoscaling triggered. Post-mortem scheduled for Wednesday.',
          priority: 'medium',
          actionRequired: 'Read incident notes before sprint retro.'
        },
        {
          sender: 'Stripe Billing',
          subject: 'Receipt for Enterprise Subscription ($249.00)',
          summary: 'Monthly charge completed successfully.',
          priority: 'low',
          actionRequired: 'Forward to expensify.'
        }
      ],
      newsletterCount: 18,
      inboxZeroStatus: '5 unread remaining (Close to Inbox Zero!)',
      stressRating: 'Spicy'
    },
    calendar: {
      meetingsCount: 4,
      totalMeetingMinutes: 195,
      events: [
        [
          { time: '09:30 AM', title: 'Daily Engineering Standup', attendees: 8, type: 'Sync' },
          { time: '11:00 AM', title: 'Architecture Review: Vector Search', attendees: 4, type: 'Technical' },
          { time: '02:00 PM', title: 'Customer Feedback Debrief', attendees: 6, type: 'Product' },
          { time: '04:30 PM', title: '1-on-1 with Engineering Lead', attendees: 2, type: 'Mentorship' }
        ]
      ][0],
      focusHours: 3.5
    },
    health: {
      steps: 8420,
      activeCalories: 510,
      sleepScore: 78,
      waterGlasses: 6
    },
    device: {
      totalScreenTime: '6h 42m',
      pickups: 74,
      topApp: 'Gmail & Slack (2h 15m), Spotify (Background 3h), TikTok (1h 08m)'
    },
    customNotes: 'High velocity day with a fast turnaround on production hotfix. Felt accomplished by 7 PM but got trapped in a TikTok rabbit hole before sleep.'
  },
  {
    id: 'chill-sunday',
    presetName: 'Cozy Reset Sunday',
    date: 'Yesterday',
    userPersonaName: 'Jordan Vance',
    spotify: {
      minutesListened: 165,
      topArtists: [
        { name: 'Leon Bridges', genre: 'Retro Soul', track: 'Texas Sun' },
        { name: 'Norah Jones', genre: 'Jazz / Folk', track: 'Come Away With Me' },
        { name: 'Khruangbin', genre: 'Psychedelic Funk', track: 'Texas Sun' },
        { name: 'Lofi Girl', genre: 'Chillhop', track: 'Morning Coffee' }
      ],
      topTracks: [
        { title: 'Texas Sun', artist: 'Khruangbin & Leon Bridges', timeOfDay: '10:00 AM', vibe: 'Sunny Balcony Coffee' },
        { title: 'So Easy', artist: 'Royksopp', timeOfDay: '01:30 PM', vibe: 'Slow Sunday Reading' },
        { title: 'Mystery of Love', artist: 'Sufjan Stevens', timeOfDay: '06:15 PM', vibe: 'Sunset Melancholy' }
      ],
      topGenre: 'Warm Acoustic & Lo-Fi Soul',
      energyProgression: [
        { hour: '9 AM', energy: 35, label: 'Pancake Morning' },
        { hour: '1 PM', energy: 45, label: 'Farmers Market' },
        { hour: '4 PM', energy: 30, label: 'Reading Nap' },
        { hour: '8 PM', energy: 25, label: 'Candlelight Dinner' }
      ],
      guiltyPleasure: 'Listening to 1950s Parisian cafe jazz for 3 hours straight',
      audioMood: 'Warm analog warmth and gentle brass grooves with zero anxiety'
    },
    tiktok: {
      screenTimeMinutes: 94,
      videosWatched: 180,
      rabbitHoleTheme: 'Sourdough starter feeding techniques and cozy cabin renovations in Norway',
      rabbitHoleTime: '03:15 PM (45 mins lounging on the couch)',
      savedVideos: [
        { creator: '@norwaycabin', caption: 'Building a sauna overlooking the snowy fjord', category: 'Architecture' },
        { creator: '@baker_ben', caption: 'Why your sourdough crust isn’t blistering properly', category: 'Cooking' },
        { creator: '@goldenretrievers', caption: 'Otis reacting to rain for the first time', category: 'Pets' }
      ],
      topHashtags: ['#sourdough', '#cozyaesthetic', '#cabinlife', '#goldenretriever', '#sundayreset'],
      brainRotRatio: 30,
      learningRatio: 70
    },
    gmail: {
      receivedCount: 14,
      sentCount: 1,
      urgentThreads: [
        {
          sender: 'The New Yorker Weekly',
          subject: 'Sunday Long Reads: The Architecture of Silence',
          summary: 'Feature article on acoustic design in modern cities.',
          priority: 'low',
          actionRequired: 'Saved to reading pocket.'
        },
        {
          sender: 'Airbnb Customer Support',
          subject: 'Your weekend trip to Big Sur is confirmed!',
          summary: 'Check-in instructions and gate code for next Friday.',
          priority: 'medium',
          actionRequired: 'Add gate code to Apple Wallet.'
        }
      ],
      newsletterCount: 11,
      inboxZeroStatus: 'Completely ignored (It is Sunday!)',
      stressRating: 'Chill'
    },
    calendar: {
      meetingsCount: 0,
      totalMeetingMinutes: 0,
      events: [
        { time: '11:00 AM', title: 'Neighborhood Farmers Market', attendees: 2, type: 'Personal' },
        { time: '05:00 PM', title: 'Meal Prep & Sunday Roast', attendees: 1, type: 'Wellness' }
      ],
      focusHours: 0
    },
    health: {
      steps: 11240,
      activeCalories: 620,
      sleepScore: 92,
      waterGlasses: 8
    },
    device: {
      totalScreenTime: '3h 48m',
      pickups: 38,
      topApp: 'Spotify (2h 45m), TikTok (1h 34m), Kindle (45m)'
    },
    customNotes: 'Soul rejuvenating day. Recharged social battery, cooked pasta from scratch, long walk in the crisp afternoon air.'
  },
  {
    id: 'finals-crunch',
    presetName: 'College Student Finals Grind',
    date: 'Today',
    userPersonaName: 'Maya Chen',
    spotify: {
      minutesListened: 340,
      topArtists: [
        { name: 'Ludovico Einaudi', genre: 'Neoclassical', track: 'Nuvole Bianche' },
        { name: 'Hans Zimmer', genre: 'Cinematic Score', track: 'Time' },
        { name: 'Chappell Roan', genre: 'Pop', track: 'Good Luck, Babe!' },
        { name: 'C418', genre: 'Ambient Game Score', track: 'Sweden' }
      ],
      topTracks: [
        { title: 'Time (Inception)', artist: 'Hans Zimmer', timeOfDay: '02:00 AM', vibe: 'Panic Mode Study' },
        { title: 'Good Luck, Babe!', artist: 'Chappell Roan', timeOfDay: '08:30 AM', vibe: 'Pre-Exam Hype' },
        { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', timeOfDay: '01:15 PM', vibe: 'Library Silence' }
      ],
      topGenre: 'Study Classical & Adrenaline Pop',
      energyProgression: [
        { hour: '2 AM', energy: 80, label: 'Late Cramming' },
        { hour: '8 AM', energy: 95, label: 'Exam 1 Pressure' },
        { hour: '1 PM', energy: 30, label: 'Brain Fried' },
        { hour: '7 PM', energy: 88, label: 'Second Wind Cramming' }
      ],
      guiltyPleasure: 'Listening to Minecraft soundtrack on repeat for 4 consecutive hours',
      audioMood: 'Oscillating between desperate Hans Zimmer brass and high-tempo pop relief'
    },
    tiktok: {
      screenTimeMinutes: 110,
      videosWatched: 240,
      rabbitHoleTheme: 'Study motivation pomodoro timers, college exam memes, and iced matcha recipes',
      rabbitHoleTime: '04:00 PM (Procrastination spiral)',
      savedVideos: [
        { creator: '@biochem_god', caption: 'How to memorize the Krebs cycle in 60 seconds', category: 'Study' },
        { creator: '@studentstruggles', caption: 'Me walking into the exam hall knowing only 2 formulas', category: 'Humor' },
        { creator: '@caffeinequeen', caption: 'Espresso tonic recipe for all-nighters', category: 'Food' }
      ],
      topHashtags: ['#finalsweek', '#collegelife', '#studytok', '#allnighter', '#kreobscycle'],
      brainRotRatio: 75,
      learningRatio: 25
    },
    gmail: {
      receivedCount: 38,
      sentCount: 5,
      urgentThreads: [
        {
          sender: 'Prof. Harrison (Organic Chemistry)',
          subject: 'Exam Room Assignment & Formula Sheet Clarification',
          summary: 'Calculator models strictly inspected at door. Room changed to Science Hall 304.',
          priority: 'high',
          actionRequired: 'Double check calculator batteries and print formula sheet.'
        },
        {
          sender: 'Campus Financial Aid',
          subject: 'Spring Semester Disbursement Confirmation',
          summary: 'Financial aid posted to student account.',
          priority: 'medium',
          actionRequired: 'Verify zero balance on portal.'
        }
      ],
      newsletterCount: 14,
      inboxZeroStatus: '12 unread academic announcements',
      stressRating: 'Code Red'
    },
    calendar: {
      meetingsCount: 2,
      totalMeetingMinutes: 180,
      events: [
        { time: '09:00 AM', title: 'Organic Chemistry Midterm / Final', attendees: 120, type: 'Exam' },
        { time: '03:00 PM', title: 'Biology Study Group (Library 4th floor)', attendees: 5, type: 'Study Group' }
      ],
      focusHours: 6.0
    },
    health: {
      steps: 4320,
      activeCalories: 280,
      sleepScore: 48,
      waterGlasses: 3
    },
    device: {
      totalScreenTime: '7h 12m',
      pickups: 104,
      topApp: 'Notion & Anki (3h 30m), TikTok (1h 50m), Spotify (5h background)'
    },
    customNotes: 'Survived Chemistry Exam 1! Pure mental endurance. Need to sleep tonight or tomorrow will be impossible.'
  },
  {
    id: 'creative-freelancer',
    presetName: 'Creative Freelancer Design Sprint',
    date: 'Today',
    userPersonaName: 'Leo Sterling',
    spotify: {
      minutesListened: 195,
      topArtists: [
        { name: 'Kaytranada', genre: 'Electronic Soul', track: '10%' },
        { name: 'Tame Impala', genre: 'Psychedelic Rock', track: 'Borderline' },
        { name: 'Sampha', genre: 'Neo Soul', track: 'Spirit 2.0' },
        { name: 'Four Tet', genre: 'Microhouse', track: 'Two Thousand and Seventeen' }
      ],
      topTracks: [
        { title: '10%', artist: 'Kaytranada', timeOfDay: '10:15 AM', vibe: 'Design Groove' },
        { title: 'Borderline', artist: 'Tame Impala', timeOfDay: '03:30 PM', vibe: 'Figma Flow State' },
        { title: 'Two Thousand and Seventeen', artist: 'Four Tet', timeOfDay: '07:45 PM', vibe: 'Rendering & Export' }
      ],
      topGenre: 'Bouncy Neo-Soul & Electronic Beats',
      energyProgression: [
        { hour: '10 AM', energy: 70, label: 'Moodboarding' },
        { hour: '2 PM', energy: 85, label: 'Brand Identity Concept' },
        { hour: '6 PM', energy: 60, label: 'Client Pitch Deck' },
        { hour: '10 PM', energy: 45, label: 'Chilling' }
      ],
      guiltyPleasure: 'Listening to 90s French Touch house while testing color palettes',
      audioMood: 'Groovy, buoyant, and deeply visual auditory landscapes'
    },
    tiktok: {
      screenTimeMinutes: 52,
      videosWatched: 96,
      rabbitHoleTheme: 'Vintage 35mm film cameras and brutalist architecture in Berlin',
      rabbitHoleTime: '01:20 PM (Quick lunch break scroll)',
      savedVideos: [
        { creator: '@design_critique', caption: 'Why serif fonts are making a massive comeback', category: 'Typography' },
        { creator: '@berlin_spaces', caption: 'Touring an old power plant turned techno exhibition', category: 'Architecture' }
      ],
      topHashtags: ['#designinspiration', '#figmatips', '#graphicdesign', '#35mmfilm'],
      brainRotRatio: 40,
      learningRatio: 60
    },
    gmail: {
      receivedCount: 29,
      sentCount: 11,
      urgentThreads: [
        {
          sender: 'Elena Rostova (Client - Brand Studio)',
          subject: 'Feedback on Logo Iteration v3 + Invoice Question',
          summary: 'Loves Option B! Requests the vector files in dark and light versions. Wire transfer sent.',
          priority: 'high',
          actionRequired: 'Deliver export package and confirm payment receipt.'
        },
        {
          sender: 'Squarespace Domains',
          subject: 'Renewal notice for studio-sterling.design',
          summary: 'Domain set to auto-renew on Nov 1st.',
          priority: 'low',
          actionRequired: 'None.'
        }
      ],
      newsletterCount: 15,
      inboxZeroStatus: 'All client emails answered within 2 hours',
      stressRating: 'Moderate'
    },
    calendar: {
      meetingsCount: 2,
      totalMeetingMinutes: 75,
      events: [
        { time: '11:00 AM', title: 'Client Concept Presentation (Google Meet)', attendees: 3, type: 'Pitch' },
        { time: '04:00 PM', title: 'Creative Feedback & Design Handoff', attendees: 2, type: 'Review' }
      ],
      focusHours: 5.5
    },
    health: {
      steps: 9100,
      activeCalories: 490,
      sleepScore: 84,
      waterGlasses: 7
    },
    device: {
      totalScreenTime: '5h 15m',
      pickups: 52,
      topApp: 'Figma (Desktop 5h), Spotify (3h 15m), TikTok (52m)'
    },
    customNotes: 'Client greenlit the brand concept on the first round! Huge victory. Finished exports before dinner.'
  }
];

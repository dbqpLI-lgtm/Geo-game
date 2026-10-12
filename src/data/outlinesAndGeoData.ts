export interface CountryOutline {
  id: string;
  name: string;
  flag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint: string;
  options: string[];
  viewBox: string;
  svgPath: string; // SVG path data for the boundary outline
  funFact: string;
}

export interface GeoGuessrLocation {
  id: string;
  countryName: string;
  flagEmoji: string;
  locationName: string;
  cityOrRegion: string;
  continent: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  panoramicDescription: string;
  deductionClues: {
    drivingSide: 'Right' | 'Left';
    languageScript: string;
    landscapeAndBiome: string;
    infrastructureOrArchitecture: string;
    sunPosition: 'North (Southern Hemisphere)' | 'South (Northern Hemisphere)';
  };
  geographyFact: string;
}

// 1. RECOGNIZABLE COUNTRY OUTLINES / SILHOUETTES
export const COUNTRY_OUTLINES: CountryOutline[] = [
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    difficulty: 'Easy',
    hint: 'Famous boot-shaped peninsula jutting into the Mediterranean Sea with Sicily and Sardinia.',
    options: ['Italy', 'Greece', 'Spain', 'Croatia'],
    viewBox: '0 0 100 100',
    // Realistic simplified vector path of Italy's iconic boot & islands
    svgPath: 'M 35 15 C 38 14 45 15 50 20 C 53 23 55 28 53 33 C 51 38 55 42 60 48 C 65 54 70 60 76 63 C 81 65 83 67 80 70 C 76 72 70 68 66 69 C 63 71 67 75 70 78 C 73 80 70 83 64 82 C 58 81 56 75 57 71 C 58 67 52 64 48 60 C 44 56 42 50 40 45 C 38 40 35 34 33 27 C 31 22 32 17 35 15 Z M 48 83 C 50 81 54 83 55 86 C 54 89 48 91 44 89 C 43 86 46 84 48 83 Z M 25 45 C 27 45 28 52 26 58 C 24 63 21 64 20 59 C 20 52 22 46 25 45 Z',
    funFact: 'Italy’s boot shape has made it the most instantly recognized cartographic silhouette on Earth for centuries.'
  },
  {
    id: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    difficulty: 'Easy',
    hint: 'Extremely long and narrow ribbon extending 4,300 km along the Pacific coast.',
    options: ['Chile', 'Norway', 'Argentina', 'Peru'],
    viewBox: '0 0 100 100',
    svgPath: 'M 60 5 C 62 12 60 20 58 28 C 56 36 54 44 52 52 C 50 60 48 68 46 76 C 44 82 42 88 40 95 C 38 96 36 94 38 90 C 40 82 43 74 45 66 C 47 58 49 50 51 42 C 53 34 55 26 57 18 C 58 12 58 7 60 5 Z',
    funFact: 'Chile averages only 175 kilometers wide, yet stretches over 4,300 km north to south!'
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    difficulty: 'Easy',
    hint: 'Famous hexagonal silhouette bordering the Atlantic, English Channel, and Mediterranean.',
    options: ['France', 'Germany', 'Spain', 'Poland'],
    viewBox: '0 0 100 100',
    svgPath: 'M 45 10 C 55 12 65 18 72 26 C 75 32 78 40 76 48 C 73 56 70 65 65 72 C 58 78 50 82 42 80 C 35 77 28 72 24 65 C 18 55 20 42 22 32 C 26 22 34 14 45 10 Z',
    funFact: 'In French culture, the country is officially nicknamed "L’Hexagone" due to its 6-sided geometric perimeter.'
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    difficulty: 'Medium',
    hint: 'Crescent-shaped archipelago consisting of Hokkaido, Honshu, Shikoku, and Kyushu.',
    options: ['Japan', 'Philippines', 'Indonesia', 'New Zealand'],
    viewBox: '0 0 100 100',
    svgPath: 'M 75 12 C 78 15 82 22 79 26 C 75 28 70 24 68 20 C 68 15 72 11 75 12 Z M 65 30 C 68 34 72 40 68 46 C 64 52 58 58 50 64 C 44 68 38 72 32 75 C 28 76 25 74 28 71 C 34 67 42 62 48 56 C 54 50 58 42 61 36 C 63 32 63 29 65 30 Z M 34 77 C 36 78 38 82 35 85 C 32 87 28 85 29 80 C 30 77 32 76 34 77 Z M 22 79 C 25 81 26 86 24 90 C 21 92 18 89 19 84 C 20 80 21 78 22 79 Z',
    funFact: 'Japan’s curved island arc sits directly on top of the Pacific Ring of Fire where 4 tectonic plates converge.'
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    difficulty: 'Easy',
    hint: 'Massive island continent with the Gulf of Carpentaria in the north and Tasmania to the south.',
    options: ['Australia', 'Greenland', 'Brazil', 'South Africa'],
    viewBox: '0 0 100 100',
    svgPath: 'M 30 18 C 36 20 40 24 45 20 C 48 16 52 14 55 18 C 58 22 55 28 58 32 C 65 30 72 35 78 40 C 82 45 84 52 82 58 C 78 65 72 70 65 74 C 55 78 45 76 35 77 C 28 76 22 72 18 66 C 14 58 15 48 18 40 C 20 32 24 24 30 18 Z M 68 85 C 70 84 73 86 74 89 C 72 92 68 93 66 90 C 65 87 67 85 68 85 Z',
    funFact: 'Australia is the only nation on Earth that governs an entire continent single-handedly.'
  },
  {
    id: 'united_kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    difficulty: 'Medium',
    hint: 'Comprises Great Britain island (England, Scotland, Wales) and the northeastern portion of Ireland.',
    options: ['United Kingdom', 'Ireland', 'Iceland', 'Madagascar'],
    viewBox: '0 0 100 100',
    svgPath: 'M 48 15 C 52 18 54 24 50 30 C 46 35 48 40 52 46 C 56 52 60 58 64 64 C 68 70 62 76 56 78 C 48 80 42 75 38 70 C 34 64 36 56 38 48 C 40 40 42 32 44 24 C 45 18 46 14 48 15 Z M 28 42 C 32 44 33 49 30 54 C 27 58 23 56 24 51 C 24 46 26 43 28 42 Z',
    funFact: 'Great Britain is the ninth-largest island in the world and the largest island in Europe.'
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    flag: '🇲🇬',
    difficulty: 'Medium',
    hint: 'Huge elongated island off the southeast coast of mainland Africa in the Indian Ocean.',
    options: ['Madagascar', 'Sri Lanka', 'Cuba', 'Taiwan'],
    viewBox: '0 0 100 100',
    svgPath: 'M 62 15 C 65 22 62 32 58 42 C 54 52 48 62 42 72 C 38 78 34 84 30 88 C 27 88 28 82 30 76 C 34 66 38 56 44 46 C 48 36 54 26 58 18 C 60 14 61 12 62 15 Z',
    funFact: 'Madagascar separated from the Indian subcontinent over 88 million years ago, allowing 90% of its wildlife to evolve nowhere else.'
  },
  {
    id: 'south_africa',
    name: 'South Africa',
    flag: '🇿🇦',
    difficulty: 'Medium',
    hint: 'Occupies the southern tip of Africa, encircling the landlocked enclave nation of Lesotho.',
    options: ['South Africa', 'Namibia', 'Angola', 'Argentina'],
    viewBox: '0 0 100 100',
    svgPath: 'M 30 20 C 42 18 56 18 68 24 C 76 28 82 36 84 46 C 85 58 80 68 74 76 C 66 84 54 88 44 86 C 32 84 22 76 18 64 C 14 52 16 38 22 28 C 25 24 28 21 30 20 Z M 56 50 C 60 50 62 55 60 59 C 58 63 53 62 52 57 C 52 52 54 50 56 50 Z',
    funFact: 'The hole in the eastern section of South Africa’s outline is the independent sovereign Kingdom of Lesotho!'
  },
  {
    id: 'norway',
    name: 'Norway',
    flag: '🇳🇴',
    difficulty: 'Medium',
    hint: 'Stretching arch of jagged Atlantic fjords that loops over Sweden in the far north.',
    options: ['Norway', 'Sweden', 'Finland', 'Vietnam'],
    viewBox: '0 0 100 100',
    svgPath: 'M 78 8 C 84 10 88 15 82 18 C 74 20 68 22 62 26 C 56 30 52 38 48 46 C 44 54 42 62 38 70 C 34 78 30 84 25 86 C 22 86 20 82 22 78 C 26 70 30 62 34 54 C 38 46 44 36 50 28 C 58 20 68 12 78 8 Z',
    funFact: 'If Norway’s rugged coastline and fjords were stretched into a straight line, it would circle halfway around the globe.'
  },
  {
    id: 'greece',
    name: 'Greece',
    flag: '🇬🇷',
    difficulty: 'Medium',
    hint: 'Mountainous Balkan peninsula with the Peloponnese and hundreds of Aegean islands.',
    options: ['Greece', 'Turkey', 'Italy', 'Croatia'],
    viewBox: '0 0 100 100',
    svgPath: 'M 32 15 C 44 14 56 16 64 22 C 60 28 54 34 52 42 C 50 48 54 52 58 56 C 52 62 44 68 38 72 C 34 76 30 80 26 78 C 24 74 26 68 30 62 C 34 56 32 48 30 40 C 28 32 28 22 32 15 Z M 65 60 C 67 60 68 64 66 66 C 64 68 62 66 62 63 C 62 61 64 60 65 60 Z M 72 45 C 74 46 75 50 73 52 C 71 53 69 51 70 48 C 70 46 71 45 72 45 Z M 48 88 C 58 87 68 88 74 90 C 72 93 64 94 54 93 C 46 92 44 89 48 88 Z',
    funFact: 'Greece contains over 6,000 islands and islets scattered across the Aegean and Ionian Seas.'
  },
  {
    id: 'egypt',
    name: 'Egypt',
    flag: '🇪🇬',
    difficulty: 'Easy',
    hint: 'Distinctive rectangular desert silhouette in northeast Africa with the Sinai Peninsula triangle in the northeast.',
    options: ['Egypt', 'Libya', 'Sudan', 'Saudi Arabia'],
    viewBox: '0 0 100 100',
    svgPath: 'M 20 20 L 75 20 L 80 32 L 88 30 L 82 45 L 75 42 L 75 80 L 20 80 Z',
    funFact: 'Egypt’s borders are unusually geometric, drawn across straight meridians and parallels in the Sahara Desert.'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    difficulty: 'Easy',
    hint: 'Enormous triangular landmass dominating South America with extensive Atlantic coastline.',
    options: ['Brazil', 'Argentina', 'Colombia', 'Peru'],
    viewBox: '0 0 100 100',
    svgPath: 'M 25 22 C 38 18 52 20 64 24 C 74 28 84 34 88 42 C 86 52 82 62 76 72 C 68 80 58 85 48 82 C 40 78 34 70 30 60 C 24 50 20 40 22 30 C 23 26 24 23 25 22 Z',
    funFact: 'Brazil is so large that it borders every single country in South America except Chile and Ecuador.'
  }
];

// 2. GEOGUESSR PANORAMIC WORLD LOCATIONS
export const GEOGUESSR_LOCATIONS: GeoGuessrLocation[] = [
  {
    id: 'tokyo-shibuya',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    locationName: 'Shibuya Crossing & Dogenzaka',
    cityOrRegion: 'Tokyo, Honshu',
    continent: 'Asia',
    latitude: 35.6595,
    longitude: 139.7004,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Vibrant urban intersection framed by glowing neon commercial billboards, tidy asphalt streets, vending machines on sidewalk corners, and dense pedestrian crossings.',
    deductionClues: {
      drivingSide: 'Left',
      languageScript: 'Japanese (Kanji, Hiragana, Katakana combined with Latin romaji)',
      landscapeAndBiome: 'Ultra-dense modern metropolis, temperate urban plain',
      infrastructureOrArchitecture: 'Narrow compact vehicles (Kei cars), pristine road markings, distinctive yellow tactile sidewalk tiles for the visually impaired',
      sunPosition: 'South (Northern Hemisphere)'
    },
    geographyFact: 'Tokyo is the most populous metropolitan area on Earth, home to over 37 million residents.'
  },
  {
    id: 'norway-fjord',
    countryName: 'Norway',
    flagEmoji: '🇳🇴',
    locationName: 'Geirangerfjord Cliffside Road',
    cityOrRegion: 'Møre og Romsdal',
    continent: 'Europe',
    latitude: 62.1048,
    longitude: 7.2064,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Dramatic mountain road flanked by towering sheer granite cliffs, deep emerald seawater fjord below, cascading glacial waterfalls, and sod-roof wooden dwellings.',
    deductionClues: {
      drivingSide: 'Right',
      languageScript: 'Norwegian (Latin with letters Æ, Ø, Å)',
      landscapeAndBiome: 'Glacial fjord topography, alpine tundra, subarctic birch forest',
      infrastructureOrArchitecture: 'Characteristic white roadside bollards with vertical red reflectors; dashed outer road lines with no hard shoulder',
      sunPosition: 'South (Northern Hemisphere)'
    },
    geographyFact: 'Norway’s fjords were carved out during successive ice ages by massive glacial movement millions of years ago.'
  },
  {
    id: 'australia-outback',
    countryName: 'Australia',
    flagEmoji: '🇦🇺',
    locationName: 'Red Centre Stuart Highway',
    cityOrRegion: 'Northern Territory near Alice Springs',
    continent: 'Oceania',
    latitude: -23.6980,
    longitude: 133.8807,
    imageUrl: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Endless single-lane bitumen highway cutting through vivid ochre-red soil, sparse spinifex grass, scattered eucalyptus scrub, and an immense deep-blue horizon.',
    deductionClues: {
      drivingSide: 'Left',
      languageScript: 'English (Australian highway signage)',
      landscapeAndBiome: 'Arid Outback red desert with spinifex hummocks and mulga shrubland',
      infrastructureOrArchitecture: 'Bright red sandy shoulders, yellow kangaroo/camel warning diamond road signs, tall white guideposts with red reflectors on left, white on right',
      sunPosition: 'North (Southern Hemisphere)'
    },
    geographyFact: 'The Australian Outback occupies over 70% of the entire continent’s landmass.'
  },
  {
    id: 'iceland-ring-road',
    countryName: 'Iceland',
    flagEmoji: '🇮🇸',
    locationName: 'Route 1 Ring Road Volcanic Moss Plains',
    cityOrRegion: 'Eldhraun Lava Field, Southern Region',
    continent: 'Europe',
    latitude: 63.6749,
    longitude: -18.1524,
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Paved two-lane highway flanked by rolling fields of ancient black volcanic basalt completely blanketed in thick green woolly fringe moss, with snow-dusted volcano peaks in the distance and zero trees.',
    deductionClues: {
      drivingSide: 'Right',
      languageScript: 'Icelandic (Latin with letters Þ, Ð, Æ, Ö)',
      landscapeAndBiome: 'Treeless volcanic tundra, moss-covered basalt lava fields',
      infrastructureOrArchitecture: 'Bright yellow road marker posts at regular intervals; no roadside trees or telephone poles; black volcanic sand',
      sunPosition: 'South (Northern Hemisphere)'
    },
    geographyFact: 'Iceland has no native forests remaining; over 11% of the country is covered by glaciers and active volcanic lava fields.'
  },
  {
    id: 'brazil-rio',
    countryName: 'Brazil',
    flagEmoji: '🇧🇷',
    locationName: 'Copacabana Coastal Promenade & Sugarloaf',
    cityOrRegion: 'Rio de Janeiro',
    continent: 'South America',
    latitude: -22.9711,
    longitude: -43.1822,
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Famous black and white wave-patterned Portuguese stone mosaic boardwalk bordering tropical Atlantic waves, granite dome monolith peaks, and lush Mata Atlântica rainforest.',
    deductionClues: {
      drivingSide: 'Right',
      languageScript: 'Portuguese (e.g. "Rua", "Avenida", "Praia")',
      landscapeAndBiome: 'Tropical Atlantic rainforest coastal biome, dramatic coastal granite inselbergs',
      infrastructureOrArchitecture: 'Iconic wave mosaic sidewalk (Calçadão de Copacabana), black road tarmac, Mercosur blue-band license plates',
      sunPosition: 'North (Southern Hemisphere)'
    },
    geographyFact: 'Rio de Janeiro was once the official capital of the Kingdom of Portugal—the only European capital ever located outside of Europe.'
  },
  {
    id: 'namibia-dunes',
    countryName: 'Namibia',
    flagEmoji: '🇳🇦',
    locationName: 'Sossusvlei Desert Dunes Road',
    cityOrRegion: 'Namib-Naukluft National Park',
    continent: 'Africa',
    latitude: -24.7271,
    longitude: 15.3411,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Sun-baked desert trail cutting past towering 300-meter-tall rust-red sand dunes, stark white clay salt pans, and petrified dead camelthorn trees under a cloudless sky.',
    deductionClues: {
      drivingSide: 'Left',
      languageScript: 'English, Afrikaans, and German place names',
      landscapeAndBiome: 'Hyper-arid sand sea desert, among the oldest deserts on Earth',
      infrastructureOrArchitecture: 'Gravel salt-compacted desert highways, safari 4x4 vehicles with dual spare tires, yellow license plates with black numbers',
      sunPosition: 'North (Southern Hemisphere)'
    },
    geographyFact: 'The Namib Desert is widely considered the oldest desert in the world, having endured arid conditions for at least 55 million years.'
  },
  {
    id: 'greece-santorini',
    countryName: 'Greece',
    flagEmoji: '🇬🇷',
    locationName: 'Oia Village Caldera Path',
    cityOrRegion: 'Santorini, Cyclades Islands',
    continent: 'Europe',
    latitude: 36.4618,
    longitude: 25.3753,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Dazzling whitewashed cliffside cubic architecture, bright cobalt blue church domes, cobblestone pedestrian alleys, and dramatic vistas overlooking a sunken volcanic marine caldera.',
    deductionClues: {
      drivingSide: 'Right',
      languageScript: 'Greek (e.g. Ελληνικά script, bilingual road signs in Greek & Latin)',
      landscapeAndBiome: 'Mediterranean island scrub (Maquis), volcanic volcanic cliff edges',
      infrastructureOrArchitecture: 'Whitewashed Cycladic masonry with blue trim, narrow cobblestone footpaths, solar water heaters on flat rooftops',
      sunPosition: 'South (Northern Hemisphere)'
    },
    geographyFact: 'Santorini’s circular lagoon was created around 1600 BC by the Minoan eruption, one of the largest volcanic explosions in human history.'
  },
  {
    id: 'peru-andes',
    countryName: 'Peru',
    flagEmoji: '🇵🇪',
    locationName: 'Sacred Valley Mountain Pass',
    cityOrRegion: 'Cusco Region, Urubamba Valley',
    continent: 'South America',
    latitude: -13.2584,
    longitude: -72.0833,
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    panoramicDescription: 'Winding mountain dirt road carved into emerald green Andean terraced slopes, grazing llamas on steep switchbacks, and snow-capped cordillera peaks in the clouds.',
    deductionClues: {
      drivingSide: 'Right',
      languageScript: 'Spanish and Quechua bilingual placards',
      landscapeAndBiome: 'High-altitude Andean plateau (Puna grassland) and cloud forest valleys',
      infrastructureOrArchitecture: 'Hand-chiseled Incan stone agricultural terraces, adobe brick homes with clay-tile roofs, colorful woven textiles',
      sunPosition: 'North (Southern Hemisphere)'
    },
    geographyFact: 'The Andes is the longest continental mountain range on Earth, spanning seven South American nations.'
  }
];

// 3. EXPANSIVE COUNTRY NICKNAMES REPERTOIRE
export interface CountryNicknameItem {
  country: string;
  flag: string;
  nickname: string;
  options: string[];
  explanation: string;
}

export const COUNTRY_NICKNAMES_LIST: CountryNicknameItem[] = [
  {
    country: 'Japan',
    flag: '🇯🇵',
    nickname: 'Land of the Rising Sun',
    options: ['Japan', 'China', 'South Korea', 'Vietnam'],
    explanation: 'From China’s eastern perspective, the sun appeared to rise from the Japanese islands (Nihon / Nippon translates directly to "origin of the sun").'
  },
  {
    country: 'Italy',
    flag: '🇮🇹',
    nickname: 'The Boot (Lo Stivale)',
    options: ['Italy', 'Greece', 'Spain', 'Portugal'],
    explanation: 'The Apennine Peninsula looks remarkably like a high-heeled boot kicking the island of Sicily into the Mediterranean.'
  },
  {
    country: 'Ireland',
    flag: '🇮🇪',
    nickname: 'The Emerald Isle',
    options: ['Ireland', 'Scotland', 'Wales', 'Iceland'],
    explanation: 'Poet William Drennan coined the term in 1795 to celebrate Ireland’s lush, vivid green pastures fed by Atlantic rainfall.'
  },
  {
    country: 'South Africa',
    flag: '🇿🇦',
    nickname: 'The Rainbow Nation',
    options: ['South Africa', 'Brazil', 'Nigeria', 'India'],
    explanation: 'Archbishop Desmond Tutu coined "Rainbow Nation" in 1994 to encapsulate the country’s rich post-apartheid multicultural diversity.'
  },
  {
    country: 'Iceland',
    flag: '🇮🇸',
    nickname: 'Land of Fire and Ice',
    options: ['Iceland', 'Norway', 'Greenland', 'Chile'],
    explanation: 'Home to massive subglacial volcanoes, geothermal geysers, and Europe’s largest glaciers existing side by side.'
  },
  {
    country: 'Finland',
    flag: '🇫🇮',
    nickname: 'Land of a Thousand Lakes',
    options: ['Finland', 'Sweden', 'Canada', 'Estonia'],
    explanation: 'Finland actually contains approximately 188,000 lakes carved out by retreating Ice Age glaciers!'
  },
  {
    country: 'France',
    flag: '🇫🇷',
    nickname: 'The Hexagon (L’Hexagone)',
    options: ['France', 'Spain', 'Germany', 'Poland'],
    explanation: 'French schoolteachers and cartographers commonly refer to continental France as "L’Hexagone" due to its 6-sided perimeter.'
  },
  {
    country: 'Bhutan',
    flag: '🇧🇹',
    nickname: 'Land of the Thunder Dragon (Druk Yul)',
    options: ['Bhutan', 'Nepal', 'Tibet', 'Mongolia'],
    explanation: 'Fierce Himalayan mountain storms echoing through valleys were historically believed to be the roaring of dragons.'
  },
  {
    country: 'New Zealand',
    flag: '🇳🇿',
    nickname: 'Land of the Long White Cloud (Aotearoa)',
    options: ['New Zealand', 'Australia', 'Fiji', 'Samoa'],
    explanation: 'The traditional Māori name Aotearoa translates to "Land of the Long White Cloud," commemorating the cloud bank that guided early Polynesian navigators.'
  },
  {
    country: 'Norway',
    flag: '🇳🇴',
    nickname: 'Land of the Midnight Sun',
    options: ['Norway', 'Denmark', 'Russia', 'Sweden'],
    explanation: 'In northern regions above the Arctic Circle, the sun does not set below the horizon between late May and mid-July.'
  },
  {
    country: 'Thailand',
    flag: '🇹🇭',
    nickname: 'Land of Smiles',
    options: ['Thailand', 'Philippines', 'Vietnam', 'Indonesia'],
    explanation: 'Named for the welcoming warmth, hospitality, and cultural optimism of the Thai people.'
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    nickname: 'The Great White North',
    options: ['Canada', 'Russia', 'Alaska', 'Norway'],
    explanation: 'A popular affectionate moniker referring to Canada’s expansive, snow-blanketed northern wilderness.'
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    nickname: 'The Land Down Under',
    options: ['Australia', 'New Zealand', 'South Africa', 'Argentina'],
    explanation: 'Refers to Australia’s geographic position in the Southern Hemisphere, "under" the equator from a European cartographer’s worldview.'
  },
  {
    country: 'Philippines',
    flag: '🇵🇭',
    nickname: 'Pearl of the Orient Seas',
    options: ['Philippines', 'Sri Lanka', 'Malaysia', 'Singapore'],
    explanation: 'Popularized by national hero José Rizal in his patriotic poem "Mi Último Adiós."'
  },
  {
    country: 'Sri Lanka',
    flag: '🇱🇰',
    nickname: 'Teardrop of India',
    options: ['Sri Lanka', 'Maldives', 'Madagascar', 'Bangladesh'],
    explanation: 'Named for its unique pear-and-teardrop shape situated just off the southeastern tip of peninsular India.'
  },
  {
    country: 'Uruguay',
    flag: '🇺🇾',
    nickname: 'The Switzerland of South America',
    options: ['Uruguay', 'Chile', 'Costa Rica', 'Ecuador'],
    explanation: 'Earned during the 20th century due to its peaceful democratic stability, high standard of living, and robust banking sector.'
  }
];

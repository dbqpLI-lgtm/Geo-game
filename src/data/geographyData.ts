export interface CountryItem {
  name: string;
  code: string;
  flag: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania';
  capital: string;
  population: string;
  areaKm2: number;
  aliases: string[];
  neighbors: string[];
  flagColors: string[];
  flagLayoutDesc: string;
  funFact: string;
  nickname?: string;
}

export interface StateItem {
  name: string;
  capital: string;
  code?: string;
  nickname?: string;
  aliases?: string[];
}

export interface CountryDivisionData {
  countryName: string;
  flag: string;
  divisionTitle: string; // e.g. "50 States", "10 Provinces & 3 Territories"
  totalCount: number;
  items: StateItem[];
}

export interface FlagChallenge {
  id: string;
  countryName: string;
  flagEmoji: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredLayout: 'horizontal-3' | 'vertical-3' | 'horizontal-2' | 'nordic-cross' | 'center-circle' | 'canton-stripes' | 'horizontal-3-emblem' | 'vertical-3-emblem';
  colors: string[]; // Hex codes expected
  colorToleranceNames: string[]; // e.g. ["Blue", "White", "Red"]
  hasEmblem: boolean;
  emblemType?: 'none' | 'star' | 'circle' | 'cross' | 'sun' | 'leaf' | 'shield';
  description: string;
  hint: string;
}

export interface PhysicalGeoItem {
  name: string;
  category: 'Rivers' | 'Mountains & Peaks' | 'Deserts' | 'Oceans & Seas' | 'Straits & Canals' | 'Superlatives';
  record: string;
  locations: string;
  detail: string;
  quizQuestion: string;
  options: string[];
  correctIndex: number;
}

// 1. COMPREHENSIVE WORLD COUNTRIES (Over 100 major countries across all 6 continents)
export const WORLD_COUNTRIES: CountryItem[] = [
  // Europe
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    continent: 'Europe',
    capital: 'Paris',
    population: '68M',
    areaKm2: 551695,
    aliases: ['french republic', 'france'],
    neighbors: ['Spain', 'Belgium', 'Germany', 'Italy', 'Switzerland', 'Luxembourg', 'Monaco', 'Andorra'],
    flagColors: ['#002654', '#FFFFFF', '#ED2939'],
    flagLayoutDesc: 'Vertical tricolor of Blue, White, and Red',
    funFact: 'France covers 12 different time zones, the most of any country, due to overseas territories!'
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    continent: 'Europe',
    capital: 'Berlin',
    population: '84M',
    areaKm2: 357022,
    aliases: ['deutschland', 'germany'],
    neighbors: ['Denmark', 'Poland', 'Czechia', 'Austria', 'Switzerland', 'France', 'Luxembourg', 'Belgium', 'Netherlands'],
    flagColors: ['#000000', '#DD0000', '#FFCE00'],
    flagLayoutDesc: 'Horizontal tricolor of Black, Red, and Gold',
    funFact: 'Germany has 9 neighboring countries, sharing land borders with more nations than almost any other European state.'
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    continent: 'Europe',
    capital: 'Rome',
    population: '59M',
    areaKm2: 301340,
    aliases: ['italia', 'italy'],
    neighbors: ['France', 'Switzerland', 'Austria', 'Slovenia', 'San Marino', 'Vatican City'],
    flagColors: ['#008C45', '#F4F5F0', '#CD212A'],
    flagLayoutDesc: 'Vertical tricolor of Green, White, and Red (Il Tricolore)',
    funFact: 'Italy completely encircles two independent sovereign nations: San Marino and Vatican City.'
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    continent: 'Europe',
    capital: 'London',
    population: '67M',
    areaKm2: 242495,
    aliases: ['uk', 'britain', 'great britain', 'england'],
    neighbors: ['Ireland'],
    flagColors: ['#012169', '#FFFFFF', '#C8102E'],
    flagLayoutDesc: 'Union Jack combining the crosses of St George, St Andrew, and St Patrick',
    funFact: 'Nowhere in the UK is more than 113 km (70 miles) from the sea.'
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    continent: 'Europe',
    capital: 'Madrid',
    population: '47M',
    areaKm2: 505990,
    aliases: ['espana', 'spain'],
    neighbors: ['Portugal', 'France', 'Andorra', 'Gibraltar', 'Morocco'],
    flagColors: ['#AA151B', '#F1BF00'],
    flagLayoutDesc: 'Horizontal triband of Red, Yellow (double width), and Red with coat of arms',
    funFact: 'Spain shares a tiny land border in Africa with Morocco via the autonomous cities of Ceuta and Melilla.'
  },
  {
    name: 'Ukraine',
    code: 'UA',
    flag: '🇺🇦',
    continent: 'Europe',
    capital: 'Kyiv',
    population: '38M',
    areaKm2: 603628,
    aliases: ['ukraine'],
    neighbors: ['Poland', 'Slovakia', 'Hungary', 'Romania', 'Moldova', 'Belarus', 'Russia'],
    flagColors: ['#0057B7', '#FFD700'],
    flagLayoutDesc: 'Horizontal bicolor of Blue (sky) and Yellow (wheat fields)',
    funFact: 'Ukraine is the largest country entirely within the continent of Europe.'
  },
  {
    name: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    continent: 'Europe',
    capital: 'Stockholm',
    population: '10.5M',
    areaKm2: 450295,
    aliases: ['sverige', 'sweden'],
    neighbors: ['Norway', 'Finland'],
    flagColors: ['#006AA7', '#FECC00'],
    flagLayoutDesc: 'Nordic yellow cross on a blue field',
    funFact: 'Sweden has more islands than any other country in the world (over 267,000 islands)!'
  },
  {
    name: 'Norway',
    code: 'NO',
    flag: '🇳🇴',
    continent: 'Europe',
    capital: 'Oslo',
    population: '5.5M',
    areaKm2: 385207,
    aliases: ['norge', 'norway'],
    neighbors: ['Sweden', 'Finland', 'Russia'],
    flagColors: ['#BA0C2F', '#00205B', '#FFFFFF'],
    flagLayoutDesc: 'Indigo blue Nordic cross with white outline on red field',
    funFact: 'Norway’s coastline, if you include all fjords and islands, stretches over 100,000 kilometers.'
  },
  {
    name: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    continent: 'Europe',
    capital: 'Athens',
    population: '10.4M',
    areaKm2: 131957,
    aliases: ['hellas', 'greece'],
    neighbors: ['Albania', 'North Macedonia', 'Bulgaria', 'Turkey'],
    flagColors: ['#0D5EAF', '#FFFFFF'],
    flagLayoutDesc: '9 blue and white horizontal stripes with a blue canton bearing a white cross',
    funFact: 'Athens has been inhabited for over 3,400 years and is one of the oldest cities in the world.'
  },
  {
    name: 'Poland',
    code: 'PL',
    flag: '🇵🇱',
    continent: 'Europe',
    capital: 'Warsaw',
    population: '37.8M',
    areaKm2: 312696,
    aliases: ['polska', 'poland'],
    neighbors: ['Germany', 'Czechia', 'Slovakia', 'Ukraine', 'Belarus', 'Lithuania', 'Russia'],
    flagColors: ['#FFFFFF', '#DC143C'],
    flagLayoutDesc: 'Horizontal bicolor of White on top and Red on bottom',
    funFact: 'Poland is home to the world’s largest brick castle, Malbork Castle, built in the 13th century.'
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    continent: 'Europe',
    capital: 'Bern',
    population: '8.8M',
    areaKm2: 41285,
    aliases: ['swiss', 'switzerland', 'helvetia'],
    neighbors: ['France', 'Germany', 'Italy', 'Austria', 'Liechtenstein'],
    flagColors: ['#FF0000', '#FFFFFF'],
    flagLayoutDesc: 'Square red field with an equilateral white cross in the center',
    funFact: 'Along with Vatican City, Switzerland is one of only two sovereign states with a square national flag.'
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    continent: 'Europe',
    capital: 'Amsterdam',
    population: '17.8M',
    areaKm2: 41850,
    aliases: ['holland', 'netherlands'],
    neighbors: ['Belgium', 'Germany'],
    flagColors: ['#AE1C28', '#FFFFFF', '#21468B'],
    flagLayoutDesc: 'Horizontal tricolor of Red, White, and Blue',
    funFact: 'About 26% of the Netherlands lies below sea level, protected by a system of dikes and dunes.'
  },
  {
    name: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    continent: 'Europe',
    capital: 'Lisbon',
    population: '10.3M',
    areaKm2: 92212,
    aliases: ['portugal'],
    neighbors: ['Spain'],
    flagColors: ['#006600', '#FF0000', '#FFFF00'],
    flagLayoutDesc: 'Vertical green and red field with armillary sphere and national coat of arms',
    funFact: 'Lisbon is older than Rome by approximately four centuries.'
  },
  {
    name: 'Ireland',
    code: 'IE',
    flag: '🇮🇪',
    continent: 'Europe',
    capital: 'Dublin',
    population: '5.2M',
    areaKm2: 70273,
    aliases: ['eire', 'ireland', 'republic of ireland'],
    neighbors: ['United Kingdom'],
    flagColors: ['#169B62', '#FFFFFF', '#FF883E'],
    flagLayoutDesc: 'Vertical tricolor of Green, White, and Orange',
    funFact: 'Ireland is the only nation on Earth whose national symbol is a musical instrument (the Celtic Harp).'
  },

  // Asia
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    continent: 'Asia',
    capital: 'Tokyo',
    population: '124M',
    areaKm2: 377975,
    aliases: ['nippon', 'nihon', 'japan'],
    neighbors: [],
    flagColors: ['#FFFFFF', '#BC002D'],
    flagLayoutDesc: 'White rectangular field with a crimson red disc in the center (Hinomaru)',
    funFact: 'Japan is an archipelago of over 6,852 islands, with 4 main islands making up 97% of land.'
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    continent: 'Asia',
    capital: 'Beijing',
    population: '1.41B',
    areaKm2: 9596961,
    aliases: ['prc', 'china'],
    neighbors: ['Mongolia', 'Russia', 'North Korea', 'Vietnam', 'Laos', 'Myanmar', 'India', 'Bhutan', 'Nepal', 'Pakistan', 'Afghanistan', 'Tajikistan', 'Kyrgyzstan', 'Kazakhstan'],
    flagColors: ['#EE1C25', '#FFFF00'],
    flagLayoutDesc: 'Red field charged with five golden stars in the canton',
    funFact: 'China shares land borders with 14 different countries, tied with Russia for the world record.'
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    continent: 'Asia',
    capital: 'New Delhi',
    population: '1.43B',
    areaKm2: 3287263,
    aliases: ['bharat', 'india'],
    neighbors: ['Pakistan', 'China', 'Nepal', 'Bhutan', 'Bangladesh', 'Myanmar'],
    flagColors: ['#FF9933', '#FFFFFF', '#138808', '#000080'],
    flagLayoutDesc: 'Horizontal tricolor of Saffron, White, and Green with Ashoka Chakra navy wheel',
    funFact: 'India is the most populous country in the world and the largest democracy on Earth.'
  },
  {
    name: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    continent: 'Asia',
    capital: 'Seoul',
    population: '51.7M',
    areaKm2: 100210,
    aliases: ['korea', 'south korea', 'rok'],
    neighbors: ['North Korea'],
    flagColors: ['#FFFFFF', '#CD2E3A', '#0F64CD', '#000000'],
    flagLayoutDesc: 'White field with red/blue Taegeuk circle and four black trigrams in corners',
    funFact: 'Over half of South Korea’s total population lives inside the Greater Seoul Metropolitan Area.'
  },
  {
    name: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    continent: 'Asia',
    capital: 'Jakarta',
    population: '277M',
    areaKm2: 1904569,
    aliases: ['indonesia'],
    neighbors: ['Malaysia', 'Papua New Guinea', 'Timor-Leste'],
    flagColors: ['#FF0000', '#FFFFFF'],
    flagLayoutDesc: 'Horizontal bicolor of Red on top and White on bottom (identical ratio to Monaco)',
    funFact: 'Indonesia is the largest island country in the world, consisting of more than 17,500 islands.'
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    continent: 'Asia',
    capital: 'Riyadh',
    population: '36M',
    areaKm2: 2149690,
    aliases: ['saudi', 'saudi arabia', 'ksa'],
    neighbors: ['Jordan', 'Iraq', 'Kuwait', 'Qatar', 'Bahrain', 'UAE', 'Oman', 'Yemen'],
    flagColors: ['#006C35', '#FFFFFF'],
    flagLayoutDesc: 'Green field with Arabic Shahada calligraphy and a white sword pointing left',
    funFact: 'Saudi Arabia is the largest country in the world without a single permanent natural river.'
  },
  {
    name: 'Vietnam',
    code: 'VN',
    flag: '🇻🇳',
    continent: 'Asia',
    capital: 'Hanoi',
    population: '98M',
    areaKm2: 331212,
    aliases: ['vietnam', 'viet nam'],
    neighbors: ['China', 'Laos', 'Cambodia'],
    flagColors: ['#DA251D', '#FFFF00'],
    flagLayoutDesc: 'Red field with a large central yellow five-pointed star',
    funFact: 'Vietnam contains Son Doong, the world’s largest natural cave, capable of fitting a 40-story skyscraper.'
  },
  {
    name: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    continent: 'Asia',
    capital: 'Bangkok',
    population: '71M',
    areaKm2: 513120,
    aliases: ['siam', 'thailand'],
    neighbors: ['Myanmar', 'Laos', 'Cambodia', 'Malaysia'],
    flagColors: ['#A51931', '#F4F5F8', '#2D2A4A'],
    flagLayoutDesc: 'Five horizontal stripes: red, white, blue (double width), white, red',
    funFact: 'Thailand is the only Southeast Asian nation that was never colonized by European powers.'
  },
  {
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    continent: 'Asia',
    capital: 'Ankara',
    population: '85M',
    areaKm2: 783562,
    aliases: ['turkiye', 'turkey'],
    neighbors: ['Greece', 'Bulgaria', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', 'Iraq', 'Syria'],
    flagColors: ['#E30A17', '#FFFFFF'],
    flagLayoutDesc: 'Red field with white crescent moon and star positioned slightly left of center',
    funFact: 'Istanbul is the only metropolis in the world located across two continents (Europe and Asia).'
  },

  // Americas
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    continent: 'North America',
    capital: 'Washington, D.C.',
    population: '335M',
    areaKm2: 9833517,
    aliases: ['usa', 'us', 'america', 'united states of america'],
    neighbors: ['Canada', 'Mexico'],
    flagColors: ['#B22234', '#FFFFFF', '#3C3B6E'],
    flagLayoutDesc: '13 alternating red and white stripes with blue canton containing 50 white stars',
    funFact: 'The current 50-star US flag was designed in 1958 by Robert G. Heft as a high school history project.'
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    continent: 'North America',
    capital: 'Ottawa',
    population: '40M',
    areaKm2: 9984670,
    aliases: ['canada'],
    neighbors: ['United States'],
    flagColors: ['#FF0000', '#FFFFFF'],
    flagLayoutDesc: 'Red-white-red vertical triband with iconic 11-pointed red maple leaf in center',
    funFact: 'Canada has the world’s longest coastline, and Great Bear Lake is the largest lake located entirely within the country.'
  },
  {
    name: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    continent: 'North America',
    capital: 'Mexico City',
    population: '128M',
    areaKm2: 1964375,
    aliases: ['mexico'],
    neighbors: ['United States', 'Guatemala', 'Belize'],
    flagColors: ['#006847', '#FFFFFF', '#CE1126'],
    flagLayoutDesc: 'Vertical tricolor of Green, White, and Red with coat of arms (eagle on cactus eating serpent)',
    funFact: 'Mexico City was built on the ruins of the Aztec capital Tenochtitlan on top of an ancient lakebed.'
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    continent: 'South America',
    capital: 'Brasília',
    population: '216M',
    areaKm2: 8515767,
    aliases: ['brasil', 'brazil'],
    neighbors: ['Uruguay', 'Argentina', 'Paraguay', 'Bolivia', 'Peru', 'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'French Guiana'],
    flagColors: ['#009739', '#FEDD00', '#012169', '#FFFFFF'],
    flagLayoutDesc: 'Green field with yellow rhombus and blue celestial globe with 27 stars and banner',
    funFact: 'Brazil borders every country in South America except Ecuador and Chile.'
  },
  {
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    continent: 'South America',
    capital: 'Buenos Aires',
    population: '46M',
    areaKm2: 2780400,
    aliases: ['argentina'],
    neighbors: ['Chile', 'Bolivia', 'Paraguay', 'Brazil', 'Uruguay'],
    flagColors: ['#74ACDF', '#FFFFFF', '#F6B40E'],
    flagLayoutDesc: 'Horizontal triband of Light Blue, White, and Light Blue with Sun of May in center',
    funFact: 'Argentina is home to both the highest peak in the Western Hemisphere (Aconcagua, 6,961m) and the lowest point (Laguna del Carbón, -105m).'
  },
  {
    name: 'Colombia',
    code: 'CO',
    flag: '🇨🇴',
    continent: 'South America',
    capital: 'Bogotá',
    population: '52M',
    areaKm2: 1141748,
    aliases: ['colombia'],
    neighbors: ['Panama', 'Venezuela', 'Brazil', 'Peru', 'Ecuador'],
    flagColors: ['#FCD116', '#003893', '#CE1126'],
    flagLayoutDesc: 'Horizontal tricolor of Yellow (top half), Blue (one quarter), and Red (one quarter)',
    funFact: 'Colombia is the only nation in South America with coastlines on both the Pacific Ocean and Caribbean Sea.'
  },
  {
    name: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    continent: 'South America',
    capital: 'Santiago',
    population: '19.6M',
    areaKm2: 756102,
    aliases: ['chile'],
    neighbors: ['Peru', 'Bolivia', 'Argentina'],
    flagColors: ['#0039A6', '#FFFFFF', '#D52B1E'],
    flagLayoutDesc: 'White and red horizontal stripes with a blue square canton containing a white star',
    funFact: 'Chile is the longest north-to-south country in the world, spanning over 4,300 km while averaging only 175 km wide.'
  },

  // Africa
  {
    name: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    continent: 'Africa',
    capital: 'Cairo',
    population: '110M',
    areaKm2: 1002450,
    aliases: ['egypt'],
    neighbors: ['Libya', 'Sudan', 'Israel', 'Palestine'],
    flagColors: ['#CE1126', '#FFFFFF', '#000000', '#C09300'],
    flagLayoutDesc: 'Horizontal tricolor of Red, White, and Black with golden Eagle of Saladin in center',
    funFact: 'Egypt connects northeast Africa to southwest Asia via the Sinai Peninsula (a transcontinental country).'
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    continent: 'Africa',
    capital: 'Pretoria',
    population: '60M',
    areaKm2: 1221037,
    aliases: ['south africa', 'rsa'],
    neighbors: ['Namibia', 'Botswana', 'Zimbabwe', 'Mozambique', 'Eswatini', 'Lesotho'],
    flagColors: ['#007749', '#000000', '#FFB612', '#FFFFFF', '#DE3831', '#002395'],
    flagLayoutDesc: 'Horizontal Y-shape green band with chili red, blue, black triangle, gold and white borders',
    funFact: 'South Africa is the only nation in the world with three official capital cities: Pretoria (Executive), Cape Town (Legislative), and Bloemfontein (Judicial).'
  },
  {
    name: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    continent: 'Africa',
    capital: 'Abuja',
    population: '224M',
    areaKm2: 923768,
    aliases: ['nigeria'],
    neighbors: ['Benin', 'Niger', 'Chad', 'Cameroon'],
    flagColors: ['#008751', '#FFFFFF'],
    flagLayoutDesc: 'Vertical triband of Green, White, and Green',
    funFact: 'Nigeria is Africa’s most populous country, with over 500 indigenous languages spoken.'
  },
  {
    name: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    continent: 'Africa',
    capital: 'Nairobi',
    population: '54M',
    areaKm2: 580367,
    aliases: ['kenya'],
    neighbors: ['Ethiopia', 'Somalia', 'South Sudan', 'Uganda', 'Tanzania'],
    flagColors: ['#000000', '#BB0000', '#006600', '#FFFFFF'],
    flagLayoutDesc: 'Black, red, and green horizontal stripes with white fimbriations and Maasai shield with spears',
    funFact: 'Kenya is home to the Great Rift Valley, a colossal geographical trench visible from outer space.'
  },
  {
    name: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    continent: 'Africa',
    capital: 'Rabat',
    population: '37M',
    areaKm2: 446550,
    aliases: ['morocco'],
    neighbors: ['Algeria', 'Mauritania', 'Spain'],
    flagColors: ['#C1272D', '#006233'],
    flagLayoutDesc: 'Red field with a green pentagram star (Seal of Solomon) in the center',
    funFact: 'The University of al-Qarawiyyin in Fez, Morocco, founded in 859 AD, is recognized by UNESCO as the world’s oldest continuously operating university.'
  },

  // Oceania
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    continent: 'Oceania',
    capital: 'Canberra',
    population: '26.5M',
    areaKm2: 7692024,
    aliases: ['oz', 'australia'],
    neighbors: [],
    flagColors: ['#00008B', '#FFFFFF', '#FF0000'],
    flagLayoutDesc: 'Blue field with Union Jack in canton, large 7-pointed Commonwealth Star, and Southern Cross constellation',
    funFact: 'Australia is both the world’s smallest continent and the world’s 6th largest country by area.'
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    continent: 'Oceania',
    capital: 'Wellington',
    population: '5.2M',
    areaKm2: 268021,
    aliases: ['aotearoa', 'new zealand', 'nz'],
    neighbors: [],
    flagColors: ['#00247D', '#CC142B', '#FFFFFF'],
    flagLayoutDesc: 'Blue field with Union Jack in canton and four red stars representing the Southern Cross',
    funFact: 'Wellington is the southernmost sovereign capital city on Earth.',
    nickname: 'Land of the Long White Cloud (Aotearoa)'
  },

  // Additional European Nations
  {
    name: 'Austria',
    code: 'AT',
    flag: '🇦🇹',
    continent: 'Europe',
    capital: 'Vienna',
    population: '9.1M',
    areaKm2: 83879,
    aliases: ['osterreich', 'austria'],
    neighbors: ['Germany', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Italy', 'Switzerland', 'Liechtenstein'],
    flagColors: ['#ED2939', '#FFFFFF'],
    flagLayoutDesc: 'Horizontal triband of Red, White, and Red',
    funFact: 'Austria’s flag is one of the oldest in the world, dating back to Duke Leopold V in 1191.',
    nickname: 'Land of Music'
  },
  {
    name: 'Belgium',
    code: 'BE',
    flag: '🇧🇪',
    continent: 'Europe',
    capital: 'Brussels',
    population: '11.8M',
    areaKm2: 30528,
    aliases: ['belgique', 'belgie', 'belgium'],
    neighbors: ['France', 'Germany', 'Luxembourg', 'Netherlands'],
    flagColors: ['#000000', '#FDDA24', '#EF3340'],
    flagLayoutDesc: 'Vertical tricolor of Black, Yellow, and Red',
    funFact: 'Brussels is the de facto capital of the European Union and headquarters of NATO.',
    nickname: 'Battlefield of Europe'
  },
  {
    name: 'Denmark',
    code: 'DK',
    flag: '🇩🇰',
    continent: 'Europe',
    capital: 'Copenhagen',
    population: '5.9M',
    areaKm2: 43094,
    aliases: ['danmark', 'denmark'],
    neighbors: ['Germany'],
    flagColors: ['#C60C30', '#FFFFFF'],
    flagLayoutDesc: 'Dannebrog: white Scandinavian cross on red field',
    funFact: 'Denmark’s flag (Dannebrog) is the world’s oldest continuously used national flag (since 1219).',
    nickname: 'Land of the Vikings'
  },
  {
    name: 'Finland',
    code: 'FI',
    flag: '🇫🇮',
    continent: 'Europe',
    capital: 'Helsinki',
    population: '5.5M',
    areaKm2: 338424,
    aliases: ['suomi', 'finland'],
    neighbors: ['Sweden', 'Norway', 'Russia'],
    flagColors: ['#FFFFFF', '#002F6C'],
    flagLayoutDesc: 'Blue Nordic cross on white field',
    funFact: 'Finland has roughly 188,000 lakes and over 3 million saunas.',
    nickname: 'Land of a Thousand Lakes'
  },
  {
    name: 'Czechia',
    code: 'CZ',
    flag: '🇨🇿',
    continent: 'Europe',
    capital: 'Prague',
    population: '10.8M',
    areaKm2: 78866,
    aliases: ['czech republic', 'czechia'],
    neighbors: ['Germany', 'Poland', 'Slovakia', 'Austria'],
    flagColors: ['#FFFFFF', '#D7141A', '#11457E'],
    flagLayoutDesc: 'White over red horizontal bands with blue triangle at the hoist',
    funFact: 'Prague Castle is the largest coherent ancient castle complex in the world.',
    nickname: 'The Heart of Europe'
  },
  {
    name: 'Hungary',
    code: 'HU',
    flag: '🇭🇺',
    continent: 'Europe',
    capital: 'Budapest',
    population: '9.6M',
    areaKm2: 93028,
    aliases: ['magyarorszag', 'hungary'],
    neighbors: ['Austria', 'Slovakia', 'Ukraine', 'Romania', 'Serbia', 'Croatia', 'Slovenia'],
    flagColors: ['#CE2939', '#FFFFFF', '#477050'],
    flagLayoutDesc: 'Horizontal tricolor of Red, White, and Green',
    funFact: 'Budapest has the oldest electrified underground railway on continental Europe (Line 1).',
    nickname: 'Land of Thermal Springs'
  },
  {
    name: 'Croatia',
    code: 'HR',
    flag: '🇭🇷',
    continent: 'Europe',
    capital: 'Zagreb',
    population: '3.9M',
    areaKm2: 56594,
    aliases: ['hrvatska', 'croatia'],
    neighbors: ['Slovenia', 'Hungary', 'Serbia', 'Bosnia and Herzegovina', 'Montenegro'],
    flagColors: ['#FF0000', '#FFFFFF', '#0000FF'],
    flagLayoutDesc: 'Red, white, blue horizontal tricolor with checkerboard coat of arms',
    funFact: 'The Dalmatian dog breed originates from Croatia’s historical Dalmatia region.',
    nickname: 'Land of a Thousand Islands'
  },
  {
    name: 'Iceland',
    code: 'IS',
    flag: '🇮🇸',
    continent: 'Europe',
    capital: 'Reykjavik',
    population: '390K',
    areaKm2: 103000,
    aliases: ['island', 'iceland'],
    neighbors: [],
    flagColors: ['#02529C', '#DC1E35', '#FFFFFF'],
    flagLayoutDesc: 'Blue field with red cross edged in white',
    funFact: 'Iceland generates 100% of its electricity from renewable geothermal and hydro energy.',
    nickname: 'Land of Fire and Ice'
  },

  // Additional Asian Nations
  {
    name: 'Philippines',
    code: 'PH',
    flag: '🇵🇭',
    continent: 'Asia',
    capital: 'Manila',
    population: '115M',
    areaKm2: 300000,
    aliases: ['philippines', 'pilipinas'],
    neighbors: [],
    flagColors: ['#0038A8', '#CE1126', '#FFFFFF', '#FCD116'],
    flagLayoutDesc: 'Blue and red horizontal bands with white hoist triangle containing golden sun and 3 stars',
    funFact: 'The Philippines is composed of 7,641 islands in the western Pacific Ocean.',
    nickname: 'Pearl of the Orient Seas'
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    continent: 'Asia',
    capital: 'Singapore',
    population: '5.9M',
    areaKm2: 734,
    aliases: ['singapore'],
    neighbors: ['Malaysia'],
    flagColors: ['#ED2939', '#FFFFFF'],
    flagLayoutDesc: 'Red over white horizontal bicolor with white crescent and 5 stars in the canton',
    funFact: 'Singapore is an island city-state and one of only three sovereign city-states in the world.',
    nickname: 'The Lion City'
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    continent: 'Asia',
    capital: 'Kuala Lumpur',
    population: '34M',
    areaKm2: 330803,
    aliases: ['malaysia'],
    neighbors: ['Thailand', 'Indonesia', 'Brunei'],
    flagColors: ['#CC0000', '#FFFFFF', '#000066', '#FFCC00'],
    flagLayoutDesc: '14 red and white stripes with blue canton containing yellow crescent and 14-point star',
    funFact: 'Malaysia is home to Taman Negara, one of the oldest deciduous rainforests on Earth (130 million years old).',
    nickname: 'Truly Asia'
  },
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    continent: 'Asia',
    capital: 'Islamabad',
    population: '240M',
    areaKm2: 881913,
    aliases: ['pakistan'],
    neighbors: ['India', 'Afghanistan', 'Iran', 'China'],
    flagColors: ['#01411C', '#FFFFFF'],
    flagLayoutDesc: 'Dark green field with vertical white stripe at hoist and white crescent and star',
    funFact: 'Pakistan is home to K2 (8,611m), the second-highest mountain peak on Earth.',
    nickname: 'Land of the Pure'
  },
  {
    name: 'Nepal',
    code: 'NP',
    flag: '🇳🇵',
    continent: 'Asia',
    capital: 'Kathmandu',
    population: '30M',
    areaKm2: 147516,
    aliases: ['nepal'],
    neighbors: ['China', 'India'],
    flagColors: ['#DC143C', '#003893', '#FFFFFF'],
    flagLayoutDesc: 'Unique non-quadrilateral double pennant with sun and crescent moon',
    funFact: 'Nepal has the only national flag in the world that is not rectangular.',
    nickname: 'Roof of the World'
  },
  {
    name: 'Bhutan',
    code: 'BT',
    flag: '🇧🇹',
    continent: 'Asia',
    capital: 'Thimphu',
    population: '780K',
    areaKm2: 38394,
    aliases: ['bhutan'],
    neighbors: ['China', 'India'],
    flagColors: ['#FFCC00', '#FF4E12', '#FFFFFF'],
    flagLayoutDesc: 'Diagonally divided yellow and orange with white dragon (Druk) along dividing line',
    funFact: 'Bhutan measures national progress through Gross National Happiness rather than GDP.',
    nickname: 'Land of the Thunder Dragon'
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    continent: 'Asia',
    capital: 'Abu Dhabi',
    population: '9.9M',
    areaKm2: 83600,
    aliases: ['uae', 'emirates'],
    neighbors: ['Saudi Arabia', 'Oman'],
    flagColors: ['#00732F', '#FFFFFF', '#000000', '#FF0000'],
    flagLayoutDesc: 'Pan-Arab colors: green, white, black horizontal stripes with red hoist band',
    funFact: 'Home to Burj Khalifa in Dubai, the tallest human-made structure in the world (828m).',
    nickname: 'Land of Falconry & Oasis'
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    flag: '🇰🇿',
    continent: 'Asia',
    capital: 'Astana',
    population: '20M',
    areaKm2: 2724900,
    aliases: ['kazakhstan'],
    neighbors: ['Russia', 'China', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan'],
    flagColors: ['#00AFCA', '#FEC50C'],
    flagLayoutDesc: 'Sky blue field with gold sun and steppe eagle in center and ornamental pattern at hoist',
    funFact: 'Kazakhstan is the world’s largest landlocked country and 9th largest country overall.',
    nickname: 'Land of the Great Steppe'
  },

  // Additional African Nations
  {
    name: 'Algeria',
    code: 'DZ',
    flag: '🇩🇿',
    continent: 'Africa',
    capital: 'Algiers',
    population: '45M',
    areaKm2: 2381741,
    aliases: ['algeria', 'algerie'],
    neighbors: ['Tunisia', 'Libya', 'Niger', 'Mali', 'Mauritania', 'Morocco'],
    flagColors: ['#006233', '#FFFFFF', '#D21034'],
    flagLayoutDesc: 'Green and white vertical halves with red crescent and star in the center',
    funFact: 'Algeria is the largest country by land area in Africa and the 10th largest in the world.',
    nickname: 'Land of Cherries and Dates'
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    flag: '🇪🇹',
    continent: 'Africa',
    capital: 'Addis Ababa',
    population: '126M',
    areaKm2: 1104300,
    aliases: ['ethiopia'],
    neighbors: ['Eritrea', 'Djibouti', 'Somalia', 'Kenya', 'South Sudan', 'Sudan'],
    flagColors: ['#009A44', '#FED100', '#EF3340', '#0F47AF'],
    flagLayoutDesc: 'Green, yellow, red horizontal tricolor with blue disc and yellow pentagram star',
    funFact: 'Ethiopia has its own unique calendar with 13 months, approximately 7 years behind the Gregorian calendar.',
    nickname: 'Cradle of Humankind'
  },
  {
    name: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    continent: 'Africa',
    capital: 'Accra',
    population: '34M',
    areaKm2: 238535,
    aliases: ['ghana'],
    neighbors: ['Ivory Coast', 'Burkina Faso', 'Togo'],
    flagColors: ['#CE1126', '#FCD116', '#006B3F', '#000000'],
    flagLayoutDesc: 'Red, yellow, and green horizontal stripes with black star in the center',
    funFact: 'Ghana was the first sub-Saharan African country to gain independence from colonial rule (1957).',
    nickname: 'The Black Star of Africa'
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    flag: '🇹🇿',
    continent: 'Africa',
    capital: 'Dodoma',
    population: '65M',
    areaKm2: 947303,
    aliases: ['tanzania'],
    neighbors: ['Kenya', 'Uganda', 'Rwanda', 'Burundi', 'DR Congo', 'Zambia', 'Malawi', 'Mozambique'],
    flagColors: ['#1EB53A', '#00A3DD', '#000000', '#FCD116'],
    flagLayoutDesc: 'Diagonal black band with yellow fimbriations separating green and light blue triangles',
    funFact: 'Home to Mount Kilimanjaro, the highest peak in Africa, and the Serengeti ecosystem.',
    nickname: 'Land of Kilimanjaro and Zanzibar'
  },
  {
    name: 'Madagascar',
    code: 'MG',
    flag: '🇲🇬',
    continent: 'Africa',
    capital: 'Antananarivo',
    population: '30M',
    areaKm2: 587041,
    aliases: ['madagascar'],
    neighbors: [],
    flagColors: ['#FFFFFF', '#FC3D32', '#007E3A'],
    flagLayoutDesc: 'White vertical stripe on hoist with red over green horizontal stripes on fly',
    funFact: 'Madagascar produces roughly 80% of the world’s natural vanilla supply.',
    nickname: 'The Red Island'
  },

  // Additional Americas Nations
  {
    name: 'Peru',
    code: 'PE',
    flag: '🇵🇪',
    continent: 'South America',
    capital: 'Lima',
    population: '34M',
    areaKm2: 1285216,
    aliases: ['peru'],
    neighbors: ['Ecuador', 'Colombia', 'Brazil', 'Bolivia', 'Chile'],
    flagColors: ['#D91023', '#FFFFFF'],
    flagLayoutDesc: 'Vertical triband of Red, White, and Red',
    funFact: 'Home to Machu Picchu and over 3,000 varieties of native potatoes.',
    nickname: 'Land of the Incas'
  },
  {
    name: 'Uruguay',
    code: 'UY',
    flag: '🇺🇾',
    continent: 'South America',
    capital: 'Montevideo',
    population: '3.4M',
    areaKm2: 176215,
    aliases: ['uruguay'],
    neighbors: ['Brazil', 'Argentina'],
    flagColors: ['#FFFFFF', '#0038A8', '#FCD116'],
    flagLayoutDesc: 'Nine alternating white and blue horizontal stripes with Sun of May in canton',
    funFact: 'Uruguay hosted and won the very first FIFA World Cup in 1930.',
    nickname: 'The Switzerland of South America'
  },
  {
    name: 'Cuba',
    code: 'CU',
    flag: '🇨🇺',
    continent: 'North America',
    capital: 'Havana',
    population: '11M',
    areaKm2: 109884,
    aliases: ['cuba'],
    neighbors: [],
    flagColors: ['#002A8F', '#FFFFFF', '#CF142B'],
    flagLayoutDesc: 'Five blue and white alternating stripes with red hoist chevron containing white star',
    funFact: 'Cuba is the largest island in the Caribbean, resembling an alligator from above.',
    nickname: 'The Pearl of the Antilles'
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    flag: '🇨🇷',
    continent: 'North America',
    capital: 'San José',
    population: '5.2M',
    areaKm2: 51100,
    aliases: ['costa rica'],
    neighbors: ['Nicaragua', 'Panama'],
    flagColors: ['#002B7F', '#FFFFFF', '#CE1126'],
    flagLayoutDesc: 'Horizontal stripes of blue, white, red (double width), white, blue',
    funFact: 'Costa Rica abolished its standing military in 1948 and contains 5% of world biodiversity.',
    nickname: 'Rich Coast (Pura Vida)'
  },

  // Additional Oceania Nations
  {
    name: 'Fiji',
    code: 'FJ',
    flag: '🇫🇯',
    continent: 'Oceania',
    capital: 'Suva',
    population: '930K',
    areaKm2: 18274,
    aliases: ['fiji'],
    neighbors: [],
    flagColors: ['#68BFE5', '#FFFFFF', '#CC0000'],
    flagLayoutDesc: 'Light cyan blue field with Union Jack in canton and national coat of arms on fly',
    funFact: 'Fiji is an archipelago of more than 330 islands, of which about 110 are permanently inhabited.',
    nickname: 'Soft Coral Capital of the World'
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    flag: '🇵🇬',
    continent: 'Oceania',
    capital: 'Port Moresby',
    population: '10M',
    areaKm2: 462840,
    aliases: ['png', 'papua new guinea'],
    neighbors: ['Indonesia'],
    flagColors: ['#000000', '#CE1126', '#FFD700', '#FFFFFF'],
    flagLayoutDesc: 'Diagonally divided black and red with Southern Cross and yellow raggiana bird of paradise',
    funFact: 'Papua New Guinea is the most linguistically diverse country on Earth with over 840 languages spoken.',
    nickname: 'Land of the Unexpected'
  }
];

// 2. WORLD ADMINISTRATIVE DIVISIONS (STATES / PROVINCES / PREFECTURES)
export const COUNTRY_DIVISIONS: Record<string, CountryDivisionData> = {
  US: {
    countryName: 'United States',
    flag: '🇺🇸',
    divisionTitle: 'All 50 US States',
    totalCount: 50,
    items: [
      { name: 'Alabama', capital: 'Montgomery', code: 'AL', nickname: 'Yellowhammer State' },
      { name: 'Alaska', capital: 'Juneau', code: 'AK', nickname: 'The Last Frontier' },
      { name: 'Arizona', capital: 'Phoenix', code: 'AZ', nickname: 'Grand Canyon State' },
      { name: 'Arkansas', capital: 'Little Rock', code: 'AR', nickname: 'The Natural State' },
      { name: 'California', capital: 'Sacramento', code: 'CA', nickname: 'Golden State' },
      { name: 'Colorado', capital: 'Denver', code: 'CO', nickname: 'Centennial State' },
      { name: 'Connecticut', capital: 'Hartford', code: 'CT', nickname: 'Constitution State' },
      { name: 'Delaware', capital: 'Dover', code: 'DE', nickname: 'First State' },
      { name: 'Florida', capital: 'Tallahassee', code: 'FL', nickname: 'Sunshine State' },
      { name: 'Georgia', capital: 'Atlanta', code: 'GA', nickname: 'Peach State' },
      { name: 'Hawaii', capital: 'Honolulu', code: 'HI', nickname: 'Aloha State' },
      { name: 'Idaho', capital: 'Boise', code: 'ID', nickname: 'Gem State' },
      { name: 'Illinois', capital: 'Springfield', code: 'IL', nickname: 'Prairie State' },
      { name: 'Indiana', capital: 'Indianapolis', code: 'IN', nickname: 'Hoosier State' },
      { name: 'Iowa', capital: 'Des Moines', code: 'IA', nickname: 'Hawkeye State' },
      { name: 'Kansas', capital: 'Topeka', code: 'KS', nickname: 'Sunflower State' },
      { name: 'Kentucky', capital: 'Frankfort', code: 'KY', nickname: 'Bluegrass State' },
      { name: 'Louisiana', capital: 'Baton Rouge', code: 'LA', nickname: 'Pelican State' },
      { name: 'Maine', capital: 'Augusta', code: 'ME', nickname: 'Pine Tree State' },
      { name: 'Maryland', capital: 'Annapolis', code: 'MD', nickname: 'Old Line State' },
      { name: 'Massachusetts', capital: 'Boston', code: 'MA', nickname: 'Bay State' },
      { name: 'Michigan', capital: 'Lansing', code: 'MI', nickname: 'Great Lakes State' },
      { name: 'Minnesota', capital: 'St. Paul', code: 'MN', nickname: 'Land of 10,000 Lakes' },
      { name: 'Mississippi', capital: 'Jackson', code: 'MS', nickname: 'Magnolia State' },
      { name: 'Missouri', capital: 'Jefferson City', code: 'MO', nickname: 'Show-Me State' },
      { name: 'Montana', capital: 'Helena', code: 'MT', nickname: 'Treasure State' },
      { name: 'Nebraska', capital: 'Lincoln', code: 'NE', nickname: 'Cornhusker State' },
      { name: 'Nevada', capital: 'Carson City', code: 'NV', nickname: 'Silver State' },
      { name: 'New Hampshire', capital: 'Concord', code: 'NH', nickname: 'Granite State' },
      { name: 'New Jersey', capital: 'Trenton', code: 'NJ', nickname: 'Garden State' },
      { name: 'New Mexico', capital: 'Santa Fe', code: 'NM', nickname: 'Land of Enchantment' },
      { name: 'New York', capital: 'Albany', code: 'NY', nickname: 'Empire State' },
      { name: 'North Carolina', capital: 'Raleigh', code: 'NC', nickname: 'Tar Heel State' },
      { name: 'North Dakota', capital: 'Bismarck', code: 'ND', nickname: 'Peace Garden State' },
      { name: 'Ohio', capital: 'Columbus', code: 'OH', nickname: 'Buckeye State' },
      { name: 'Oklahoma', capital: 'Oklahoma City', code: 'OK', nickname: 'Sooner State' },
      { name: 'Oregon', capital: 'Salem', code: 'OR', nickname: 'Beaver State' },
      { name: 'Pennsylvania', capital: 'Harrisburg', code: 'PA', nickname: 'Keystone State' },
      { name: 'Rhode Island', capital: 'Providence', code: 'RI', nickname: 'Ocean State' },
      { name: 'South Carolina', capital: 'Columbia', code: 'SC', nickname: 'Palmetto State' },
      { name: 'South Dakota', capital: 'Pierre', code: 'SD', nickname: 'Mount Rushmore State' },
      { name: 'Tennessee', capital: 'Nashville', code: 'TN', nickname: 'Volunteer State' },
      { name: 'Texas', capital: 'Austin', code: 'TX', nickname: 'Lone Star State' },
      { name: 'Utah', capital: 'Salt Lake City', code: 'UT', nickname: 'Beehive State' },
      { name: 'Vermont', capital: 'Montpelier', code: 'VT', nickname: 'Green Mountain State' },
      { name: 'Virginia', capital: 'Richmond', code: 'VA', nickname: 'Old Dominion' },
      { name: 'Washington', capital: 'Olympia', code: 'WA', nickname: 'Evergreen State' },
      { name: 'West Virginia', capital: 'Charleston', code: 'WV', nickname: 'Mountain State' },
      { name: 'Wisconsin', capital: 'Madison', code: 'WI', nickname: 'Badger State' },
      { name: 'Wyoming', capital: 'Cheyenne', code: 'WY', nickname: 'Equality State' }
    ]
  },
  CA: {
    countryName: 'Canada',
    flag: '🇨🇦',
    divisionTitle: '10 Provinces & 3 Territories',
    totalCount: 13,
    items: [
      { name: 'Ontario', capital: 'Toronto', code: 'ON' },
      { name: 'Quebec', capital: 'Quebec City', code: 'QC' },
      { name: 'British Columbia', capital: 'Victoria', code: 'BC' },
      { name: 'Alberta', capital: 'Edmonton', code: 'AB' },
      { name: 'Manitoba', capital: 'Winnipeg', code: 'MB' },
      { name: 'Saskatchewan', capital: 'Regina', code: 'SK' },
      { name: 'Nova Scotia', capital: 'Halifax', code: 'NS' },
      { name: 'New Brunswick', capital: 'Fredericton', code: 'NB' },
      { name: 'Newfoundland and Labrador', capital: "St. John's", code: 'NL' },
      { name: 'Prince Edward Island', capital: 'Charlottetown', code: 'PE' },
      { name: 'Northwest Territories', capital: 'Yellowknife', code: 'NT' },
      { name: 'Yukon', capital: 'Whitehorse', code: 'YT' },
      { name: 'Nunavut', capital: 'Iqaluit', code: 'NU' }
    ]
  },
  AU: {
    countryName: 'Australia',
    flag: '🇦🇺',
    divisionTitle: '6 States & 2 Mainland Territories',
    totalCount: 8,
    items: [
      { name: 'New South Wales', capital: 'Sydney', code: 'NSW' },
      { name: 'Victoria', capital: 'Melbourne', code: 'VIC' },
      { name: 'Queensland', capital: 'Brisbane', code: 'QLD' },
      { name: 'Western Australia', capital: 'Perth', code: 'WA' },
      { name: 'South Australia', capital: 'Adelaide', code: 'SA' },
      { name: 'Tasmania', capital: 'Hobart', code: 'TAS' },
      { name: 'Australian Capital Territory', capital: 'Canberra', code: 'ACT' },
      { name: 'Northern Territory', capital: 'Darwin', code: 'NT' }
    ]
  },
  DE: {
    countryName: 'Germany',
    flag: '🇩🇪',
    divisionTitle: '16 Federal States (Bundesländer)',
    totalCount: 16,
    items: [
      { name: 'Bavaria', capital: 'Munich', code: 'BY', aliases: ['bayern'] },
      { name: 'Berlin', capital: 'Berlin', code: 'BE' },
      { name: 'Baden-Württemberg', capital: 'Stuttgart', code: 'BW' },
      { name: 'North Rhine-Westphalia', capital: 'Düsseldorf', code: 'NW', aliases: ['nordrhein-westfalen'] },
      { name: 'Hesse', capital: 'Wiesbaden', code: 'HE', aliases: ['hessen'] },
      { name: 'Saxony', capital: 'Dresden', code: 'SN', aliases: ['sachsen'] },
      { name: 'Lower Saxony', capital: 'Hanover', code: 'NI', aliases: ['niedersachsen'] },
      { name: 'Hamburg', capital: 'Hamburg', code: 'HH' },
      { name: 'Rhineland-Palatinate', capital: 'Mainz', code: 'RP', aliases: ['rheinland-pfalz'] },
      { name: 'Schleswig-Holstein', capital: 'Kiel', code: 'SH' },
      { name: 'Brandenburg', capital: 'Potsdam', code: 'BB' },
      { name: 'Thuringia', capital: 'Erfurt', code: 'TH', aliases: ['thüringen'] },
      { name: 'Saxony-Anhalt', capital: 'Magdeburg', code: 'ST', aliases: ['sachsen-anhalt'] },
      { name: 'Mecklenburg-Vorpommern', capital: 'Schwerin', code: 'MV' },
      { name: 'Saarland', capital: 'Saarbrücken', code: 'SL' },
      { name: 'Bremen', capital: 'Bremen', code: 'HB' }
    ]
  },
  IN: {
    countryName: 'India',
    flag: '🇮🇳',
    divisionTitle: 'Key States & Territories',
    totalCount: 12,
    items: [
      { name: 'Maharashtra', capital: 'Mumbai' },
      { name: 'Tamil Nadu', capital: 'Chennai' },
      { name: 'Karnataka', capital: 'Bengaluru' },
      { name: 'Gujarat', capital: 'Gandhinagar' },
      { name: 'Uttar Pradesh', capital: 'Lucknow' },
      { name: 'Kerala', capital: 'Thiruvananthapuram' },
      { name: 'West Bengal', capital: 'Kolkata' },
      { name: 'Rajasthan', capital: 'Jaipur' },
      { name: 'Punjab', capital: 'Chandigarh' },
      { name: 'Telangana', capital: 'Hyderabad' },
      { name: 'Goa', capital: 'Panaji' },
      { name: 'Delhi', capital: 'New Delhi' }
    ]
  },
  JP: {
    countryName: 'Japan',
    flag: '🇯🇵',
    divisionTitle: 'Key Prefectures & Regions',
    totalCount: 12,
    items: [
      { name: 'Hokkaido', capital: 'Sapporo' },
      { name: 'Tokyo', capital: 'Tokyo' },
      { name: 'Kyoto', capital: 'Kyoto' },
      { name: 'Osaka', capital: 'Osaka' },
      { name: 'Kanagawa', capital: 'Yokohama' },
      { name: 'Aichi', capital: 'Nagoya' },
      { name: 'Fukuoka', capital: 'Fukuoka' },
      { name: 'Hiroshima', capital: 'Hiroshima' },
      { name: 'Okinawa', capital: 'Naha' },
      { name: 'Hyogo', capital: 'Kobe' },
      { name: 'Miyagi', capital: 'Sendai' },
      { name: 'Shizuoka', capital: 'Shizuoka' }
    ]
  }
};

// 3. FLAG CONSTRUCTION QUIZ CHALLENGES ("MAKING FLAGS")
export const FLAG_CHALLENGES: FlagChallenge[] = [
  {
    id: 'france',
    countryName: 'France',
    flagEmoji: '🇫🇷',
    difficulty: 'Easy',
    requiredLayout: 'vertical-3',
    colors: ['#002654', '#FFFFFF', '#ED2939'],
    colorToleranceNames: ['Blue', 'White', 'Red'],
    hasEmblem: false,
    description: 'Assemble the iconic French Tricolore (3 vertical bands).',
    hint: 'Left is Blue, center is White, right is Red.'
  },
  {
    id: 'germany',
    countryName: 'Germany',
    flagEmoji: '🇩🇪',
    difficulty: 'Easy',
    requiredLayout: 'horizontal-3',
    colors: ['#000000', '#DD0000', '#FFCE00'],
    colorToleranceNames: ['Black', 'Red', 'Gold/Yellow'],
    hasEmblem: false,
    description: 'Construct the German Bundesflagge (3 horizontal stripes).',
    hint: 'From top to bottom: Black, Red, Gold.'
  },
  {
    id: 'italy',
    countryName: 'Italy',
    flagEmoji: '🇮🇹',
    difficulty: 'Easy',
    requiredLayout: 'vertical-3',
    colors: ['#008C45', '#F4F5F0', '#CD212A'],
    colorToleranceNames: ['Green', 'White', 'Red'],
    hasEmblem: false,
    description: 'Create Il Tricolore of Italy (3 vertical stripes).',
    hint: 'Left stripe is Green, middle is White, right is Red.'
  },
  {
    id: 'ukraine',
    countryName: 'Ukraine',
    flagEmoji: '🇺🇦',
    difficulty: 'Easy',
    requiredLayout: 'horizontal-2',
    colors: ['#0057B7', '#FFD700'],
    colorToleranceNames: ['Blue', 'Yellow'],
    hasEmblem: false,
    description: 'Paint the Ukrainian flag representing blue sky over golden wheat fields.',
    hint: 'Top is Blue, bottom is Yellow.'
  },
  {
    id: 'japan',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    difficulty: 'Easy',
    requiredLayout: 'center-circle',
    colors: ['#FFFFFF', '#BC002D'],
    colorToleranceNames: ['White', 'Crimson/Red'],
    hasEmblem: false,
    description: 'Assemble the Hinomaru (sun disc on field).',
    hint: 'White background with a crimson red circle in the center.'
  },
  {
    id: 'sweden',
    countryName: 'Sweden',
    flagEmoji: '🇸🇪',
    difficulty: 'Medium',
    requiredLayout: 'nordic-cross',
    colors: ['#006AA7', '#FECC00'],
    colorToleranceNames: ['Blue', 'Yellow'],
    hasEmblem: false,
    description: 'Craft the Swedish Nordic Cross flag.',
    hint: 'Yellow cross on a sky blue field.'
  },
  {
    id: 'ireland',
    countryName: 'Ireland',
    flagEmoji: '🇮🇪',
    difficulty: 'Easy',
    requiredLayout: 'vertical-3',
    colors: ['#169B62', '#FFFFFF', '#FF883E'],
    colorToleranceNames: ['Green', 'White', 'Orange'],
    hasEmblem: false,
    description: 'Create the Irish Tricolor representing peace between traditions.',
    hint: 'Left is Green, middle is White, right is Orange.'
  },
  {
    id: 'poland',
    countryName: 'Poland',
    flagEmoji: '🇵🇱',
    difficulty: 'Easy',
    requiredLayout: 'horizontal-2',
    colors: ['#FFFFFF', '#DC143C'],
    colorToleranceNames: ['White', 'Red'],
    hasEmblem: false,
    description: 'Build the Polish bicolor flag (not to be confused with Indonesia or Monaco).',
    hint: 'White on the top half, Red on the bottom half.'
  },
  {
    id: 'netherlands',
    countryName: 'Netherlands',
    flagEmoji: '🇳🇱',
    difficulty: 'Medium',
    requiredLayout: 'horizontal-3',
    colors: ['#AE1C28', '#FFFFFF', '#21468B'],
    colorToleranceNames: ['Red', 'White', 'Blue'],
    hasEmblem: false,
    description: 'Assemble the oldest tricolor in continuous use.',
    hint: 'Top is Red, middle is White, bottom is Blue.'
  },
  {
    id: 'argentina',
    countryName: 'Argentina',
    flagEmoji: '🇦🇷',
    difficulty: 'Hard',
    requiredLayout: 'horizontal-3-emblem',
    colors: ['#74ACDF', '#FFFFFF', '#74ACDF'],
    colorToleranceNames: ['Light Blue', 'White', 'Light Blue'],
    hasEmblem: true,
    emblemType: 'sun',
    description: 'Create the Argentine flag with the Sun of May.',
    hint: 'Light Blue top and bottom, White center with the golden Sun of May.'
  },
  {
    id: 'austria',
    countryName: 'Austria',
    flagEmoji: '🇦🇹',
    difficulty: 'Easy',
    requiredLayout: 'horizontal-3',
    colors: ['#ED2939', '#FFFFFF', '#ED2939'],
    colorToleranceNames: ['Red', 'White', 'Red'],
    hasEmblem: false,
    description: 'One of the oldest flags in the world, dating to Duke Leopold V.',
    hint: 'Three horizontal stripes: Red on top and bottom, White in the middle.'
  },
  {
    id: 'belgium',
    countryName: 'Belgium',
    flagEmoji: '🇧🇪',
    difficulty: 'Easy',
    requiredLayout: 'vertical-3',
    colors: ['#000000', '#FDDA24', '#EF3340'],
    colorToleranceNames: ['Black', 'Yellow', 'Red'],
    hasEmblem: false,
    description: 'Construct the Belgian tricolor (3 vertical stripes).',
    hint: 'From hoist to fly (left to right): Black, Yellow, Red.'
  },
  {
    id: 'colombia',
    countryName: 'Colombia',
    flagEmoji: '🇨🇴',
    difficulty: 'Medium',
    requiredLayout: 'horizontal-3',
    colors: ['#FCD116', '#003893', '#CE1126'],
    colorToleranceNames: ['Yellow', 'Blue', 'Red'],
    hasEmblem: false,
    description: 'Build the flag of Colombia (Yellow, Blue, and Red).',
    hint: 'Top stripe is Yellow, middle is Blue, bottom is Red.'
  },
  {
    id: 'finland',
    countryName: 'Finland',
    flagEmoji: '🇫🇮',
    difficulty: 'Medium',
    requiredLayout: 'nordic-cross',
    colors: ['#FFFFFF', '#003580'],
    colorToleranceNames: ['White', 'Blue'],
    hasEmblem: false,
    description: 'Assemble the Siniristilippu (Blue Cross flag of Finland).',
    hint: 'A deep blue Nordic cross on a pure white field.'
  },
  {
    id: 'nigeria',
    countryName: 'Nigeria',
    flagEmoji: '🇳🇬',
    difficulty: 'Easy',
    requiredLayout: 'vertical-3',
    colors: ['#008751', '#FFFFFF', '#008751'],
    colorToleranceNames: ['Green', 'White', 'Green'],
    hasEmblem: false,
    description: 'Paint the flag of Africa’s most populous nation.',
    hint: 'Three equal vertical stripes: Green, White, and Green.'
  },
  {
    id: 'indonesia',
    countryName: 'Indonesia',
    flagEmoji: '🇮🇩',
    difficulty: 'Easy',
    requiredLayout: 'horizontal-2',
    colors: ['#FF0000', '#FFFFFF'],
    colorToleranceNames: ['Red', 'White'],
    hasEmblem: false,
    description: 'Construct Sang Saka Merah Putih (The Red and White).',
    hint: 'Red on top, White on the bottom (the opposite of Poland).'
  },
  {
    id: 'chad',
    countryName: 'Chad',
    flagEmoji: '🇹🇩',
    difficulty: 'Medium',
    requiredLayout: 'vertical-3',
    colors: ['#00205B', '#FFCD00', '#C60C30'],
    colorToleranceNames: ['Blue', 'Gold', 'Red'],
    hasEmblem: false,
    description: 'Assemble the flag of Chad (vertical tricolor).',
    hint: 'Three vertical stripes: Indigo Blue on the left, Gold in center, Red on right.'
  }
];

// 4. PHYSICAL GEOGRAPHY, WONDERS & SUPERLATIVES
export const PHYSICAL_GEOGRAPHY_ITEMS: PhysicalGeoItem[] = [
  {
    name: 'Nile vs Amazon River',
    category: 'Rivers',
    record: 'Longest River in the World (~6,650 km / 4,132 miles)',
    locations: 'Northeast Africa (11 basin countries)',
    detail: 'While the Amazon has by far the highest discharge water volume, the Nile is traditionally recognized as the longest.',
    quizQuestion: 'Which river holds the traditional title of the longest river on Earth?',
    options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
    correctIndex: 1
  },
  {
    name: 'Mount Everest (Chomolungma / Sagarmatha)',
    category: 'Mountains & Peaks',
    record: 'Highest Peak Above Sea Level (8,848.86 m / 29,031.7 ft)',
    locations: 'Himalayas (Border of Nepal and China/Tibet)',
    detail: 'Tectonic plate collisions continue to push the Himalayas upward by approximately 4 mm per year.',
    quizQuestion: 'On the border of which two territories is Mount Everest located?',
    options: ['India and Nepal', 'Nepal and China (Tibet)', 'Pakistan and China', 'Bhutan and India'],
    correctIndex: 1
  },
  {
    name: 'Mariana Trench (Challenger Deep)',
    category: 'Superlatives',
    record: 'Deepest Oceanic Trench (~10,994 m / 36,070 ft deep)',
    locations: 'Western Pacific Ocean near Guam',
    detail: 'At the bottom of Challenger Deep, the water pressure is over 1,000 times standard atmospheric pressure at sea level.',
    quizQuestion: 'What is the deepest known location in Earth’s oceans?',
    options: ['Java Trench', 'Puerto Rico Trench', 'Challenger Deep (Mariana Trench)', 'Tonga Trench'],
    correctIndex: 2
  },
  {
    name: 'Sahara Desert',
    category: 'Deserts',
    record: 'Largest Hot Desert on Earth (9.2 million km²)',
    locations: 'North Africa across 11 nations',
    detail: 'The Sahara is comparable in land area to the entire United States or China.',
    quizQuestion: 'What is the largest hot desert in the world?',
    options: ['Gobi Desert', 'Arabian Desert', 'Sahara Desert', 'Kalahari Desert'],
    correctIndex: 2
  },
  {
    name: 'Strait of Gibraltar',
    category: 'Straits & Canals',
    record: 'Narrowest Maritime Chokepoint between Europe and Africa (14.3 km / 8.9 miles)',
    locations: 'Between Spain/Gibraltar and Morocco',
    detail: 'Connects the Atlantic Ocean to the Mediterranean Sea and separates two continents.',
    quizQuestion: 'Which natural strait connects the Atlantic Ocean directly to the Mediterranean Sea?',
    options: ['Strait of Hormuz', 'Bosphorus Strait', 'Strait of Gibraltar', 'Strait of Malacca'],
    correctIndex: 2
  },
  {
    name: 'Angel Falls',
    category: 'Superlatives',
    record: 'World’s Highest Uninterrupted Waterfall (979 m / 3,212 ft)',
    locations: 'Canaima National Park, Venezuela',
    detail: 'Water drops so far that much of it turns into mist before reaching the ground.',
    quizQuestion: 'In which South American nation is Angel Falls, the world’s tallest waterfall, located?',
    options: ['Brazil', 'Colombia', 'Venezuela', 'Peru'],
    correctIndex: 2
  },
  {
    name: 'Lake Baikal',
    category: 'Superlatives',
    record: 'Deepest and Oldest Freshwater Lake (1,642 m deep, holds 20% of world unfrozen freshwater)',
    locations: 'Siberia, Russia',
    detail: 'Contains more fresh surface water than all of the North American Great Lakes combined.',
    quizQuestion: 'Which lake in Siberia holds roughly 20% of the world’s unfrozen freshwater surface reserve?',
    options: ['Lake Superior', 'Lake Victoria', 'Lake Baikal', 'Caspian Sea'],
    correctIndex: 2
  },
  {
    name: 'Andes Mountain Range',
    category: 'Mountains & Peaks',
    record: 'Longest Continental Mountain Range (~7,000 km / 4,350 miles)',
    locations: 'Along Western Coast of South America across 7 countries',
    detail: 'Spans Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, and Argentina.',
    quizQuestion: 'What is the longest continental mountain range on Earth?',
    options: ['Rocky Mountains', 'Himalayas', 'Andes Mountains', 'Alps'],
    correctIndex: 2
  }
];

// Color palette options for Flag Painter Studio
export const COLOR_SWATCHES = [
  { name: 'Red', hex: '#ED2939' },
  { name: 'Dark Red', hex: '#BA0C2F' },
  { name: 'Blue', hex: '#002654' },
  { name: 'Sky Blue', hex: '#0057B7' },
  { name: 'Light Blue', hex: '#74ACDF' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gold/Yellow', hex: '#FFD700' },
  { name: 'Saffron/Orange', hex: '#FF883E' },
  { name: 'Green', hex: '#008C45' },
  { name: 'Forest Green', hex: '#006600' }
];

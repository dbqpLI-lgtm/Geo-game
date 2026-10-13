export interface WaterFeature {
  id: string;
  name: string;
  kind: 'Ocean' | 'Sea';
  location: string;
  position: [number, number];
  detail: string;
}

export interface MonumentFeature {
  id: string;
  name: string;
  country: string;
  location: string;
  position: [number, number];
  detail: string;
}

export const WATER_FEATURES: WaterFeature[] = [
  { id: 'arctic-ocean', name: 'Arctic Ocean', kind: 'Ocean', location: 'Around the North Pole', position: [82, 0], detail: 'The smallest and shallowest of the five recognized oceans, largely surrounded by northern continents.' },
  { id: 'atlantic-ocean', name: 'Atlantic Ocean', kind: 'Ocean', location: 'Between the Americas, Europe, and Africa', position: [5, -30], detail: 'The world’s second-largest ocean, linking the Americas with Europe and Africa.' },
  { id: 'indian-ocean', name: 'Indian Ocean', kind: 'Ocean', location: 'Between Africa, Asia, and Australia', position: [-20, 80], detail: 'The third-largest ocean, crossed by important trade routes between Africa, the Middle East, South Asia, and Southeast Asia.' },
  { id: 'pacific-ocean', name: 'Pacific Ocean', kind: 'Ocean', location: 'Between Asia, Australia, and the Americas', position: [0, 160], detail: 'The largest and deepest ocean. It stretches from Asia and Australia to the Americas.' },
  { id: 'southern-ocean', name: 'Southern Ocean', kind: 'Ocean', location: 'Encircling Antarctica', position: [-65, 0], detail: 'The ocean surrounding Antarctica, recognized by the International Hydrographic Organization as a distinct ocean.' },
  { id: 'red-sea', name: 'Red Sea', kind: 'Sea', location: 'Between northeast Africa and the Arabian Peninsula', position: [20, 38], detail: 'A narrow sea connected to the Mediterranean by the Suez Canal and to the Gulf of Aden through the Bab el-Mandeb Strait.' },
  { id: 'mediterranean-sea', name: 'Mediterranean Sea', kind: 'Sea', location: 'Between southern Europe, northern Africa, and western Asia', position: [35, 18], detail: 'An almost enclosed sea connected to the Atlantic through the Strait of Gibraltar.' },
  { id: 'caribbean-sea', name: 'Caribbean Sea', kind: 'Sea', location: 'Between Central America and the Caribbean islands', position: [15, -75], detail: 'A tropical sea bordered by Central America, northern South America, and the Caribbean islands.' },
  { id: 'south-china-sea', name: 'South China Sea', kind: 'Sea', location: 'Between Southeast Asia and the Philippines', position: [12, 115], detail: 'A major western Pacific sea bordered by China, Vietnam, the Philippines, Malaysia, Brunei, and Indonesia.' },
  { id: 'arabian-sea', name: 'Arabian Sea', kind: 'Sea', location: 'Between the Arabian Peninsula and India', position: [15, 65], detail: 'A northwestern part of the Indian Ocean along important shipping routes to the Persian Gulf.' },
  { id: 'bering-sea', name: 'Bering Sea', kind: 'Sea', location: 'Between Alaska and Russia', position: [58, 175], detail: 'A northern Pacific sea separated from the Arctic Ocean by the Bering Strait.' },
  { id: 'baltic-sea', name: 'Baltic Sea', kind: 'Sea', location: 'Northern Europe', position: [58, 20], detail: 'A brackish inland sea bordered by countries including Sweden, Finland, Estonia, Latvia, Lithuania, Poland, Germany, and Denmark.' },
  { id: 'black-sea', name: 'Black Sea', kind: 'Sea', location: 'Between southeastern Europe and western Asia', position: [43, 35], detail: 'An inland sea linked to the Mediterranean through the Bosporus, Sea of Marmara, and Dardanelles.' },
  { id: 'caspian-sea', name: 'Caspian Sea', kind: 'Sea', location: 'Between Europe and Asia', position: [42, 51], detail: 'The world’s largest inland body of water, bordered by Russia, Kazakhstan, Turkmenistan, Iran, and Azerbaijan.' },
  { id: 'north-sea', name: 'North Sea', kind: 'Sea', location: 'Between Great Britain and mainland northern Europe', position: [56, 3], detail: 'A shallow sea of the northeastern Atlantic bordered by Great Britain and countries including Norway, Denmark, Germany, and the Netherlands.' },
  { id: 'coral-sea', name: 'Coral Sea', kind: 'Sea', location: 'Off northeastern Australia', position: [-18, 155], detail: 'A southwestern Pacific sea containing the Great Barrier Reef along Australia’s northeast coast.' },
  { id: 'tasman-sea', name: 'Tasman Sea', kind: 'Sea', location: 'Between Australia and New Zealand', position: [-40, 160], detail: 'A southwestern Pacific sea separating Australia from New Zealand.' },
  { id: 'persian-gulf', name: 'Persian Gulf', kind: 'Sea', location: 'Between Iran and the Arabian Peninsula', position: [26, 52], detail: 'A shallow gulf connected to the Gulf of Oman and the Arabian Sea through the Strait of Hormuz.' },
  { id: 'sea-of-japan', name: 'Sea of Japan', kind: 'Sea', location: 'Between Japan, Korea, and Russia', position: [40, 137], detail: 'A marginal sea of the northwest Pacific, also known in Korea as the East Sea.' },
  { id: 'yellow-sea', name: 'Yellow Sea', kind: 'Sea', location: 'Between China and the Korean Peninsula', position: [36, 123], detail: 'A shallow marginal sea of the Pacific named for the sediment-rich waters carried by rivers.' },
  { id: 'aegean-sea', name: 'Aegean Sea', kind: 'Sea', location: 'Between Greece and Türkiye', position: [39, 25], detail: 'An arm of the Mediterranean dotted with Greek islands and bordered by Greece and Türkiye.' },
  { id: 'bay-of-bengal', name: 'Bay of Bengal', kind: 'Sea', location: 'East of India and west of Myanmar', position: [15, 88], detail: 'The northeastern arm of the Indian Ocean, bordered by India, Bangladesh, and Myanmar.' },
  { id: 'andaman-sea', name: 'Andaman Sea', kind: 'Sea', location: 'East of the Bay of Bengal, near Myanmar and Thailand', position: [10, 95], detail: 'A marginal sea of the northeastern Indian Ocean, east of the Bay of Bengal.' },
  { id: 'labrador-sea', name: 'Labrador Sea', kind: 'Sea', location: 'Between Labrador and Greenland', position: [58, -53], detail: 'A northwestern arm of the Atlantic between northeastern Canada and Greenland.' },
];

export const MONUMENT_FEATURES: MonumentFeature[] = [
  { id: 'great-pyramid', name: 'Great Pyramid of Giza', country: 'Egypt', location: 'Giza, Egypt', position: [29.9792, 31.1342], detail: 'Built for Pharaoh Khufu around 4,500 years ago, it is the only surviving wonder of the ancient world.' },
  { id: 'sphinx', name: 'Great Sphinx of Giza', country: 'Egypt', location: 'Giza, Egypt', position: [29.9753, 31.1376], detail: 'A colossal limestone statue with a lion’s body and a human head, guarding the Giza plateau.' },
  { id: 'luxor-temple', name: 'Luxor Temple', country: 'Egypt', location: 'Luxor, Egypt', position: [25.6995, 32.6391], detail: 'An ancient Egyptian temple complex on the east bank of the Nile, expanded by several pharaohs.' },
  { id: 'great-zimbabwe', name: 'Great Zimbabwe', country: 'Zimbabwe', location: 'Masvingo Province, Zimbabwe', position: [-20.267, 30.933], detail: 'The stone-built capital of a powerful medieval African kingdom and the source of Zimbabwe’s name.' },
  { id: 'taj-mahal', name: 'Taj Mahal', country: 'India', location: 'Agra, India', position: [27.1751, 78.0421], detail: 'A white-marble mausoleum commissioned by Mughal emperor Shah Jahan in memory of Mumtaz Mahal.' },
  { id: 'great-wall', name: 'Great Wall of China', country: 'China', location: 'Northern China', position: [40.4319, 116.5704], detail: 'A network of fortifications built and rebuilt over centuries to guard China’s northern frontier.' },
  { id: 'forbidden-city', name: 'Forbidden City', country: 'China', location: 'Beijing, China', position: [39.9163, 116.3972], detail: 'The former imperial palace complex in Beijing, home to Chinese emperors for nearly five centuries.' },
  { id: 'angkor-wat', name: 'Angkor Wat', country: 'Cambodia', location: 'Siem Reap, Cambodia', position: [13.4125, 103.867], detail: 'A vast 12th-century temple complex built by the Khmer Empire and depicted on Cambodia’s flag.' },
  { id: 'borobudur', name: 'Borobudur', country: 'Indonesia', location: 'Central Java, Indonesia', position: [-7.6079, 110.2038], detail: 'A monumental 9th-century Buddhist temple with tiered terraces and carved stone reliefs.' },
  { id: 'petra', name: 'Petra', country: 'Jordan', location: 'Ma’an Governorate, Jordan', position: [30.3285, 35.4444], detail: 'An ancient Nabataean city famous for buildings carved into rose-colored sandstone cliffs.' },
  { id: 'himeji-castle', name: 'Himeji Castle', country: 'Japan', location: 'Himeji, Japan', position: [34.8394, 134.6939], detail: 'A remarkably preserved Japanese hilltop castle known as the White Heron Castle.' },
  { id: 'colosseum', name: 'Colosseum', country: 'Italy', location: 'Rome, Italy', position: [41.8902, 12.4922], detail: 'The ancient Roman amphitheatre that hosted public spectacles and could hold tens of thousands of spectators.' },
  { id: 'eiffel-tower', name: 'Eiffel Tower', country: 'France', location: 'Paris, France', position: [48.8584, 2.2945], detail: 'Built for the 1889 Exposition Universelle, it became one of the most recognizable structures in the world.' },
  { id: 'acropolis', name: 'Acropolis of Athens', country: 'Greece', location: 'Athens, Greece', position: [37.9715, 23.7257], detail: 'An ancient citadel above Athens, home to the Parthenon and other monuments of classical Greece.' },
  { id: 'stonehenge', name: 'Stonehenge', country: 'United Kingdom', location: 'Wiltshire, England', position: [51.1789, -1.8262], detail: 'A prehistoric stone circle built in stages on Salisbury Plain, aligned with the movements of the Sun.' },
  { id: 'sagrada-familia', name: 'Sagrada Família', country: 'Spain', location: 'Barcelona, Spain', position: [41.4036, 2.1744], detail: 'Antoni Gaudí’s monumental basilica, begun in 1882 and still under construction.' },
  { id: 'hagia-sophia', name: 'Hagia Sophia', country: 'Türkiye', location: 'Istanbul, Türkiye', position: [41.0086, 28.9802], detail: 'A landmark built as a Byzantine cathedral in 537 CE, later used as a mosque and museum, and now a mosque.' },
  { id: 'statue-liberty', name: 'Statue of Liberty', country: 'United States', location: 'New York Harbor, United States', position: [40.6892, -74.0445], detail: 'A gift from France dedicated in 1886, widely recognized as a symbol of liberty and welcome.' },
  { id: 'chichen-itza', name: 'Chichén Itzá', country: 'Mexico', location: 'Yucatán, Mexico', position: [20.6843, -88.5678], detail: 'A major Maya city whose best-known monument is the stepped pyramid of El Castillo.' },
  { id: 'machu-picchu', name: 'Machu Picchu', country: 'Peru', location: 'Cusco Region, Peru', position: [-13.1631, -72.545], detail: 'An Inca citadel in the Andes, built in the 15th century and later abandoned.' },
  { id: 'christ-redeemer', name: 'Christ the Redeemer', country: 'Brazil', location: 'Rio de Janeiro, Brazil', position: [-22.9519, -43.2105], detail: 'A 30-metre Art Deco statue of Jesus overlooking Rio de Janeiro from Mount Corcovado.' },
  { id: 'moai', name: 'Rapa Nui Moai', country: 'Chile', location: 'Rapa Nui (Easter Island), Chile', position: [-27.1212, -109.3664], detail: 'Large ancestral statues carved by the Rapa Nui people, many set on ceremonial platforms called ahu.' },
  { id: 'sydney-opera-house', name: 'Sydney Opera House', country: 'Australia', location: 'Sydney, Australia', position: [-33.8568, 151.2153], detail: 'A performing-arts centre recognized for its sail-like roof shells, opened in 1973.' },
  { id: 'uluru', name: 'Uluru', country: 'Australia', location: 'Northern Territory, Australia', position: [-25.3444, 131.0369], detail: 'A massive sandstone formation of deep cultural importance to the Anangu Traditional Owners.' },
  { id: 'kilimanjaro', name: 'Mount Kilimanjaro', country: 'Tanzania', location: 'Northeastern Tanzania', position: [-3.0674, 37.3556], detail: 'Africa’s highest mountain, a dormant volcanic massif rising above the surrounding plains.' },
  { id: 'lalibela', name: 'Rock-Hewn Churches of Lalibela', country: 'Ethiopia', location: 'Lalibela, Ethiopia', position: [12.0319, 39.0473], detail: 'A group of medieval Ethiopian Orthodox churches carved directly into volcanic rock.' },
  { id: 'potala-palace', name: 'Potala Palace', country: 'China', location: 'Lhasa, Tibet', position: [29.6578, 91.1172], detail: 'A historic palace in Lhasa that served as a winter residence of the Dalai Lamas.' },
  { id: 'bagan', name: 'Bagan Temples', country: 'Myanmar', location: 'Bagan, Myanmar', position: [21.1717, 94.8585], detail: 'A broad archaeological landscape containing thousands of Buddhist temples, stupas, and monasteries.' },
  { id: 'alhambra', name: 'Alhambra', country: 'Spain', location: 'Granada, Spain', position: [37.1761, -3.5881], detail: 'A palace and fortress complex built by the Nasrid dynasty, celebrated for its Islamic art and architecture.' },
  { id: 'leaning-tower', name: 'Leaning Tower of Pisa', country: 'Italy', location: 'Pisa, Italy', position: [43.723, 10.3966], detail: 'The freestanding bell tower of Pisa Cathedral, famous for its unintended tilt.' },
];

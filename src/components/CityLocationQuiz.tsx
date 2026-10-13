import React, { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Navigation, RotateCcw, Trophy } from 'lucide-react';
import { CircleMarker, MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import { GeoGuessrLocation } from '../data/outlinesAndGeoData';
import 'leaflet/dist/leaflet.css';

interface CityLocationQuizProps {
  onEarnXP: (amount: number) => void;
}

interface CityLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const CITY_LOCATIONS: CityLocation[] = [
  { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { city: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522 },
  { city: 'Alice Springs', country: 'Australia', latitude: -23.698, longitude: 133.8807 },
  { city: 'Manila', country: 'Philippines', latitude: 14.5995, longitude: 120.9842 },
  { city: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729 },
  { city: 'Windhoek', country: 'Namibia', latitude: -22.5609, longitude: 17.0658 },
  { city: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275 },
  { city: 'Cusco', country: 'Peru', latitude: -13.532, longitude: -71.9675 },
  { city: 'New York City', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { city: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332 },
  { city: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
  { city: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693 },
  { city: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276 },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { city: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405 },
  { city: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { city: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219 },
  { city: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241 },
  { city: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792 },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { city: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018 },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { city: 'Seoul', country: 'South Korea', latitude: 37.5665, longitude: 126.978 },
  { city: 'Auckland', country: 'New Zealand', latitude: -36.8509, longitude: 174.7645 },
  { city: 'Helsinki', country: 'Finland', latitude: 60.1699, longitude: 24.9384 },
  { city: 'Lisbon', country: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
  { city: 'Marrakesh', country: 'Morocco', latitude: 31.6295, longitude: -7.9811 },
  { city: 'Kathmandu', country: 'Nepal', latitude: 27.7172, longitude: 85.324 },
  { city: 'Havana', country: 'Cuba', latitude: 23.1136, longitude: -82.3666 },
  { city: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426 },
  { city: 'Venice', country: 'Italy', latitude: 45.4408, longitude: 12.3155 },
  { city: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681 },
  { city: 'Machu Picchu', country: 'Peru', latitude: -13.1631, longitude: -72.545 },
  { city: 'Petra', country: 'Jordan', latitude: 30.3285, longitude: 35.4444 },
  { city: 'Dar es Salaam', country: 'Tanzania', latitude: -6.7924, longitude: 39.2083 },
  { city: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
];

interface GuessMapProps {
  guess: { lat: number; lon: number } | null;
  target: CityLocation;
  revealed: boolean;
  onGuess: (coords: { lat: number; lon: number }) => void;
}

const GuessMap: React.FC<GuessMapProps> = ({ guess, target, revealed, onGuess }) => {
  useMapEvents({
    click(event) {
      if (!revealed) onGuess({ lat: event.latlng.lat, lon: event.latlng.lng });
    },
  });

  return (
    <>
      {guess && (
        <CircleMarker
          center={[guess.lat, guess.lon]}
          radius={8}
          pathOptions={{ color: '#fff', weight: 2, fillColor: '#ef4444', fillOpacity: 1 }}
        />
      )}
      {revealed && (
        <CircleMarker
          center={[target.latitude, target.longitude]}
          radius={9}
          pathOptions={{ color: '#fff', weight: 2, fillColor: '#10b981', fillOpacity: 1 }}
        />
      )}
      {revealed && guess && (
        <Polyline
          positions={[
            [guess.lat, guess.lon],
            [target.latitude, target.longitude],
          ]}
          pathOptions={{ color: '#f59e0b', dashArray: '8 8', weight: 3 }}
        />
      )}
    </>
  );
};

function distanceKm(
  first: { lat: number; lon: number },
  second: { lat: number; lon: number }
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(second.lat - first.lat);
  const longitudeDelta = radians(second.lon - first.lon);
  const value =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(first.lat))
      * Math.cos(radians(second.lat))
      * Math.sin(longitudeDelta / 2) ** 2;

  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
}

function makeRound(): CityLocation[] {
  return [...CITY_LOCATIONS].sort(() => Math.random() - 0.5).slice(0, 10);
}

export const CityLocationQuiz: React.FC<CityLocationQuizProps> = ({ onEarnXP }) => {
  const [round, setRound] = useState<CityLocation[]>(makeRound);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState<{ lat: number; lon: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const city = round[roundIndex];

  const distance = useMemo(
    () => guess && revealed
      ? distanceKm(guess, { lat: city.latitude, lon: city.longitude })
      : null,
    [city, guess, revealed]
  );

  const handleGuess = () => {
    if (!guess || revealed) return;
    const km = distanceKm(guess, { lat: city.latitude, lon: city.longitude });
    const points = Math.max(0, Math.round(5000 * Math.exp(-km / 2000)));
    setScore((previous) => previous + points);
    setRevealed(true);
    onEarnXP(Math.round(points / 25));
  };

  const handleNext = () => {
    if (roundIndex === round.length - 1) {
      setFinished(true);
      onEarnXP(100);
      return;
    }
    setRoundIndex((previous) => previous + 1);
    setGuess(null);
    setRevealed(false);
  };

  const handleRestart = () => {
    setRound(makeRound());
    setRoundIndex(0);
    setGuess(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 text-center shadow-xl">
        <Trophy className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h2 className="text-3xl font-black text-white">City hunt complete!</h2>
        <p className="mt-3 text-lg text-emerald-300">You scored {score.toLocaleString()} points.</p>
        <button onClick={handleRestart} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500">
          <RotateCcw className="h-4 w-4" /> Play again
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-5 shadow-xl">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
            <MapPin className="h-4 w-4" /> City map challenge · Round {roundIndex + 1} of {round.length}
          </div>
          <h2 className="text-2xl font-black text-white">Find {city.city}, {city.country}</h2>
          <p className="mt-1 text-xs text-slate-400">Use the unlabeled satellite map. Click where you think the city is, then submit your guess.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-emerald-300">{score.toLocaleString()}</div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Points</div>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-700 shadow-xl">
        <div className="h-[420px] sm:h-[560px]">
          <MapContainer
            key={roundIndex}
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={17}
            worldCopyJump
            className="h-full w-full bg-slate-900"
          >
            <TileLayer
              attribution='Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            <GuessMap
              guess={guess}
              target={city}
              revealed={revealed}
              onGuess={setGuess}
            />
          </MapContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="text-sm text-slate-300">
          {revealed && distance !== null
            ? `${distance.toLocaleString()} km from ${city.city}`
            : guess
              ? `Pin set at ${guess.lat.toFixed(2)}, ${guess.lon.toFixed(2)}`
              : 'Click the map to place your guess. Zoom in for a closer look.'}
        </div>
        {!revealed ? (
          <button
            onClick={handleGuess}
            disabled={!guess}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Navigation className="h-4 w-4" /> Guess location
          </button>
        ) : (
          <button onClick={handleNext} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500">
            Next city <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
};

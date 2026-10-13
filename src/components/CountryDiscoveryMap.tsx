import React, { useMemo } from 'react';
import { Feature, Geometry } from 'geojson';
import { CircleMarker, GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { ALL_197_COUNTRIES } from '../data/all197Countries';
import { countryBoundaries, getCountryBoundary } from '../data/worldCountryBoundaries';
import 'leaflet/dist/leaflet.css';

interface CountryDiscoveryMapProps {
  discoveredCountryCodes: ReadonlySet<string>;
}

export const CountryDiscoveryMap: React.FC<CountryDiscoveryMapProps> = ({
  discoveredCountryCodes,
}) => {
  const discoveredBoundaryIds = useMemo(
    () =>
      new Set(
        ALL_197_COUNTRIES
          .filter((country) => discoveredCountryCodes.has(country.code))
          .map((country) => getCountryBoundary(country.code)?.id)
          .filter((id): id is string | number => id != null)
          .map(String)
      ),
    [discoveredCountryCodes]
  );

  const styleCountry = (countryFeature?: Feature<Geometry, { name?: string }>) => {
    const isDiscovered = countryFeature?.id != null
      && discoveredBoundaryIds.has(String(countryFeature.id));

    return {
      color: isDiscovered ? '#34d399' : '#64748b',
      weight: 0.8,
      fillColor: isDiscovered ? '#10b981' : '#f8fafc',
      fillOpacity: isDiscovered ? 0.9 : 1,
    };
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">World Discovery Map</h3>
          <p className="mt-1 text-xs text-slate-400">
            Countries start white and turn green when you name them. Zoom and drag to explore.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-slate-500 bg-white" /> Not found</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Found</span>
        </div>
      </div>
      <div className="h-[320px] overflow-hidden rounded-2xl border border-slate-700 sm:h-[440px]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={8}
          worldCopyJump
          className="h-full w-full bg-slate-200"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={countryBoundaries}
            style={styleCountry}
          />
          {discoveredCountryCodes.has('XK') && (
            <CircleMarker
              center={[42.66, 21.16]}
              radius={6}
              pathOptions={{ color: '#065f46', weight: 1, fillColor: '#10b981', fillOpacity: 1 }}
            />
          )}
          {discoveredCountryCodes.has('TV') && (
            <CircleMarker
              center={[-7.1, 177.65]}
              radius={6}
              pathOptions={{ color: '#065f46', weight: 1, fillColor: '#10b981', fillOpacity: 1 }}
            />
          )}
        </MapContainer>
      </div>
    </section>
  );
};

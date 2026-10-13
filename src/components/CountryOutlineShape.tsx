import React, { useMemo } from 'react';
import { Polygon, Position } from 'geojson';
import { getCountryBoundary } from '../data/worldCountryBoundaries';
import { ALL_197_COUNTRIES } from '../data/all197Countries';

interface CountryOutlineShapeProps {
  countryName: string;
}

function polygonRings(geometry: Polygon | { type: 'MultiPolygon'; coordinates: Position[][][] }): Position[][][] {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
}

function ringArea(ring: Position[]): number {
  return Math.abs(ring.reduce((area, point, index) => {
    const next = ring[(index + 1) % ring.length];
    return area + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2);
}

export const CountryOutlineShape: React.FC<CountryOutlineShapeProps> = ({ countryName }) => {
  const pathData = useMemo(() => {
    const country = ALL_197_COUNTRIES.find((item) => item.name === countryName);
    const boundary = country && getCountryBoundary(country.code);
    if (!boundary?.geometry || !('coordinates' in boundary.geometry)) return null;

    const polygons = polygonRings(boundary.geometry as Polygon | { type: 'MultiPolygon'; coordinates: Position[][][] })
      .map((rings) => rings[0])
      .filter((ring) => ring.length > 2);
    if (polygons.length === 0) return null;

    const polygonsWithArea = polygons.map((ring) => ({ ring, area: ringArea(ring) }));
    const largestArea = Math.max(...polygonsWithArea.map((polygon) => polygon.area));
    const mainRing = polygonsWithArea.find((polygon) => polygon.area === largestArea)!.ring;
    const centerOf = (ring: Position[]) => ring.reduce(
      (center, point) => [center[0] + point[0] / ring.length, center[1] + point[1] / ring.length],
      [0, 0]
    );
    const mainCenter = centerOf(mainRing);
    const relevantRings = polygonsWithArea
      .filter(({ ring, area }) => {
        if (area < largestArea * 0.001) return false;
        const center = centerOf(ring);
        return Math.hypot(center[0] - mainCenter[0], center[1] - mainCenter[1]) < 25;
      })
      .map(({ ring }) => ring);

    const allPoints = relevantRings.flat();
    const latCenter = (Math.min(...allPoints.map((point) => point[1]))
      + Math.max(...allPoints.map((point) => point[1]))) / 2;
    const longitudeScale = Math.max(0.15, Math.cos((latCenter * Math.PI) / 180));
    const projected = allPoints.map(([longitude, latitude]) => [longitude * longitudeScale, -latitude] as const);
    const minX = Math.min(...projected.map(([x]) => x));
    const maxX = Math.max(...projected.map(([x]) => x));
    const minY = Math.min(...projected.map(([, y]) => y));
    const maxY = Math.max(...projected.map(([, y]) => y));
    const width = Math.max(maxX - minX, 0.01);
    const height = Math.max(maxY - minY, 0.01);
    const scale = 88 / Math.max(width, height);
    const offsetX = (100 - width * scale) / 2;
    const offsetY = (100 - height * scale) / 2;

    return relevantRings.map((ring) => ring.map((point, index) => {
      const x = offsetX + (point[0] * longitudeScale - minX) * scale;
      const y = offsetY + (-point[1] - minY) * scale;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ') + ' Z').join(' ');
  }, [countryName]);

  if (!pathData) {
    return <div className="text-sm text-slate-400">Boundary data is unavailable for this country.</div>;
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={`Real outline of ${countryName}`}>
      <path
        d={pathData}
        fill="#115e59"
        stroke="#2dd4bf"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fillRule="evenodd"
        className="drop-shadow-[0_0_8px_rgba(45,212,191,0.45)]"
      />
    </svg>
  );
};

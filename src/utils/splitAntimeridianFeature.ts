import type { Feature, Geometry, Position } from 'geojson';
import * as polygonClipping from 'polygon-clipping';

type NamedCountryFeature = Feature<Geometry, { name?: string }>;

const worldBounds: polygonClipping.Polygon = [[
  [-180, -90],
  [180, -90],
  [180, 90],
  [-180, 90],
  [-180, -90],
]];

function unwrapRing(ring: Position[]): polygonClipping.Ring | null {
  if (ring.length < 4) return null;

  const unwrapped: polygonClipping.Ring = [[ring[0][0], ring[0][1]]];

  for (const point of ring.slice(1, -1)) {
    let longitude = point[0];
    const previousLongitude = unwrapped[unwrapped.length - 1][0];

    while (longitude - previousLongitude > 180) longitude -= 360;
    while (longitude - previousLongitude < -180) longitude += 360;

    unwrapped.push([longitude, point[1]]);
  }

  const firstLongitude = unwrapped[0][0];
  const lastLongitude = unwrapped[unwrapped.length - 1][0];
  if (Math.abs(firstLongitude - lastLongitude) > 180) return null;

  unwrapped.push(unwrapped[0]);
  return unwrapped;
}

function hasAntimeridianEdge(rings: Position[][]): boolean {
  return rings.some((ring) =>
    ring.some((point, index) =>
      index > 0 && Math.abs(point[0] - ring[index - 1][0]) > 180
    )
  );
}

function splitPolygonAtAntimeridian(rings: Position[][]): polygonClipping.MultiPolygon | null {
  const unwrappedRings = rings.map(unwrapRing);
  if (unwrappedRings.some((ring) => ring === null)) return null;

  const polygon = unwrappedRings.filter(
    (ring): ring is polygonClipping.Ring => ring !== null
  );
  const outerCenter = (Math.min(...polygon[0].map(([longitude]) => longitude))
    + Math.max(...polygon[0].map(([longitude]) => longitude))) / 2;

  for (let index = 1; index < polygon.length; index++) {
    const hole = polygon[index];
    const holeCenter = (Math.min(...hole.map(([longitude]) => longitude))
      + Math.max(...hole.map(([longitude]) => longitude))) / 2;
    const shift = 360 * Math.round((outerCenter - holeCenter) / 360);
    polygon[index] = hole.map(([longitude, latitude]) => [longitude + shift, latitude]);
  }

  const longitudes = polygon.flatMap((ring) => ring.map(([longitude]) => longitude));
  const minShift = Math.ceil((-180 - Math.max(...longitudes)) / 360);
  const maxShift = Math.floor((180 - Math.min(...longitudes)) / 360);
  const clippedPolygons: polygonClipping.MultiPolygon = [];

  for (let shiftIndex = minShift; shiftIndex <= maxShift; shiftIndex++) {
    const shift = shiftIndex * 360;
    const shiftedPolygon = polygon.map((ring) =>
      ring.map(([longitude, latitude]) => [longitude + shift, latitude] as polygonClipping.Pair)
    );
    clippedPolygons.push(...polygonClipping.intersection(shiftedPolygon, worldBounds));
  }

  return clippedPolygons;
}

export function splitAntimeridianFeature(feature: NamedCountryFeature): NamedCountryFeature {
  const { geometry } = feature;
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') return feature;

  const sourcePolygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.coordinates;
  const splitPolygons = sourcePolygons.flatMap((polygon) => {
    if (!hasAntimeridianEdge(polygon)) return [polygon as polygonClipping.Polygon];
    const clipped = splitPolygonAtAntimeridian(polygon);
    return clipped?.length ? clipped : [polygon as polygonClipping.Polygon];
  });

  if (splitPolygons.length === 0) return feature;

  return {
    ...feature,
    geometry: splitPolygons.length === 1
      ? { type: 'Polygon', coordinates: splitPolygons[0] }
      : { type: 'MultiPolygon', coordinates: splitPolygons },
  };
}

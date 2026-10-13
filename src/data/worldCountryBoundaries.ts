import { Feature, FeatureCollection, Geometry } from 'geojson';
import isoCountries from 'i18n-iso-countries';
import { feature } from 'topojson-client';
import { GeometryCollection, Topology } from 'topojson-specification';
import worldTopology from 'world-atlas/countries-50m.json';
import { additionalCountryBoundaries } from './additionalCountryBoundaries';
import { splitAntimeridianFeature } from '../utils/splitAntimeridianFeature';

const topology = worldTopology as unknown as Topology;

const standardCountryBoundaries = feature(
  topology,
  topology.objects.countries as GeometryCollection
) as FeatureCollection<Geometry, { name?: string }>;

export const countryBoundaries: FeatureCollection<Geometry, { name?: string }> = {
  type: 'FeatureCollection',
  features: [...standardCountryBoundaries.features, ...additionalCountryBoundaries]
    .map(splitAntimeridianFeature),
};

export function getCountryBoundary(alpha2Code: string): Feature<Geometry, { name?: string }> | undefined {
  const numericCode = isoCountries.alpha2ToNumeric(alpha2Code);
  if (!numericCode) return undefined;

  return countryBoundaries.features.find((country) => String(country.id).padStart(3, '0') === numericCode);
}

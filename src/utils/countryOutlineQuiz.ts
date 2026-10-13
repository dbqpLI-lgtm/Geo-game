import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { COUNTRY_OUTLINES } from '../data/outlinesAndGeoData';
import { DifficultyLevel } from '../context/GameSettingsContext';
import { selectCountryQuizPool } from './countryQuizPool';

export interface CountryOutlineQuestion {
  country: CountryFullItem;
  options: CountryFullItem[];
  hint: string;
  funFact: string;
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[swapIndex]] = [result[swapIndex], result[i]];
  }
  return result;
}

export function createCountryOutlineQuestions(difficulty: DifficultyLevel): CountryOutlineQuestion[] {
  return selectCountryQuizPool(ALL_197_COUNTRIES, difficulty).map((country) => {
    const curatedOutline = COUNTRY_OUTLINES.find((outline) => outline.name === country.name);
    const distractors = shuffled(
      ALL_197_COUNTRIES.filter(
        (candidate) => candidate.code !== country.code && candidate.continent === country.continent
      )
    ).slice(0, 3);

    return {
      country,
      options: shuffled([country, ...distractors]),
      hint: curatedOutline?.hint ?? `Located in ${country.continent}. Its capital is ${country.capital}.`,
      funFact: curatedOutline?.funFact ?? country.funFact,
    };
  });
}

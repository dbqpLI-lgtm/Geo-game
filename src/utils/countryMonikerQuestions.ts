import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { COUNTRY_NICKNAMES_LIST } from '../data/outlinesAndGeoData';
import { DifficultyLevel } from '../context/GameSettingsContext';
import { selectCountryQuizPool, shuffleItems } from './countryQuizPool';

export interface CountryMonikerQuestion {
  country: CountryFullItem;
  clue: string;
  explanation: string;
  isNickname: boolean;
  options: CountryFullItem[];
}

export function createCountryMonikerQuestions(difficulty: DifficultyLevel): CountryMonikerQuestion[] {
  return selectCountryQuizPool(ALL_197_COUNTRIES, difficulty).map((country) => {
    const curated = COUNTRY_NICKNAMES_LIST.find((item) => item.country === country.name);
    const nickname = curated?.nickname ?? country.nickname;
    const otherCountries = shuffleItems(
      ALL_197_COUNTRIES.filter((candidate) => candidate.code !== country.code)
    ).slice(0, 3);

    return {
      country,
      clue: nickname ?? country.funFact,
      explanation: curated?.explanation ?? country.funFact,
      isNickname: Boolean(nickname),
      options: shuffleItems([country, ...otherCountries]),
    };
  });
}

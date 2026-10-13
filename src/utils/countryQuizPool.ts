import { DifficultyLevel } from '../context/GameSettingsContext';
import { CountryFullItem } from '../data/all197Countries';

export function getCountryQuizQuestionCount(difficulty: DifficultyLevel): number {
  if (difficulty === 'easy') return 40;
  if (difficulty === 'medium') return 100;
  return 197;
}

export function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }
  return shuffled;
}

export function selectCountryQuizPool(
  countries: CountryFullItem[],
  difficulty: DifficultyLevel
): CountryFullItem[] {
  return shuffleItems(countries).slice(0, Math.min(getCountryQuizQuestionCount(difficulty), countries.length));
}

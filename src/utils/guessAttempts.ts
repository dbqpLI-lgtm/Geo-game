import { DifficultyLevel } from '../context/GameSettingsContext';

export function getWrongGuessLimit(difficulty: DifficultyLevel): number {
  if (difficulty === 'easy') return 10;
  if (difficulty === 'hard') return 3;
  return 5;
}

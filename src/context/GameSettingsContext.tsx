import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface GameSettingsContextType {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  isLearningMode: boolean;
  setIsLearningMode: (enabled: boolean) => void;
  xpMultiplier: number;
  hintsAllowed: boolean;
  maxHintsPerQuestion: number;
  getTimeLimit: (baseSeconds: number) => number;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(() => {
    try {
      const saved = localStorage.getItem('geomaster_difficulty');
      if (saved === 'easy' || saved === 'medium' || saved === 'hard') return saved;
    } catch {}
    return 'medium';
  });

  const [isLearningMode, setIsLearningModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('geomaster_learning_mode') === 'true';
    } catch {}
    return false;
  });

  const setDifficulty = (level: DifficultyLevel) => {
    setDifficultyState(level);
    try {
      localStorage.setItem('geomaster_difficulty', level);
    } catch {}
  };

  const setIsLearningMode = (enabled: boolean) => {
    setIsLearningModeState(enabled);
    try {
      localStorage.setItem('geomaster_learning_mode', enabled.toString());
    } catch {}
  };

  // XP Multipliers: Easy (1x), Medium (1.25x), Hard (1.75x for masters)
  const xpMultiplier = isLearningMode ? 1.0 : difficulty === 'hard' ? 1.75 : difficulty === 'medium' ? 1.25 : 1.0;

  // Hint Rules:
  // Learning Mode: Unlimited hints & study guides
  // Easy: Free hints available
  // Medium: 1 hint per question
  // Hard: 0 hints allowed!
  const hintsAllowed = isLearningMode || difficulty !== 'hard';
  const maxHintsPerQuestion = isLearningMode ? 99 : difficulty === 'easy' ? 2 : difficulty === 'medium' ? 1 : 0;

  // Time Limit Multiplier:
  // Easy: 1.8x base seconds (or untimed)
  // Medium: 1.0x base seconds
  // Hard: 0.5x base seconds (fast-paced blitz)
  const getTimeLimit = (baseSeconds: number) => {
    if (isLearningMode) return 9999; // effectively untimed
    if (difficulty === 'easy') return Math.round(baseSeconds * 1.8);
    if (difficulty === 'hard') return Math.max(5, Math.round(baseSeconds * 0.5));
    return baseSeconds;
  };

  return (
    <GameSettingsContext.Provider
      value={{
        difficulty,
        setDifficulty,
        isLearningMode,
        setIsLearningMode,
        xpMultiplier,
        hintsAllowed,
        maxHintsPerQuestion,
        getTimeLimit,
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};

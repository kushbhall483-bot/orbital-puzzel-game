/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { Game } from './components/Game';

export type GameScreen = 'menu' | 'level_select' | 'playing';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Migration from old keys
    const oldProgress = localStorage.getItem('colorArrangingProgress');
    const oldCoins = localStorage.getItem('colorArrangingCoins');
    const oldHints = localStorage.getItem('colorArrangingHints');

    if (oldProgress && !localStorage.getItem('orbitalPuzzleProgress')) {
      localStorage.setItem('orbitalPuzzleProgress', oldProgress);
    }
    if (oldCoins && !localStorage.getItem('orbitalPuzzleCoins')) {
      localStorage.setItem('orbitalPuzzleCoins', oldCoins);
    }
    if (oldHints && !localStorage.getItem('orbitalPuzzleHints')) {
      localStorage.setItem('orbitalPuzzleHints', oldHints);
    }

    const savedProgress = localStorage.getItem('orbitalPuzzleProgress');
    if (savedProgress) {
      setUnlockedLevels(parseInt(savedProgress, 10));
    }
    const savedCoins = localStorage.getItem('orbitalPuzzleCoins');
    if (savedCoins) {
      setCoins(parseInt(savedCoins, 10));
    }
    const savedStars = localStorage.getItem('orbitalPuzzleStars');
    if (savedStars) {
      try {
        setLevelStars(JSON.parse(savedStars));
      } catch (e) {
        console.error("Failed to parse stars", e);
      }
    }
  }, []);

  const handleLevelComplete = (reward: number, stars: number) => {
    // Only give coins if it's the first time completing this level
    const isFirstTime = currentLevel >= unlockedLevels;
    
    if (isFirstTime) {
      const newCoins = coins + reward;
      setCoins(newCoins);
      localStorage.setItem('orbitalPuzzleCoins', newCoins.toString());
    }

    // Update stars if better
    const currentStars = levelStars[currentLevel] || 0;
    if (stars > currentStars) {
      const newStars = { ...levelStars, [currentLevel]: stars };
      setLevelStars(newStars);
      localStorage.setItem('orbitalPuzzleStars', JSON.stringify(newStars));
    }

    const nextLevel = currentLevel + 1;

    if (nextLevel > unlockedLevels) {
      setUnlockedLevels(nextLevel);
      localStorage.setItem('orbitalPuzzleProgress', nextLevel.toString());
    }
  };

  const handleSpendCoins = (amount: number) => {
    const newCoins = coins - amount;
    setCoins(newCoins);
    localStorage.setItem('orbitalPuzzleCoins', newCoins.toString());
  };

  const handleResetProgress = () => {
    localStorage.removeItem('orbitalPuzzleProgress');
    localStorage.removeItem('orbitalPuzzleCoins');
    localStorage.removeItem('orbitalPuzzleStars');
    localStorage.removeItem('orbitalPuzzleHints');
    localStorage.removeItem('colorArrangingProgress');
    localStorage.removeItem('colorArrangingCoins');
    localStorage.removeItem('colorArrangingHints');
    setUnlockedLevels(1);
    setCurrentLevel(1);
    setCoins(0);
    setLevelStars({});
  };

  const handleUseHint = () => {
    // Hint logic is now handled per-level in Game.tsx via ads
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-slate-700">
      {screen === 'menu' && (
        <MainMenu 
          onPlay={() => {
            setCurrentLevel(unlockedLevels);
            setScreen('playing');
          }} 
          onLevelSelect={() => setScreen('level_select')} 
          onResetProgress={handleResetProgress}
        />
      )}
      {screen === 'level_select' && (
        <LevelSelect 
          unlockedLevels={unlockedLevels} 
          levelStars={levelStars}
          onSelect={(lvl) => {
            setCurrentLevel(lvl);
            setScreen('playing');
          }}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'playing' && (
        <Game 
          level={currentLevel} 
          isReplay={currentLevel < unlockedLevels}
          coins={coins}
          onUseHint={handleUseHint}
          onSpendCoins={handleSpendCoins}
          onBack={() => setScreen('menu')}
          onLevelComplete={handleLevelComplete}
          onNextLevel={() => setCurrentLevel(prev => prev + 1)}
        />
      )}
    </div>
  );
}

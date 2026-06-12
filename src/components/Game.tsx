import { useState, useEffect, useRef } from 'react';
import { generateLevel, pour, checkWin, getTubeShape, getLevelTime, findHint, isTubeCompleted } from '../lib/gameLogic';
import { Tube } from './Tube';
import { ArrowLeft, RotateCcw, Undo2, Lightbulb, Plus, Coins, Timer, Trophy, XCircle, Play, Star, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { playClick, playTubeSelect, playPour, playWin, playError, playGameOver, playComplete, playTimerWarning } from '../lib/sound';
import { cn } from '../lib/utils';

function GameBackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Orbs - Subtle for gameplay */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
          y: [0, -50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-pink-600/10 blur-[90px]"
      />
    </div>
  );
}

export function Game({ level, isReplay, coins, onUseHint, onSpendCoins, onBack, onLevelComplete, onNextLevel }: { level: number, isReplay: boolean, coins: number, onUseHint: () => void, onSpendCoins: (amount: number) => void, onBack: () => void, onLevelComplete: (reward: number, stars: number) => void, onNextLevel: () => void }) {
  const [state, setState] = useState<string[][]>([]);
  const [history, setHistory] = useState<string[][][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [pouring, setPouring] = useState<{from: number, to: number, color: string, direction: 'left' | 'right', offset: {x: number, y: number}} | null>(null);
  const [reward, setReward] = useState(0);
  const [stars, setStars] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [hint, setHint] = useState<{from: number, to: number} | null>(null);
  const [hintsUsedThisLevel, setHintsUsedThisLevel] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [shakingTube, setShakingTube] = useState<number | null>(null);
  const [undosRemaining, setUndosRemaining] = useState(3);
  
  const tubeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  useEffect(() => {
    startLevel(level);
  }, [level]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !isWon && !isGameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 11) {
            playTimerWarning();
          }
          if (prev <= 1) {
            setIsGameOver(true);
            setTimerActive(false);
            playGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isWon, isGameOver]);

  const startLevel = (lvl: number) => {
    const newState = generateLevel(lvl);
    setState(newState);
    setHistory([]);
    setSelectedTube(null);
    setIsWon(false);
    setIsGameOver(false);
    setPouring(null);
    setReward(0);
    setHint(null);
    setHintsUsedThisLevel(0);
    setUndosRemaining(3);
    const time = getLevelTime(lvl);
    setTimeLeft(time);
    setTimerActive(true);
  };

  const handleTubeClick = (idx: number) => {
    if (isWon || isGameOver || pouring) return;

    const isCompleted = isTubeCompleted(state[idx]);

    if (selectedTube === null) {
      if (state[idx].length > 0 && !isCompleted) {
        playTubeSelect();
        setSelectedTube(idx);
        setHint(null);
      } else if (isCompleted) {
        playError();
        setShakingTube(idx);
        setTimeout(() => setShakingTube(null), 500);
      }
    } else {
      if (selectedTube === idx) {
        playTubeSelect();
        setSelectedTube(null);
      } else {
        const newState = pour(state, selectedTube, idx);
        if (newState) {
          playPour();
          setHint(null);
          
          const fromRect = tubeRefs.current[selectedTube]?.getBoundingClientRect();
          const toRect = tubeRefs.current[idx]?.getBoundingClientRect();
          const direction = (fromRect && toRect && fromRect.left > toRect.left) ? 'left' : 'right';

          setPouring({
            from: selectedTube,
            to: idx,
            color: state[selectedTube][state[selectedTube].length - 1],
            direction,
            offset: { x: 0, y: 0 }
          });
          setSelectedTube(null);
          setHistory([...history, state]);
          
          // Move ball immediately
          setState(newState);
          
          // Check if the target tube just became completed
          const isTargetCompleted = newState[idx].length === 4 && newState[idx].every(c => c === newState[idx][0]);
          const wasTargetCompleted = state[idx].length === 4 && state[idx].every(c => c === state[idx][0]);
          
          if (isTargetCompleted && !wasTargetCompleted) {
            setTimeout(() => {
              playComplete();
            }, 50);
          }
          
          setTimeout(() => {
            setPouring(null);
            if (checkWin(newState)) {
              setIsWon(true);
              setTimerActive(false);
              playWin();
              // Star Rating Logic
              // > 30s: 3 stars
              // 15-30s: 2 stars
              // 5-15s: 1 star
              // <= 5s: 0 stars
              let earnedStars = 0;
              if (timeLeft > 30) earnedStars = 3;
              else if (timeLeft > 15) earnedStars = 2;
              else if (timeLeft > 5) earnedStars = 1;
              setStars(earnedStars);

              // Coin Reward Logic based on stars
              // 1 star: 25, 2 star: 50, 3 star: 75
              let starReward = 0;
              if (earnedStars === 1) starReward = 25;
              else if (earnedStars === 2) starReward = 50;
              else if (earnedStars === 3) starReward = 75;

              const levelReward = isReplay ? 0 : starReward;
              setReward(levelReward);

              onLevelComplete(levelReward, earnedStars);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22d3ee', '#3b82f6', '#818cf8', '#a855f7']
              });
            }
          }, 50);
        } else {
          playError();
          setShakingTube(idx);
          setTimeout(() => setShakingTube(null), 500);
          const isTargetCompleted = state[idx].length === 4 && state[idx].every(c => c === state[idx][0]);
          if (state[idx].length > 0 && !isTargetCompleted) {
            setSelectedTube(idx);
          } else {
            setSelectedTube(null);
          }
        }
      }
    }
  };

  const handleUndo = () => {
    if (history.length > 0 && !isWon && !isGameOver && !pouring && undosRemaining > 0) {
      playClick();
      const prevState = history[history.length - 1];
      setState(prevState);
      setHistory(history.slice(0, -1));
      setSelectedTube(null);
      setUndosRemaining(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    if (history.length > 0 && !pouring) {
      playClick();
      setState(history[0]);
      setHistory([]);
      setSelectedTube(null);
      setIsWon(false);
      setIsGameOver(false);
      setTimeLeft(getLevelTime(level));
      setTimerActive(true);
    }
  };

  const handleAddTube = () => {
    if (!isWon && !isGameOver && !pouring) {
      playClick();
      setHistory([...history, state]);
      setState([...state, []]);
      setHint(null);
    }
  };

  const handleHint = () => {
    if (!isWon && !isGameOver && !pouring && !hint) {
      const suggestedMove = findHint(state);
      if (suggestedMove) {
        playClick();
        if (hintsUsedThisLevel === 0) {
          setHintsUsedThisLevel(1);
          setHint(suggestedMove);
        } else {
          setIsWatchingAd(true);
          // Simulate watching an ad for 2 seconds
          setTimeout(() => {
            setIsWatchingAd(false);
            setHintsUsedThisLevel(prev => prev + 1);
            setHint(suggestedMove);
          }, 2000);
        }
      } else {
        playError();
        alert("No obvious moves left! Try adding a tube or undoing.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full p-1 relative overflow-hidden bg-[#050505]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* New Game Background Animation */}
      <GameBackgroundAnimation />

      <div className="flex items-center justify-between mb-1 z-20 bg-[#050505]/80 backdrop-blur-xl py-1 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] -mx-4 px-4 sticky top-0">
        <button onClick={() => { playClick(); onBack(); }} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          LEVEL {level}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white font-bold text-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <Timer size={14} />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 px-3 py-1 rounded-full text-yellow-400 font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Coins size={16} className="fill-yellow-500/50" />
            <span className="text-[15px]">{coins}</span>
          </div>
          <button 
            onClick={handleAddTube}
            disabled={isWon || isGameOver || !!pouring}
            className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-colors text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            title="Add Tube"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 z-10 relative overflow-y-auto scrollbar-hide pt-4 pb-4">
        <div className="min-h-full flex flex-col justify-center">
          <div className={cn(
            "flex flex-wrap justify-center max-w-7xl w-full mx-auto px-2 overflow-visible",
            state.length >= 15 ? "gap-x-1 gap-y-2 md:gap-x-2 md:gap-y-4 lg:gap-x-3 lg:gap-y-6" : 
            state.length >= 12 ? "gap-x-1.5 gap-y-3 md:gap-x-3 md:gap-y-6 lg:gap-x-4 lg:gap-y-8" : 
            state.length >= 7 ? "gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-8 lg:gap-x-6 lg:gap-y-10" : 
            "gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:gap-x-8 md:gap-y-12 lg:gap-x-10 lg:gap-y-16"
          )}>
          {state.map((tube, idx) => {
            let pourState: 'idle' | 'pouring-left' | 'pouring-right' | 'receiving' = 'idle';
            if (pouring) {
              if (pouring.from === idx) pourState = `pouring-${pouring.direction}` as any;
              if (pouring.to === idx) pourState = 'receiving';
            }

            const isElevated = selectedTube === idx || pouring?.from === idx;
            const isHintedFrom = hint?.from === idx;
            const isHintedTo = hint?.to === idx;
            const isCompleted = tube.length === 4 && tube.every(c => c === tube[0]);
            
            let tubeSize: 'normal' | 'small' | 'tiny' | 'micro' = 'normal';
            if (state.length >= 15) tubeSize = 'micro';
            else if (state.length >= 12) tubeSize = 'tiny';
            else if (state.length >= 7) tubeSize = 'small';

            return (
              <div 
                key={idx} 
                ref={el => { tubeRefs.current[idx] = el; }}
                className="relative mt-1"
                style={{ zIndex: isElevated ? 50 : 1 }}
              >
                <Tube 
                  colors={tube} 
                  isSelected={selectedTube === idx}
                  onClick={() => handleTubeClick(idx)}
                  shape={getTubeShape(level)}
                  pourState={pourState}
                  pourOffset={pouring?.from === idx ? pouring.offset : undefined}
                  isCompleted={isCompleted}
                  size={tubeSize}
                  isShaking={shakingTube === idx}
                />
                {isCompleted && (
                  <motion.div 
                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                    animate={{ y: -30, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }}
                    transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <span className="text-white font-black text-xs tracking-widest bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      COMPLETE!
                    </span>
                  </motion.div>
                )}
                {(isHintedFrom || isHintedTo) && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    {isHintedFrom ? 'From' : 'To'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>

      <div className="flex justify-center gap-6 mt-2 mb-6 z-10">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleRestart}
            disabled={history.length === 0 || isWon || isGameOver || !!pouring}
            className="p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full disabled:opacity-30 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white"
          >
            <RotateCcw size={24} />
          </button>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Reset</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleUndo}
            disabled={history.length === 0 || isWon || isGameOver || !!pouring || undosRemaining <= 0}
            className="p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full disabled:opacity-30 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white relative"
          >
            <Undo2 size={24} />
            {undosRemaining > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0a] shadow-lg">
                {undosRemaining}
              </span>
            )}
          </button>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Undo</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            className="p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full disabled:opacity-30 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white relative"
            disabled={isWon || isGameOver || !!pouring || !!hint}
            onClick={handleHint}
            title={hintsUsedThisLevel === 0 ? "Free Hint" : "Watch Ad for Hint"}
          >
            <div className="flex items-center justify-center h-6 min-w-[24px]">
              {hintsUsedThisLevel > 0 ? (
                <div className="flex items-center gap-1">
                  <Play size={18} className={hint ? "text-yellow-400" : "text-white"} fill="currentColor" />
                  <Lightbulb size={18} className={hint ? "text-yellow-400 animate-pulse" : "text-white"} />
                </div>
              ) : (
                <Lightbulb size={24} className={hint ? "text-yellow-400 animate-pulse" : "text-white"} />
              )}
            </div>
          </button>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Hint</span>
        </div>
      </div>

      {isWatchingAd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-bold text-lg">Watching Ad...</p>
            <p className="text-white/50 text-sm">Please wait to receive your hint.</p>
          </div>
        </div>
      )}

      {isGameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-2xl z-50 p-6"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-[#0a0a0a] p-8 rounded-[2.5rem] text-center border border-red-500/20 max-w-[280px] w-full shadow-[0_0_80px_rgba(239,68,68,0.15)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full" />
            
            {/* Back Button (Cross) */}
            <button 
              onClick={() => { playClick(); onBack(); }}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
            >
              <XCircle size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 mb-4"
            >
              <Timer size={32} className="text-red-500" />
            </motion.div>

            <div className="space-y-1 mb-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                TIME'S UP
              </h2>
              <p className="text-red-500/60 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Mission Failed</p>
            </div>

            <div className="flex flex-col gap-3 w-full relative z-10">
              <button 
                onClick={() => { 
                  if (coins >= 50) {
                    playClick(); 
                    onSpendCoins(50);
                    setTimeLeft(prev => prev + 60);
                    setIsGameOver(false);
                    setTimerActive(true);
                  }
                }}
                disabled={coins < 50}
                className="group relative w-full py-4 px-6 bg-red-500 text-white rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
              >
                <Timer size={18} />
                <span>+60S (50 <Coins size={14} className="inline" />)</span>
              </button>
              <button 
                onClick={() => { playClick(); startLevel(level); }}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-2xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isWon && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-2xl z-50 p-6"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-[#0a0a0a] p-8 rounded-[2.5rem] text-center border border-white/5 max-w-[280px] w-full shadow-[0_0_80px_rgba(34,211,238,0.15)] overflow-hidden"
          >
            {/* Animated background glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full animate-pulse delay-700" />

            {/* Victory Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] border-2 border-white/20 mb-4"
            >
              <Trophy size={32} className="text-white" />
            </motion.div>

            {/* Back Button (Cross) */}
            <button 
              onClick={() => { playClick(); onBack(); }}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
            >
              <XCircle size={24} />
            </button>

            <div className="space-y-1 mb-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                CLEARED
              </h2>
              <div className="flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={cn(
                      "transition-all duration-500",
                      i < stars ? "fill-cyan-400 text-cyan-400 scale-110" : "fill-white/10 text-white/10"
                    )} 
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-bold">
                {isReplay ? "Replay Mode" : "Reward"}
              </p>
              <div className={cn(
                "flex items-center justify-center gap-2 font-black text-2xl",
                isReplay ? "text-white/20" : "text-cyan-400"
              )}>
                <span>+{reward}</span>
                <Coins size={20} />
              </div>
              {isReplay && (
                <p className="text-[8px] text-white/20 mt-1 uppercase font-bold tracking-tighter">
                  Coins already collected
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full relative z-10">
              <button 
                onClick={() => { playClick(); onNextLevel(); }}
                className="group relative w-full py-4 px-6 bg-white text-black rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <Play size={20} fill="currentColor" />
                  <span className="tracking-tighter">NEXT LEVEL</span>
                </div>
              </button>
              <button 
                onClick={() => { playClick(); startLevel(level); }}
                className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl font-bold text-sm transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Replay
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

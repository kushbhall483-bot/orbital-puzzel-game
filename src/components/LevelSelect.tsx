import { ArrowLeft, Lock, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { playClick } from '../lib/sound';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.8 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

export function LevelSelect({ unlockedLevels, levelStars, onSelect, onBack }: { unlockedLevels: number, levelStars: Record<number, number>, onSelect: (lvl: number) => void, onBack: () => void }) {
  const totalLevels = 250;
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  // Calculate total stars including legacy completed levels
  const totalStars = levels.reduce((acc, level) => {
    const isCompleted = level < unlockedLevels;
    const starsEarned = levelStars[level] !== undefined ? levelStars[level] : (isCompleted ? 3 : 0);
    return acc + starsEarned;
  }, 0);

  return (
    <div className="flex flex-col h-[100dvh] w-full p-6 relative overflow-hidden bg-[#050505]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.05),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05),transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Floating Bubbles Background */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          animate={{
            y: [0, -50, 0],
            x: [0, Math.cos(i) * 20, 0],
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
          style={{
            width: `${60 + i * 30}px`,
            height: `${60 + i * 30}px`,
            left: `${15 + i * 20}%`,
            top: `${10 + i * 20}%`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: 'inset 0 0 15px rgba(255,255,255,0.03)'
          }}
        />
      ))}

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#050505]/60 backdrop-blur-2xl py-6 z-30 border-b border-white/5 -mx-6 px-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playClick(); onBack(); }} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all mr-5 text-white/70 hover:text-white border border-white/10"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
              LEVELS
            </h1>
            <p className="text-xs text-white/90 font-bold tracking-widest mt-1 uppercase">
              {unlockedLevels} / {totalLevels} UNLOCKED
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <Star size={18} className="text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-lg font-black text-white">
            {totalStars}
          </span>
        </div>
      </div>

      {/* Levels Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-6 pb-20 overflow-y-auto z-10 custom-scrollbar pr-2"
      >
        {levels.map(level => {
          const isUnlocked = level <= unlockedLevels;
          const isCompleted = level < unlockedLevels;
          const isCurrent = level === unlockedLevels;
          
          // Legacy support: if a level is completed but has no star record, assume 3 stars
          const starsEarned = levelStars[level] !== undefined ? levelStars[level] : (isCompleted ? 3 : 0);
          
          return (
            <motion.button
              variants={itemVariants}
              whileHover={isUnlocked ? { scale: 1.08, y: -5 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              key={level}
              disabled={!isUnlocked}
              onClick={() => { playClick(); onSelect(level); }}
              className={cn(
                "group relative aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all border-2",
                isUnlocked 
                  ? "bg-gradient-to-br from-white/10 to-white/5 border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]" 
                  : "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              {/* Glow Effect for Unlocked */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              )}
              
              {/* Current Level Highlight */}
              {isCurrent && (
                <div className="absolute -inset-1 bg-cyan-500/20 blur-md rounded-[2.2rem] animate-pulse" />
              )}

              <span className={cn(
                "text-3xl font-black tracking-tighter relative z-10 flex flex-col items-center gap-2",
                isUnlocked ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" : "opacity-60"
              )}>
                {!isUnlocked && <Lock size={16} className="mb-1" />}
                {level}
              </span>
              
              {isCompleted && (
                <div className="flex gap-0.5 mt-1 opacity-100 transition-opacity">
                  {[...Array(3)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={cn(
                        "transition-all duration-300",
                        i < starsEarned ? "text-cyan-400 fill-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "text-white/20"
                      )} 
                    />
                  ))}
                </div>
              )}

              {/* Decorative Corner */}
              {isUnlocked && (
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

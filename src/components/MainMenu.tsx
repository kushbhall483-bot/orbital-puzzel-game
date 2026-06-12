import { Play, Grid, Coins, Sparkles, Lightbulb, Settings, Volume2, VolumeX, RotateCcw, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { playClick, getSoundEnabled, setSoundEnabled } from '../lib/sound';

function HeroBall({ color, delay, index }: { color: string, delay: number, index: number, key?: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut",
        delay: delay + (index * 0.3)
      }}
      className="w-8 h-8 rounded-full relative mx-auto mb-1 shadow-lg"
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color} 0%, ${color} 40%, #000 100%)`,
        boxShadow: `inset -4px -4px 8px rgba(0,0,0,0.6), inset 4px 4px 8px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Glossy Highlight - Top Crescent */}
      <div className="absolute top-[10%] left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[0.5px] opacity-90" />
      
      {/* Sparkle Dot */}
      <div className="absolute top-[18%] left-[25%] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] opacity-100" />
      
      {/* Inner Glow Bottom */}
      <div className="absolute bottom-[10%] left-[20%] right-[20%] h-[20%] bg-white/20 rounded-full blur-[1px]" />
      
      {/* Glassy Overlay */}
      <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_0_5px_rgba(255,255,255,0.2)]" />
    </motion.div>
  );
}

function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          y: [0, -100, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-pink-600/10 blur-[90px]"
      />

      {/* Animated Grid */}
      <motion.div 
        animate={{ y: [0, 30] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]"
      />

      {/* Floating Geometric Shapes */}
      {[...Array(15)].map((_, i) => {
        const isCircle = i % 2 === 0;
        return (
          <motion.div
            key={`shape-${i}`}
            className={`absolute border border-white/10 ${isCircle ? 'rounded-full' : 'rounded-md'} backdrop-blur-sm bg-white/5`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: Math.random() * 0.3 + 0.1,
              scale: Math.random() * 0.5 + 0.5,
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              rotate: 0
            }}
            animate={{
              y: [null, Math.random() * -300 - 100],
              x: [null, (Math.random() - 0.5) * 200],
              rotate: [0, 360],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        );
      })}

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.6 + 0.2,
            scale: Math.random() * 0.6 + 0.8
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            boxShadow: "0 0 10px 3px rgba(34, 211, 238, 0.5)"
          }}
        />
      ))}
    </div>
  );
}

function HeroAnimation() {
  const ballColors = ['#22d3ee', '#818cf8', '#c084fc', '#f472b6'];
  
  return (
    <div className="relative w-[30vh] h-[30vh] max-w-64 max-h-64 mb-4 flex items-center justify-center pointer-events-none z-10">
      {/* Central Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 bg-cyan-500/30 rounded-full blur-[40px]"
      />

      {/* Rotating Neon Rings */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute w-72 h-72 border-[2px] border-cyan-400/30 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.2),inset_0_0_20px_rgba(34,211,238,0.2)]"
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="absolute w-60 h-60 border-[2px] border-purple-500/40 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.3),inset_0_0_15px_rgba(168,85,247,0.3)] border-dashed"
      />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 border border-pink-500/30 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.2)]"
      />
      
      {/* Floating Glass Shards */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          animate={{
            y: [0, -50, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.3, 0.8]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut"
          }}
          style={{ 
            left: `${15 + i * 15}%`, 
            top: `${15 + i * 12}%`,
            clipPath: i % 3 === 0 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
              : i % 3 === 1 
                ? 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
                : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
      ))}

      {/* Left Tube */}
      <div className="absolute -left-2 bottom-10 w-14 h-40 z-20">
        <div className="absolute top-[-6px] left-[-3px] right-[-3px] h-4 rounded-[50%] border-[3px] border-white bg-white/40 z-40 shadow-[0_0_20px_rgba(255,255,255,0.9),inset_0_2px_8px_rgba(255,255,255,1)]" />
        <div className="absolute inset-0 border-[3px] border-t-0 border-white/90 rounded-b-full bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md overflow-hidden shadow-[inset_0_0_25px_rgba(255,255,255,0.8),0_15px_35px_rgba(0,0,0,0.5)] p-1 flex flex-col-reverse justify-start">
          <div className="absolute left-1 top-1 bottom-2 w-2 bg-gradient-to-b from-white to-white/0 rounded-full blur-[1px] z-30" />
          {ballColors.map((color, idx) => (
            <HeroBall key={idx} color={color} index={idx} delay={0} />
          ))}
        </div>
      </div>

      {/* Right Tube */}
      <div className="absolute -right-2 bottom-10 w-14 h-40 z-10">
        <div className="absolute top-[-6px] left-[-3px] right-[-3px] h-4 rounded-[50%] border-[3px] border-white bg-white/40 z-40 shadow-[0_0_20px_rgba(255,255,255,0.9),inset_0_2px_8px_rgba(255,255,255,1)]" />
        <div className="absolute inset-0 border-[3px] border-t-0 border-white/90 rounded-b-full bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md overflow-hidden shadow-[inset_0_0_25px_rgba(255,255,255,0.8),0_15px_35px_rgba(0,0,0,0.5)] p-1 flex flex-col-reverse justify-start">
          <div className="absolute left-1 top-1 bottom-2 w-2 bg-gradient-to-b from-white to-white/0 rounded-full blur-[1px] z-30" />
          {ballColors.map((color, idx) => (
            <HeroBall key={idx} color={color} index={idx} delay={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MainMenu({ onPlay, onLevelSelect, onResetProgress }: { onPlay: () => void, onLevelSelect: () => void, onResetProgress: () => void }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [soundEnabled, setSoundState] = useState(true);

  useEffect(() => {
    setSoundState(getSoundEnabled());
  }, []);

  const toggleSound = () => {
    playClick();
    const newState = !soundEnabled;
    setSoundState(newState);
    setSoundEnabled(newState);
  };

  const handleReset = () => {
    playClick();
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      onResetProgress();
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-4 relative overflow-hidden bg-[#050505]">
      <BackgroundAnimation />
      
      {/* Help Button */}
      <button 
        onClick={() => { playClick(); setIsInfoOpen(true); }}
        className="absolute top-6 left-6 z-50 p-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 rounded-full transition-all hover:-rotate-12 active:scale-95 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] active:shadow-[0_0_30px_rgba(34,211,238,0.8)] active:border-cyan-400/50"
      >
        <HelpCircle size={28} />
      </button>

      {/* Settings Button */}
      <button 
        onClick={() => { playClick(); setIsSettingsOpen(true); }}
        className="absolute top-6 right-6 z-50 p-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 rounded-full transition-all hover:rotate-90 active:scale-95 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] active:shadow-[0_0_30px_rgba(34,211,238,0.8)] active:border-cyan-400/50"
      >
        <Settings size={28} />
      </button>

      {/* Help Modal */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, y: 40, opacity: 0, rotateX: -15 }}
              transition={{ type: "spring", damping: 20, stiffness: 350 }}
              style={{ perspective: 1000 }}
              className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] w-full max-w-md flex flex-col gap-4 shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-[2px]" />
              
              <button 
                onClick={() => { playClick(); setIsInfoOpen(false); }}
                className="absolute top-3 right-3 p-2 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-1">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  HOW TO PLAY
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>

              <div className="space-y-3 text-white/80">
                {/* Rules Section */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                  <h3 className="text-lg font-bold text-cyan-400 mb-1.5 flex items-center gap-2">
                    <Play size={18} /> Basic Rules
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm ml-1">
                    <li>Tap a tube to select the top ball.</li>
                    <li>Tap another tube to move the selected ball into it.</li>
                    <li>You can only place a ball on top of another ball if they match in color.</li>
                    <li>Empty tubes can accept any color ball.</li>
                  </ul>
                </div>

                {/* Winning & Hidden Balls Section */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                  <h3 className="text-lg font-bold text-purple-400 mb-1.5 flex items-center gap-2">
                    <Sparkles size={18} /> Winning & Hidden Balls
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm ml-1">
                    <li>Fill a tube with 4 balls of the same color to complete it.</li>
                    <li>Complete all colors to win the level!</li>
                    <li><strong>Hidden Balls (?):</strong> Starting at Level 3, some balls are hidden. Move the ball above them to reveal their color.</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => { playClick(); setIsInfoOpen(false); }}
                className="w-full py-3 mt-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base tracking-wide transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                GOT IT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, y: 40, opacity: 0, rotateX: -15 }}
              transition={{ type: "spring", damping: 20, stiffness: 350 }}
              style={{ perspective: 1000 }}
              className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 p-8 rounded-[2.5rem] w-full max-w-sm flex flex-col items-center gap-8 shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 blur-[2px]" />
              
              <button 
                onClick={() => { playClick(); setIsSettingsOpen(false); }}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest drop-shadow-lg mt-2">
                SETTINGS
              </h2>
              
              <div className="w-full flex flex-col gap-5 mt-2">
                <motion.button 
                  initial={{ opacity: 0, x: -40, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.15, duration: 0.5, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)", boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSound}
                  className="flex items-center justify-between w-full p-5 bg-white/5 border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-xl font-bold text-white tracking-wide relative z-10 transition-colors">Sound Effects</span>
                  <div className="relative z-10">
                    {soundEnabled ? <Volume2 size={28} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" /> : <VolumeX size={28} className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />}
                  </div>
                </motion.button>

                <motion.button 
                  initial={{ opacity: 0, x: -40, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.25, duration: 0.5, type: "spring", bounce: 0.4 }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(239,68,68,0.15)",
                    boxShadow: "0 0 30px rgba(239,68,68,0.4)",
                    borderColor: "rgba(239,68,68,0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center justify-between w-full p-5 bg-red-500/10 border border-red-500/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative overflow-hidden group"
                >
                  {/* Animated warning stripes background on hover */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.1)_10px,rgba(239,68,68,0.1)_20px)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="text-xl font-black text-red-400 group-hover:text-red-200 tracking-wider relative z-10 transition-colors">RESET PROGRESS</span>
                  
                  <div className="relative z-10">
                    <RotateCcw size={28} className="text-red-400 group-hover:text-red-200 group-hover:-rotate-180 transition-all duration-700 ease-in-out drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-600/10 blur-[80px] rounded-full pointer-events-none will-change-transform" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none will-change-transform" 
      />

      <HeroAnimation />

      <div className="mb-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
          <Sparkles className="text-cyan-400" size={24} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white text-center tracking-tighter leading-[0.85] will-change-transform">
            ORBITAL<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-400 to-blue-600">PUZZLE</span>
          </h1>
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[2px] will-change-transform"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
        className="flex flex-col gap-5 w-full max-w-xs z-10 px-4"
      >
        <button 
          onClick={() => { playClick(); onPlay(); }}
          className="group relative flex items-center justify-center gap-4 w-full py-5 rounded-[2rem] font-black text-xl transition-all hover:scale-[1.05] active:scale-[0.95] overflow-hidden bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-4 group-hover:text-white transition-colors duration-300">
            <Play fill="currentColor" size={24} /> 
            <span className="tracking-tighter">PLAY NOW</span>
          </div>
        </button>

        <button 
          onClick={() => { playClick(); onLevelSelect(); }}
          className="group relative flex items-center justify-center gap-4 w-full py-5 rounded-[2rem] font-black text-xl transition-all hover:scale-[1.05] active:scale-[0.95] overflow-hidden bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-4 group-hover:text-white transition-colors duration-300">
            <Grid size={24} className="group-hover:rotate-90 transition-transform duration-500" /> 
            <span className="tracking-tighter">LEVEL SELECT</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
}

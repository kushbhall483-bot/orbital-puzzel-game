import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { TubeShape } from '../lib/gameLogic';
import { useRef, useEffect } from 'react';

interface TubeProps {
  key?: number | string;
  colors: string[];
  isSelected: boolean;
  onClick: () => void;
  shape: TubeShape;
  pourState?: 'idle' | 'pouring-left' | 'pouring-right' | 'receiving';
  pourOffset?: { x: number, y: number };
  isCompleted?: boolean;
  size?: 'normal' | 'small' | 'tiny' | 'micro';
  isShaking?: boolean;
}

const shapeClasses = {
  normal: "rounded-b-full",
  flat: "rounded-b-2xl",
  beaker: "rounded-b-md"
};

function BallSlot({ color, index, size }: { color: string, index: number, size?: 'normal' | 'small' | 'tiny' | 'micro', key?: any }) {
  const ballSizes = {
    normal: "w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14",
    small: "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
    tiny: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8",
    micro: "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
  };

  const isHidden = color.startsWith('?');
  const actualColor = isHidden ? '#404040' : color;

  const textSizes = {
    normal: "text-lg sm:text-xl md:text-xl lg:text-2xl",
    small: "text-sm sm:text-base md:text-base lg:text-lg",
    tiny: "text-xs md:text-sm lg:text-sm",
    micro: "text-[10px] md:text-xs lg:text-xs"
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 800, 
        damping: 20,
        delay: index * 0.01 
      }}
      className={cn(
        "rounded-full relative mx-auto mb-1 last:mb-0 flex items-center justify-center",
        ballSizes[size || 'normal']
      )}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${actualColor} 0%, ${actualColor} 40%, #000 100%)`,
        boxShadow: `inset -3px -3px 6px rgba(0,0,0,0.6), inset 3px 3px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Glossy Highlight - Top Crescent */}
      <div className="absolute top-[10%] left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[0.5px] opacity-90" />
      
      {/* Sparkle Dot */}
      <div className="absolute top-[18%] left-[25%] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] opacity-100" />
      
      {/* Inner Glow Bottom */}
      <div className="absolute bottom-[10%] left-[20%] right-[20%] h-[20%] bg-white/20 rounded-full blur-[2px]" />
      
      {/* Glassy Overlay */}
      <div className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]" />

      {isHidden && (
        <span className={cn("relative z-10 text-white/80 font-bold drop-shadow-md", textSizes[size || 'normal'])}>?</span>
      )}
    </motion.div>
  );
}

export function Tube({ colors, isSelected, onClick, shape, pourState = 'idle', pourOffset, isCompleted, size = 'normal', isShaking }: TubeProps) {
  const slots = [0, 1, 2, 3];
  const currentShapeClass = shapeClasses[shape];

  const tubeSizes = {
    normal: "w-12 h-44 sm:w-14 sm:h-52 md:w-14 md:h-52 lg:w-16 lg:h-60",
    small: "w-9 h-32 sm:w-10 sm:h-38 md:w-11 md:h-40 lg:w-12 lg:h-44",
    tiny: "w-7 h-24 sm:w-8 sm:h-30 md:w-9 md:h-32 lg:w-10 lg:h-36",
    micro: "w-6 h-20 sm:w-7 sm:h-24 md:w-8 md:h-28 lg:w-9 lg:h-32"
  };

  let animateProps = {};
  if (isShaking) {
    animateProps = { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } };
  } else if (pourOffset) {
    animateProps = { 
      x: pourOffset.x, 
      y: pourOffset.y, 
      rotate: 0,
      scale: 1.05
    };
  } else if (isSelected) {
    animateProps = { y: -16, scale: 1.05, rotate: 0, x: 0 };
  } else {
    animateProps = { y: 0, scale: 1, rotate: 0, x: 0 };
  }

  return (
    <motion.div 
      animate={animateProps}
      transition={{ type: 'spring', stiffness: 4000, damping: 40, mass: 0.1 }}
      className={cn(
        "relative cursor-pointer flex flex-col-reverse origin-center",
        tubeSizes[size],
        "bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-md border-[2px] border-t-0 border-white/40",
        "shadow-[inset_0_0_15px_rgba(255,255,255,0.2),inset_4px_0_10px_rgba(255,255,255,0.4),inset_-4px_0_10px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.3)]",
        currentShapeClass,
        isSelected ? "shadow-[0_0_30px_rgba(255,255,255,0.6)] border-white/80" : "",
        pourState !== 'idle' ? "z-50" : "z-10"
      )}
      onClick={onClick}
    >
      {/* Strong left highlight */}
      <div className={cn("absolute top-1 bottom-1 left-0.5 w-1.5 bg-gradient-to-b from-white/90 to-white/10 blur-[1px] z-30 pointer-events-none", currentShapeClass)} />
      {/* Right shadow */}
      <div className={cn("absolute top-1 bottom-1 right-0 w-2 bg-gradient-to-b from-black/20 to-transparent blur-[2px] z-30 pointer-events-none", currentShapeClass)} />
      
      {/* Tube Rim */}
      <div className="absolute top-[-4px] left-[-2px] right-[-2px] h-3 rounded-[50%] border-[2px] border-white/80 bg-white/20 z-40 shadow-[0_2px_5px_rgba(0,0,0,0.2),inset_0_1px_3px_rgba(255,255,255,0.8)]" />
      
      {isCompleted && (
        <div className={cn("absolute inset-0 z-50 pointer-events-none overflow-hidden", currentShapeClass)}>
          <motion.div 
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: "100%", opacity: [1, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1], ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 bg-white/40"
          />
          {/* Tiny sparkles that rise with the brightness */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: `${10 + Math.random() * 80}%`, 
                y: "100%", 
                opacity: 0, 
                scale: 0 
              }}
              animate={{ 
                y: "-20%", 
                opacity: [0, 1, 1, 0], 
                scale: [0, 1.2, 1, 0],
                rotate: 45
              }}
              transition={{ 
                duration: 0.7, 
                delay: Math.random() * 0.3,
                ease: "easeOut" 
              }}
              className="absolute w-1 h-1 bg-white rounded-sm shadow-[0_0_4px_white]"
            />
          ))}
        </div>
      )}

      <div className={cn("absolute bottom-1 left-0 right-0 top-2 flex flex-col-reverse justify-start overflow-hidden z-10 p-1", currentShapeClass)}>
        {colors.map((color, idx) => (
          <BallSlot 
            key={`${idx}-${color}`}
            color={color}
            index={idx}
            size={size}
          />
        ))}
      </div>
    </motion.div>
  );
}

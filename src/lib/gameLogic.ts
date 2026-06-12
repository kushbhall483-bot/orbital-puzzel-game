const COLORS = [
  '#00B0FF', // 1. Sky Blue (Requested)
  '#FF4081', // 2. Bright Pink (Requested)
  '#FFEA00', // 3. Lemon Yellow (Requested)
  '#9E9E9E', // 4. Cool Grey (Requested)
  '#1DE9B6', // 5. Mint Green
  '#7C4DFF', // 6. Deep Lavender
  '#FFAB40', // 7. Soft Orange / Peach
  '#FF5252', // 8. Coral Red
  '#00E5FF', // 9. Aqua Cyan
  '#64DD17', // 10. Poison Green
  '#D500F9', // 11. Neon Purple
  '#FFD600', // 12. Golden Yellow
  '#00BFA5', // 13. Teal
  '#3D5AFE', // 14. Royal Blue
  '#FF6D00', // 15. Burnt Orange
  '#AA00FF', // 16. Violet
  '#C6FF00', // 17. Lime Volt
  '#00C853', // 18. Emerald
  '#304FFE', // 19. Cobalt
  '#FF3D00', // 20. Vermillion
  '#0091EA', // 21. Azure
  '#6200EA', // 22. Indigo
  '#00B8D4', // 23. Turquoise
  '#607D8B', // 24. Blue Grey
];

// Simple seeded random generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export type TubeShape = 'normal' | 'flat' | 'beaker';

export function isTubeCompleted(tube: string[]): boolean {
  if (tube.length !== 4) return false;
  const color = tube[0];
  if (color.startsWith('?')) return false; // If the bottom ball is hidden, it's not completed
  return tube.every(c => c === color);
}

export function getTubeShape(level: number): TubeShape {
  if (level <= 5) return 'normal';
  if (level <= 15) return 'flat';
  if (level <= 30) return 'beaker';
  return level % 3 === 0 ? 'beaker' : level % 2 === 0 ? 'flat' : 'normal';
}

export function getLevelConfig(level: number) {
  // Start with 3 colors at level 1
  // Add a new color every 3 levels to make the game progressively harder
  const colors = Math.min(20, 3 + Math.floor((level - 1) / 3));
  
  // Give exactly 2 empty tubes as requested
  const emptyTubes = 2;
  
  const tubes = colors + emptyTubes;
  
  return { colors, tubes };
}

export function getLevelTime(level: number): number {
  const { colors } = getLevelConfig(level);
  // Starting levels (3 colors) will have exactly 60 seconds
  // Harder levels will increase by 15 seconds per additional color for more breathing room
  const baseTime = 15;
  const timePerColor = 15;
  
  return baseTime + (colors * timePerColor);
}

export function generateLevel(level: number): string[][] {
  const { colors, tubes } = getLevelConfig(level);
  
  // Use a fixed set of colors based on the level to ensure "new" colors appear as you progress
  // We don't shuffle the whole array, just take the first 'colors' elements
  const activeColors = COLORS.slice(0, colors);
  
  let allUnits: string[] = [];
  for (let c of activeColors) {
    for (let i = 0; i < 4; i++) {
      allUnits.push(c);
    }
  }

  // Shuffle with seed to keep levels consistent
  let seed = level * 1234.567;
  for (let i = allUnits.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed++) * (i + 1));
    [allUnits[i], allUnits[j]] = [allUnits[j], allUnits[i]];
  }

  let state: string[][] = [];
  let unitIdx = 0;
  for (let i = 0; i < tubes; i++) {
    if (i < colors) {
      state.push([allUnits[unitIdx++], allUnits[unitIdx++], allUnits[unitIdx++], allUnits[unitIdx++]]);
    } else {
      state.push([]);
    }
  }

  // Add hidden balls for level >= 3
  if (level >= 3) {
    // Level 3 starts with 3 hidden balls, increasing gradually
    const numHidden = Math.min(3 + Math.floor((level - 3) / 2), Math.floor(colors * 2.5)); 
    
    // We need to pick random positions that are NOT the top ball (index 3)
    const validPositions: {t: number, p: number}[] = [];
    for (let t = 0; t < colors; t++) {
      for (let p = 0; p < 3; p++) { // Only indices 0, 1, 2
        validPositions.push({t, p});
      }
    }
    
    // Shuffle valid positions
    for (let i = validPositions.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed++) * (i + 1));
      [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
    }
    
    for (let i = 0; i < numHidden && i < validPositions.length; i++) {
      const {t, p} = validPositions[i];
      state[t][p] = '?' + state[t][p];
    }
  }

  return state;
}

export function pour(state: string[][], fromIdx: number, toIdx: number): string[][] | null {
  const fromTube = state[fromIdx];
  const toTube = state[toIdx];

  if (fromTube.length === 0) return null;
  if (toTube.length === 4) return null;
  
  // Prevent moving balls out of a completed tube
  if (isTubeCompleted(fromTube)) return null;

  const colorToMove = fromTube[fromTube.length - 1];
  
  if (toTube.length > 0 && toTube[toTube.length - 1] !== colorToMove) {
    return null;
  }

  let count = 0;
  for (let i = fromTube.length - 1; i >= 0; i--) {
    if (fromTube[i] === colorToMove) count++;
    else break;
  }

  const spaceInToTube = 4 - toTube.length;
  const amountToMove = Math.min(count, spaceInToTube);

  if (amountToMove === 0) return null;

  const newState = state.map(t => [...t]);
  for (let i = 0; i < amountToMove; i++) {
    newState[toIdx].push(newState[fromIdx].pop()!);
  }

  // Reveal the new top ball of the from tube if it's hidden
  if (newState[fromIdx].length > 0) {
    const newTop = newState[fromIdx][newState[fromIdx].length - 1];
    if (newTop.startsWith('?')) {
      newState[fromIdx][newState[fromIdx].length - 1] = newTop.substring(1);
    }
  }

  return newState;
}

export function checkWin(state: string[][]): boolean {
  for (const tube of state) {
    if (tube.length === 0) continue;
    if (!isTubeCompleted(tube)) return false;
  }
  return true;
}

export function findHint(state: string[][]): { from: number, to: number } | null {
  // 1. Try to find a winning path using BFS (limited iterations)
  const queue: {state: string[][], path: {from: number, to: number}[]}[] = [{state, path: []}];
  const visited = new Set<string>();
  
  const serialize = (s: string[][]) => {
    return [...s].map(t => t.join(',')).sort().join('|');
  };
  
  visited.add(serialize(state));
  
  let head = 0;
  let iterations = 0;
  const MAX_ITERATIONS = 2000; // Keep it fast to prevent browser freeze
  
  while(head < queue.length && iterations < MAX_ITERATIONS) {
    iterations++;
    const current = queue[head++];
    
    if (checkWin(current.state)) {
      if (current.path.length > 0) {
        return current.path[0];
      }
      return null;
    }
    
    for (let i = 0; i < current.state.length; i++) {
      if (current.state[i].length === 0) continue;
      if (isTubeCompleted(current.state[i])) continue;
      
      const color = current.state[i][current.state[i].length - 1];
      const isAlone = current.state[i].every(c => c === color || c === '?' + color);
      
      for (let j = 0; j < current.state.length; j++) {
        if (i === j) continue;
        
        if (current.state[j].length === 0 && isAlone) continue;
        
        const nextState = pour(current.state, i, j);
        if (nextState) {
          const serialized = serialize(nextState);
          if (!visited.has(serialized)) {
            visited.add(serialized);
            queue.push({state: nextState, path: [...current.path, {from: i, to: j}]});
          }
        }
      }
    }
  }
  
  // 2. Fallback: Smart Greedy Heuristic if BFS takes too long
  let bestMove: { from: number, to: number } | null = null;
  let bestScore = -1;

  for (let i = 0; i < state.length; i++) {
    if (state[i].length === 0) continue;
    if (isTubeCompleted(state[i])) continue;

    for (let j = 0; j < state.length; j++) {
      if (i === j) continue;
      
      const result = pour(state, i, j);
      if (result) {
        const fromTube = state[i];
        const toTube = state[j];
        const color = fromTube[fromTube.length - 1];
        
        // Count how many of this color are at the top
        let count = 0;
        for (let k = fromTube.length - 1; k >= 0; k--) {
          if (fromTube[k] === color) count++;
          else break;
        }

        const isAlone = fromTube.length === count;
        if (toTube.length === 0 && isAlone) continue; // Useless move
        
        let score = 0;
        
        // Highly reward completing a tube
        if (result[j].length === 4 && result[j].every(c => c === color)) {
          score += 100;
        }
        
        // Reward moving to a non-empty tube (consolidating colors)
        if (toTube.length > 0) {
          score += 50;
        }
        
        // Reward exposing a hidden ball
        if (fromTube.length > count && fromTube[fromTube.length - count - 1].startsWith('?')) {
          score += 75;
        }
        
        // Reward emptying a tube (gives us an empty slot)
        if (fromTube.length === count) {
          score += 40;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = { from: i, to: j };
        }
      }
    }
  }
  
  // 3. Absolute fallback to any valid move if greedy fails
  if (!bestMove) {
    for (let i = 0; i < state.length; i++) {
      if (state[i].length === 0 || isTubeCompleted(state[i])) continue;
      for (let j = 0; j < state.length; j++) {
        if (i === j) continue;
        if (pour(state, i, j)) return { from: i, to: j };
      }
    }
  }
  
  return bestMove;
}

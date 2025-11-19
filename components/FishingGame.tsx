
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Fish, Trophy, AlertCircle, RefreshCcw } from 'lucide-react';
import { 
  GRAVITY, 
  BASE_THRUST,
  HOLD_ACCELERATION,
  MAX_THRUST,
  BOUNCE_DAMPENING, 
  BAR_HEIGHT_PERCENT, 
  FISH_HEIGHT_PERCENT,
  PROGRESS_GAIN, 
  PROGRESS_DECAY,
  FISH_TYPES
} from '../constants';
import { GameState, FishSpecies, FishBehaviorType } from '../types';

interface FishingGameProps {
  species: FishSpecies;
  onGameEnd: (won: boolean) => void;
  onReset: () => void;
}

const FishingGame: React.FC<FishingGameProps> = ({ species, onGameEnd, onReset }) => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.FISHING);
  const [isPerfect, setIsPerfect] = useState<boolean>(true);
  
  // Physics Refs
  const barPosRef = useRef<number>(10); 
  const barVelRef = useRef<number>(0);
  const fishPosRef = useRef<number>(50); 
  const fishTargetRef = useRef<number>(50);
  const progressRef = useRef<number>(20); 
  
  // Input Refs
  const isMouseDownRef = useRef<boolean>(false);
  const holdDurationRef = useRef<number>(0); 
  
  // AI Refs
  const frameIdRef = useRef<number>(0);
  const lastFishMoveRef = useRef<number>(0);
  const activeFishConfig = FISH_TYPES[species];

  // DOM Refs
  const greenBarRef = useRef<HTMLDivElement>(null);
  const fishRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // --- AI Logic ---
  const updateFishAI = useCallback((now: number) => {
    const timeSinceChange = now - lastFishMoveRef.current;
    
    if (timeSinceChange > activeFishConfig.changeInterval) {
      lastFishMoveRef.current = now;
      
      // Determine if we should move
      if (Math.random() < activeFishConfig.moveChance) {
        let newTarget = fishPosRef.current;
        const maxPos = 100 - FISH_HEIGHT_PERCENT;
        
        switch (activeFishConfig.behavior) {
          case FishBehaviorType.PASSIVE:
            // Small wanders near current spot
            newTarget += (Math.random() - 0.5) * 20;
            break;
            
          case FishBehaviorType.SMOOTH:
            // Full range wandering
            newTarget = Math.random() * maxPos;
            break;
            
          case FishBehaviorType.MIXED:
            // Uses dartRange for specific jump sizes (stable medium vs large)
            const range = activeFishConfig.dartRange || 100;
            
            if (Math.random() > 0.5) {
               // Big movement (limited by dartRange relative to current pos)
               const moveDir = Math.random() > 0.5 ? 1 : -1;
               const distance = (Math.random() * 0.5 + 0.5) * range; // 50-100% of range
               newTarget += moveDir * distance;
            } else {
              // Small wobble
              newTarget += (Math.random() - 0.5) * 15;
            }
            break;
            
          case FishBehaviorType.SINKER:
             // Bias towards bottom
             const sinkBias = Math.random() > 0.3 ? 0 : 1; // 70% chance to pick lower half
             if (sinkBias === 0) newTarget = Math.random() * 40;
             else newTarget = Math.random() * maxPos;
             break;

          case FishBehaviorType.FLOATER:
             // Bias towards top
             const floatBias = Math.random() > 0.3 ? 1 : 0; // 70% chance to pick upper half
             if (floatBias === 1) newTarget = 60 + Math.random() * 30;
             else newTarget = Math.random() * maxPos;
             break;
             
          case FishBehaviorType.AGGRO:
             // Always new random target far away
             newTarget = Math.random() * maxPos;
             break;
        }

        // Clamp
        fishTargetRef.current = Math.max(0, Math.min(100 - FISH_HEIGHT_PERCENT, newTarget));
      }
    }

    // Move Fish
    const dist = fishTargetRef.current - fishPosRef.current;
    const speed = activeFishConfig.baseSpeed;
    
    // Smooth easing for everything except AGGRO which snaps harder
    if (Math.abs(dist) < speed) {
      fishPosRef.current = fishTargetRef.current;
    } else {
      fishPosRef.current += Math.sign(dist) * speed;
    }

  }, [activeFishConfig]);

  // --- Physics Engine ---
  const updatePhysics = useCallback(() => {
    const now = Date.now();

    // 1. Update Fish
    updateFishAI(now);

    // 2. Update Bar (Player)
    let currentThrust = 0;
    
    if (isMouseDownRef.current) {
      holdDurationRef.current += 1;
      // Slower acceleration as requested
      const dynamicThrust = BASE_THRUST + (holdDurationRef.current * HOLD_ACCELERATION);
      currentThrust = Math.min(dynamicThrust, MAX_THRUST);
      
      barVelRef.current += currentThrust;
    } else {
      holdDurationRef.current = 0;
      barVelRef.current += GRAVITY;
    }

    barPosRef.current += barVelRef.current;

    // Collision
    const maxBarPos = 100 - BAR_HEIGHT_PERCENT;
    
    // Floor
    if (barPosRef.current <= 0) {
      barPosRef.current = 0;
      if (barVelRef.current < -2) {
         barVelRef.current *= BOUNCE_DAMPENING; 
      } else {
         barVelRef.current = 0;
      }
    }
    
    // Ceiling
    if (barPosRef.current >= maxBarPos) {
      barPosRef.current = maxBarPos;
      if (isMouseDownRef.current) {
        if (barVelRef.current > 0) barVelRef.current = 0;
      } else {
        if (barVelRef.current > 0) {
           barVelRef.current *= BOUNCE_DAMPENING; 
        }
      }
    }

    // 3. Check Overlap
    const fishCenter = fishPosRef.current + (FISH_HEIGHT_PERCENT / 2);
    const barBottom = barPosRef.current;
    const barTop = barPosRef.current + BAR_HEIGHT_PERCENT;

    const isCatching = fishCenter >= barBottom && fishCenter <= barTop;
    
    if (isCatching) {
      progressRef.current = Math.min(100, progressRef.current + PROGRESS_GAIN);
      if (greenBarRef.current) {
        greenBarRef.current.style.backgroundColor = '#36d399'; 
        greenBarRef.current.style.opacity = '1';
      }
      if (fishRef.current) fishRef.current.style.opacity = '1';
    } else {
      progressRef.current = Math.max(0, progressRef.current - PROGRESS_DECAY);
      setIsPerfect(false); 
      if (greenBarRef.current) {
        greenBarRef.current.style.backgroundColor = '#9ca3af'; 
        greenBarRef.current.style.opacity = '0.8';
      }
      if (fishRef.current) fishRef.current.style.opacity = '0.6'; 
    }

    // 4. Render
    if (greenBarRef.current) greenBarRef.current.style.bottom = `${barPosRef.current}%`;
    if (fishRef.current) fishRef.current.style.bottom = `${fishPosRef.current}%`;
    if (progressBarRef.current) {
      progressBarRef.current.style.height = `${progressRef.current}%`;
      if (progressRef.current > 70) progressBarRef.current.style.backgroundColor = '#36d399'; 
      else if (progressRef.current > 30) progressBarRef.current.style.backgroundColor = '#fbbf24'; 
      else progressBarRef.current.style.backgroundColor = '#f87171'; 
    }

    // 5. Game Over
    if (progressRef.current >= 100) {
      handleGameOver(true);
      return;
    } else if (progressRef.current <= 0) {
      handleGameOver(false);
      return;
    }

    frameIdRef.current = requestAnimationFrame(updatePhysics);
  }, [updateFishAI]);

  const handleGameOver = (won: boolean) => {
    cancelAnimationFrame(frameIdRef.current);
    setGameState(won ? GameState.WON : GameState.LOST);
    onGameEnd(won);
  };

  const handleMouseDown = () => { isMouseDownRef.current = true; };
  const handleMouseUp = () => { isMouseDownRef.current = false; };

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(updatePhysics);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isMouseDownRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isMouseDownRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleMouseUp); 
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [updatePhysics]);


  // --- Rendering ---

  if (gameState === GameState.WON) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] w-full bg-blue-900/80 rounded-xl border-4 border-amber-700 text-white animate-in fade-in zoom-in duration-300">
        <Trophy size={64} className="text-yellow-400 mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-shadow">CAUGHT!</h2>
        <p className="text-xl mb-4">{activeFishConfig.name}</p>
        {isPerfect && (
          <span className="px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-sm font-bold animate-bounce mb-4">
            PERFECT!
          </span>
        )}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-2 rounded border-b-4 border-green-800 font-bold active:border-b-0 active:translate-y-1 transition-all"
        >
          <RefreshCcw size={18} /> Fish Again
        </button>
      </div>
    );
  }

  if (gameState === GameState.LOST) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] w-full bg-blue-950/90 rounded-xl border-4 border-amber-700 text-white animate-in fade-in zoom-in duration-300">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-shadow">ESCAPED...</h2>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-2 rounded border-b-4 border-red-800 font-bold active:border-b-0 active:translate-y-1 transition-all mt-4"
        >
          <RefreshCcw size={18} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center gap-4 select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
    >
      {/* Game Container */}
      <div 
        className="relative w-16 h-[400px] bg-sky-200 border-4 border-sky-900 rounded-full overflow-hidden shadow-inner cursor-crosshair ring-4 ring-sky-900/20"
        style={{ background: 'linear-gradient(to bottom, #38bdf8, #0369a1)' }}
      >
        {/* Background Grid/Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #fff 20px)'}}></div>

        {/* The Fish */}
        <div 
          ref={fishRef}
          className="absolute left-1/2 -translate-x-1/2 w-10 h-8 transition-none z-10 pointer-events-none flex items-center justify-center"
          style={{ bottom: '50%', height: `${FISH_HEIGHT_PERCENT}%` }}
        >
          <Fish className="w-full h-full text-orange-500 drop-shadow-lg fill-orange-500" />
        </div>

        {/* The Green Fishing Bar */}
        <div 
          ref={greenBarRef}
          className="absolute left-0 right-0 bg-green-500 border-t-2 border-b-2 border-green-300 rounded-sm transition-none pointer-events-none mix-blend-hard-light shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          style={{ 
            height: `${BAR_HEIGHT_PERCENT}%`, 
            bottom: '0%' 
          }}
        >
           <div className="w-full h-full bg-white/20"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-8 h-[400px] bg-gray-800 rounded-full border-4 border-gray-600 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div 
          ref={progressBarRef}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 transition-none z-10"
          style={{ height: '25%' }}
        />
        
        {isPerfect && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(192,132,252,1)] z-20" />
        )}
      </div>
    </div>
  );
};

export default FishingGame;
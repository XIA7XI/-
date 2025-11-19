
import { FishConfig, FishSpecies, FishBehaviorType } from './types';

// Physics Constants
export const GRAVITY = -0.12; // Constant downward pull
export const BASE_THRUST = 0.15; // Initial click power
export const HOLD_ACCELERATION = 0.0035; // Reduced by 30% as requested (was 0.005)
export const MAX_THRUST = 0.35; // Cap speed
export const BOUNCE_DAMPENING = -0.5; 

// Dimensions
export const BAR_HEIGHT_PERCENT = 20; 
export const FISH_HEIGHT_PERCENT = 8; 

// Progress Mechanics
export const PROGRESS_DECAY = 0.12; // High risk (Doubled from 0.06)
export const PROGRESS_GAIN = 0.36;  // High reward (Doubled from 0.18)

export const FISH_TYPES: Record<FishSpecies, FishConfig> = {
  [FishSpecies.CARP]: {
    name: 'Carp',
    behavior: FishBehaviorType.PASSIVE,
    baseSpeed: 0.4,
    moveChance: 0.2,
    changeInterval: 1500
  },
  [FishSpecies.SMALLMOUTH]: {
    name: 'Smallmouth Bass',
    behavior: FishBehaviorType.SMOOTH,
    baseSpeed: 0.8,
    moveChance: 0.9,
    changeInterval: 1000
  },
  [FishSpecies.LARGEMOUTH]: {
    name: 'Largemouth Bass',
    behavior: FishBehaviorType.MIXED,
    baseSpeed: 1.8,
    moveChance: 0.7, 
    changeInterval: 600,
    dartRange: 40 // Medium distance jumps (stable)
  },
  [FishSpecies.TUNA]: {
    name: 'Tuna',
    behavior: FishBehaviorType.MIXED,
    baseSpeed: 2.8,
    moveChance: 0.75, // Reduced by 10% (was 0.85)
    changeInterval: 400,
    dartRange: 75 // Medium-Large jumps
  },
  [FishSpecies.SUPERCUCUMBER]: {
    name: 'Super Cucumber',
    behavior: FishBehaviorType.SINKER,
    baseSpeed: 2.0,
    moveChance: 0.7,
    changeInterval: 600
  },
  [FishSpecies.PUFFERFISH]: {
    name: 'Pufferfish',
    behavior: FishBehaviorType.FLOATER,
    baseSpeed: 2.5,
    moveChance: 0.8,
    changeInterval: 300
  },
  [FishSpecies.OCTOPUS]: {
    name: 'Octopus',
    behavior: FishBehaviorType.AGGRO,
    baseSpeed: 2.6, 
    moveChance: 0.6, // Reduced by ~30% (was 0.9)
    changeInterval: 250
  },
  [FishSpecies.LEGEND]: {
    name: 'The Legend',
    behavior: FishBehaviorType.AGGRO,
    baseSpeed: 3.6, 
    moveChance: 0.75, // Reduced by ~20% (was 0.95)
    changeInterval: 150
  }
};
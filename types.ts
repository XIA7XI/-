export enum GameState {
  IDLE = 'IDLE',
  CASTING = 'CASTING',
  FISHING = 'FISHING',
  WON = 'WON',
  LOST = 'LOST'
}

export enum FishSpecies {
  CARP = 'Carp',
  SMALLMOUTH = 'Smallmouth Bass',
  LARGEMOUTH = 'Largemouth Bass',
  TUNA = 'Tuna',
  SUPERCUCUMBER = 'Super Cucumber',
  PUFFERFISH = 'Pufferfish',
  OCTOPUS = 'Octopus',
  LEGEND = 'The Legend'
}

export enum FishBehaviorType {
  PASSIVE = 'PASSIVE', // Mostly stationary, slow moves
  SMOOTH = 'SMOOTH',   // Constant movement, predictable
  MIXED = 'MIXED',     // Alternates between idle and fast darts
  SINKER = 'SINKER',   // Gravitates towards bottom, moves down fast
  FLOATER = 'FLOATER', // Gravitates towards top, erratic
  AGGRO = 'AGGRO'      // Constant fast movement, difficult
}

export interface FishConfig {
  name: string;
  behavior: FishBehaviorType;
  baseSpeed: number;
  moveChance: number; // 0-1 probability to move per interval
  changeInterval: number; // How jittery the AI is (ms)
  dartRange?: number; // For MIXED/AGGRO: Max distance to jump relative to current pos (0-100)
}
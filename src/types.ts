export type StationId = 'biology' | 'space' | 'water' | 'body' | 'matter' | 'lab';

export interface Badge {
  id: string;
  stationId: StationId;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface PlayerProfile {
  name: string;
  age: number;
  level: string;
  safetyPledged: boolean;
  hasStarted: boolean;
}

export interface ActivityProgress {
  [activityId: string]: {
    completed: boolean;
    starsEarned: number;
    maxStars: number;
  };
}

export interface GameState {
  profile: PlayerProfile;
  stars: number;
  completedStations: StationId[];
  unlockedStations: StationId[];
  activityProgress: ActivityProgress;
  badges: string[];
  soundEnabled: boolean;
}

export interface StationConfig {
  id: StationId;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  badgeTitle: string;
  badgeIcon: string;
  color: {
    bg: string;
    border: string;
    badge: string;
    gradient: string;
    text: string;
  };
  description: string;
  activitiesCount: number;
  requiredPrevStation?: StationId;
}

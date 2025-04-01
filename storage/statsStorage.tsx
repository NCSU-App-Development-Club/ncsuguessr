import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@myapp:stats';

export type StatsData = {
  gamesPlayed: number;
};

// Get the entire stats object
export const getStats = async (): Promise<StatsData | null> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading stats:', e);
    return null;
  }
};

// Set the entire stats object
export const setStats = async (stats: StatsData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats:', e);
  }
};

// Get gamesPlayed specifically
export const getGamesPlayed = async (): Promise<number> => {
  const stats = await getStats();
  return stats?.gamesPlayed ?? 0;
};

// Set gamesPlayed specifically
export const setGamesPlayed = async (gamesPlayed: number): Promise<void> => {
  const stats = await getStats();
  const newStats: StatsData = {
    ...stats,
    gamesPlayed,
  };
  await setStats(newStats);
};

export const incrementGamesPlayed = async (): Promise<void> => {
    const current = await getGamesPlayed();
    await setGamesPlayed(current + 1);
  };
  

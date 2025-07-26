import AsyncStorage from '@react-native-async-storage/async-storage'

const STATS_KEY = '@myapp:stats'

export type StatsData = {
  gamesPlayed: number
  totalGuessDistance: number
  averageGuessDistance: number
  averageGuessTime: number
  bestOverallGuess: { distance: number; location: string } | null
  bestWeeklyGuess: { distance: number; location: string; weekOf: string } | null
  playStreak: { current: number; lastPlayed: string } | null
  dailyGames: { [date: string]: number } // New field for tracking daily game counts
}

// Get stats from AsyncStorage
export const getStats = async (): Promise<StatsData | null> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Error loading stats:', e)
    return null
  }
}

// Save stats to AsyncStorage
export const setStats = async (stats: StatsData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

// Get games played
export const getGamesPlayed = async (): Promise<number> => {
  const stats = await getStats()
  return stats?.gamesPlayed ?? 0
}

// Set games played and ensure dailyGames persists
export const setGamesPlayed = async (gamesPlayed: number): Promise<void> => {
  const stats = await getStats()
  const newStats: StatsData = {
    gamesPlayed,
    totalGuessDistance: stats?.totalGuessDistance ?? 0,
    averageGuessDistance: stats?.averageGuessDistance ?? 0,
    bestOverallGuess: stats?.bestOverallGuess ?? null,
    bestWeeklyGuess: stats?.bestWeeklyGuess ?? null,
    playStreak: stats?.playStreak ?? { current: 0, lastPlayed: '' },
    averageGuessTime: stats?.averageGuessTime ?? 0,
    dailyGames: stats?.dailyGames ?? {}, // Preserve daily games data if present
  }
  await setStats(newStats)
}

// Increment games played and update daily games count
export const incrementGamesPlayed = async (): Promise<void> => {
  const stats = await getStats()
  const current = stats?.gamesPlayed || 0
  const today = new Date().toISOString().split('T')[0]
  const newDailyGames = { ...(stats?.dailyGames ?? {}) }
  newDailyGames[today] = (newDailyGames[today] || 0) + 1

  const newStats: StatsData = {
    gamesPlayed: current + 1,
    totalGuessDistance: stats?.totalGuessDistance ?? 0,
    averageGuessDistance: stats?.averageGuessDistance ?? 0,
    bestOverallGuess: stats?.bestOverallGuess ?? null,
    bestWeeklyGuess: stats?.bestWeeklyGuess ?? null,
    playStreak: stats?.playStreak ?? { current: 0, lastPlayed: '' },
    averageGuessTime: stats?.averageGuessTime ?? 0,
    dailyGames: newDailyGames,
  }
  await setStats(newStats)
}

const kmToMiles = (km: number): number => km * 0.621371

// Record a guess and update all relevant stats including daily games count
export const recordGuess = async (
  distanceKm: number,
  location: string,
  dateString: string, // "YYYY-MM-DD"
  guessTime: number // in seconds
): Promise<void> => {
  const distance = parseFloat((distanceKm * 0.621371).toFixed(2))
  const stats = await getStats()
  const current: StatsData = stats ?? {
    gamesPlayed: 0,
    totalGuessDistance: 0,
    averageGuessDistance: 0,
    averageGuessTime: 0,
    bestOverallGuess: null,
    bestWeeklyGuess: null,
    playStreak: null,
    dailyGames: {},
  }

  const newGamesPlayed = current.gamesPlayed + 1
  const newTotalDistance = current.totalGuessDistance + distance
  const newAverage = newTotalDistance / newGamesPlayed
  const previousTotalTime = current.averageGuessTime * current.gamesPlayed
  const totalTime = previousTotalTime + guessTime
  const newAverageTime = totalTime / newGamesPlayed

  // Best overall guess
  const newBestOverall =
    !current.bestOverallGuess || distance < current.bestOverallGuess.distance
      ? { distance, location }
      : current.bestOverallGuess

  // Weekly best guess
  const date = new Date(dateString)
  const weekOf = `${date.getUTCFullYear()}-W${getISOWeek(date)}`
  let newBestWeekly = current.bestWeeklyGuess
  if (
    !newBestWeekly ||
    newBestWeekly.weekOf !== weekOf ||
    distance < newBestWeekly.distance
  ) {
    newBestWeekly = { distance, location, weekOf }
  }

  // Play streak logic
  let newPlayStreak = current.playStreak ?? { current: 0, lastPlayed: '' }
  const lastDate = newPlayStreak.lastPlayed
  const today = dateString
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]
  if (lastDate === today) {
    // Already played today — no change
  } else if (lastDate === yesterdayString) {
    // Continued the streak
    newPlayStreak = { current: newPlayStreak.current + 1, lastPlayed: today }
  } else {
    // Streak broken or first time
    newPlayStreak = { current: 1, lastPlayed: today }
  }

  // Update daily games count
  const gameDate = dateString
  const newDailyGames = { ...(current.dailyGames ?? {}) }
  newDailyGames[gameDate] = (newDailyGames[gameDate] || 0) + 1

  const updatedStats: StatsData = {
    ...current,
    gamesPlayed: newGamesPlayed,
    totalGuessDistance: newTotalDistance,
    averageGuessDistance: newAverage,
    averageGuessTime: newAverageTime,
    bestOverallGuess: newBestOverall,
    bestWeeklyGuess: newBestWeekly,
    playStreak: newPlayStreak,
    dailyGames: newDailyGames,
  }

  await setStats(updatedStats)
}

// Helper: Get ISO Week number
const getISOWeek = (date: Date): string => {
  const tempDate = new Date(date.getTime())
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  return weekNo.toString().padStart(2, '0')
}

export const resetStats = async (): Promise<void> => {
  await AsyncStorage.removeItem(STATS_KEY)
}

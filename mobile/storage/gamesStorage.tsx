import AsyncStorage from '@react-native-async-storage/async-storage'

const GAMES_KEY = '@ncsuguessr:games'

// date is yyyy-mm-dd
export type PlayedGame = { date: string; latGuess: number; longGuess: number }

export type GamesPlayedData = PlayedGame[]

export const getPlayedGames = async (): Promise<GamesPlayedData> => {
  try {
    const data = await AsyncStorage.getItem(GAMES_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error loading stats:', e)
    return []
  }
}

export const setPlayedGames = async (games: GamesPlayedData): Promise<void> => {
  try {
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games))
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

export const addPlayedGame = async (
  date: string,
  latGuess: number,
  longGuess: number
): Promise<void> => {
  try {
    const gamesPlayed = await getPlayedGames()
    gamesPlayed.push({ date: date, latGuess, longGuess })
    await setPlayedGames(gamesPlayed)
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

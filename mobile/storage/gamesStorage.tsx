import AsyncStorage from '@react-native-async-storage/async-storage'

const GAMES_KEY = '@ncsuguessr:games'

export type GamesPlayedData = string[]

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

export const addPlayedGame = async (gameDate: string): Promise<void> => {
  try {
    const gamesPlayed = await getPlayedGames()
    gamesPlayed.push(gameDate)
    await setPlayedGames(gamesPlayed)
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

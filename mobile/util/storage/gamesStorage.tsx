import AsyncStorage from '@react-native-async-storage/async-storage'

const GAMES_KEY = '@ncsuguessr:games'

export type GamesPlayedData = string[]

export const getLocalPlayedGames = async (): Promise<GamesPlayedData> => {
  try {
    const data = await AsyncStorage.getItem(GAMES_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error loading stats:', e)
    return []
  }
}

export const setLocalPlayedGames = async (
  games: GamesPlayedData
): Promise<void> => {
  try {
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games))
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

export const addLocalPlayedGame = async (gameDate: string): Promise<void> => {
  try {
    const gamesPlayed = await getLocalPlayedGames()
    gamesPlayed.push(gameDate)
    await setLocalPlayedGames(gamesPlayed)
  } catch (e) {
    console.error('Error saving stats:', e)
  }
}

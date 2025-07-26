import {
  GetGameDatesResponseSchema,
  GetGameResponseSchema,
} from '@ncsuguessr/types/src/games'
import { API_URL } from '.'

export const fetchGame = async (gameDate: string) => {
  const gameResponse = await fetch(`${API_URL}/games/${gameDate}`)

  const data = await gameResponse.json()

  return GetGameResponseSchema.parse(data)
}

export const getGameDates = async () => {
  try {
    const res = await fetch(`${API_URL}/games?select=date`, {
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': 'Ncsuguessr/1.0',
      },
    })

    const data = await res.json()

    return GetGameDatesResponseSchema.parse(data)
  } catch (error: any) {
    console.error('Error fetching game dates:', error)
    throw error
  }
}

import {
  GetGameDatesResponseSchema,
  GetGameResponseSchema,
} from '@ncsuguessr/types/src/games'
import { apiClient } from './client'

export const fetchGame = async (gameDate: string) => {
  try {
    const data = await apiClient(`/games/${gameDate}`, GetGameResponseSchema, {
      method: 'GET',
    })
    return GetGameResponseSchema.parse(data)
  } catch (error: any) {
    console.error('Error fetching game:', error)
    throw error
  }
}

export const getGameDates = async () => {
  try {
    return await apiClient(`/games?select=date`, GetGameDatesResponseSchema, {
      method: 'GET',
    })
  } catch (error: any) {
    console.error('Error fetching game dates:', error)
    throw error
  }
}

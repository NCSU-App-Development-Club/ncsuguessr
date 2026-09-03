import {
  GetGameDatesResponseSchema,
  GetGameResponseSchema,
} from '@ncsuguessr/types/games'
import { apiClient } from './client'

export const fetchGame = async (gameDate: string) => {
  try {
    return await apiClient(`/games/${gameDate}`, GetGameResponseSchema, {
      method: 'GET',
    })
  } catch (error) {
    console.error('Error fetching game:', error)
    throw error
  }
}

export const getGameDates = async () => {
  try {
    return await apiClient(`/games?select=date`, GetGameDatesResponseSchema, {
      method: 'GET',
    })
  } catch (error) {
    console.error('Error fetching game dates:', error)
    throw error
  }
}

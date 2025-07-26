import {
  GetGameDatesResponseSchema,
  GetGameResponseSchema,
} from '@ncsuguessr/types/src/games'
import { apiClient } from './client'

export async function fetchGame(gameDate: string) {
  try {
    const data = await apiClient(`/games/${gameDate}`, { method: 'GET' })
    return GetGameResponseSchema.parse(data)
  } catch (error: any) {
    console.error('Error fetching game:', error)
    throw error
  }
}

export async function getGameDates() {
  try {
    const data = await apiClient(`/games?select=date`, { method: 'GET' })
    return GetGameDatesResponseSchema.parse(data)
  } catch (error: any) {
    console.error('Error fetching game dates:', error)
    throw error
  }
}

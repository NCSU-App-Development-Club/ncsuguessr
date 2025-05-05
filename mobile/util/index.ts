import {
  GetGameDatesResponseSchema,
  GetGameResponseSchema,
} from '@ncsuguessr/types/src/games'

const API_URL =
  'https://ncsuguessr-api-staging.ncsuappdevelopmentclub.workers.dev'

export const fetchGame = async (gameDate: string) => {
  const gameResponse = await fetch(`${API_URL}/games/${gameDate}`)

  const data = await gameResponse.json()

  return GetGameResponseSchema.parse(data)
}

export const getGameDates = async () => {
  const res = await fetch(`${API_URL}/games?select=date`, {
    headers: {
      'content-type': 'application/json',
    },
  })

  const data = await res.json()

  return GetGameDatesResponseSchema.parse(data)
}

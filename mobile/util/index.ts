import { GetGameResponseSchema } from '@ncsuguessr/types/src/games'

const API_URL =
  'https://ncsuguessr-api-staging.ncsuappdevelopmentclub.workers.dev'

export const fetchGame = async (gameDate: string) => {
  const gameResponse = await fetch(`${API_URL}/games/${gameDate}`)

  const data = await gameResponse.json()

  return GetGameResponseSchema.parse(data)
}

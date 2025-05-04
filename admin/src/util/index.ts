import {
  CreateGameResponseSchema,
  GetGameDatesResponseSchema,
  GetGamesResponseSchema,
} from '@ncsuguessr/types/games'
import {
  GetImagesResponseSchema,
  GetImageUrlResponseSchema,
} from '@ncsuguessr/types/images'

const API_URL = import.meta.env.VITE_API_URL

export const getGameDates = async (token: string) => {
  const res = await fetch(`${API_URL}/games?select=date`, {
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  })

  const data = await res.json()

  return GetGameDatesResponseSchema.parse(data)
}

export const getUnverifiedImages = async (token: string) => {
  const res = await fetch(`${API_URL}/images?used=false`, {
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  })

  const data = await res.json()

  return GetImagesResponseSchema.parse(data)
}

export const getImageUrl = async (imageId: number, token: string) => {
  const res = await fetch(`${API_URL}/images/${imageId}/url`, {
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  })

  const data = await res.json()

  return GetImageUrlResponseSchema.parse(data)
}

export const createGame = async (imageId: number, token: string) => {
  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ imageId }),
  })

  const data = await res.json()

  console.log(data)

  return CreateGameResponseSchema.parse(data)
}

export const getGames = async (token: string) => {
  const res = await fetch(`${API_URL}/games`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  })

  const data = await res.json()

  console.log(data)

  return GetGamesResponseSchema.parse(data)
}

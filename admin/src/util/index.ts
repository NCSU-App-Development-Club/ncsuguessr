import {
  CreateGameResponseSchema,
  GetGamesResponseSchema,
  NewGame,
} from '@ncsuguessr/types/games'
import {
  GetImagesResponseSchema,
  GetImageUrlResponseSchema,
} from '@ncsuguessr/types/images'

const API_URL = import.meta.env.VITE_API_URL

export const isValidGameDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (!regex.test(dateStr)) {
    return false
  }

  const date = new Date(dateStr)
  return !isNaN(date.getTime())
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

export const createGame = async (newGame: NewGame, token: string) => {
  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(newGame satisfies NewGame),
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

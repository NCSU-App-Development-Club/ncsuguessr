import { Hono } from 'hono'
import { Bindings } from '../config'
import { HTTPException } from 'hono/http-exception'
import {
  getGame,
  insertGame,
  listGames,
  listGamesDateOnly,
} from '../repository/games'
import {
  GameRow,
  GameRows,
  GetGameDatesSuccessResponse,
  GetGamesSuccessResponse,
  GetGameSuccessResponse,
  NewGameSchema,
} from '@ncsuguessr/types/games'
import { generateHttpExceptionMessage } from '../util'
import { ImageRow } from '@ncsuguessr/types/images'
import { getImage, markImageUsed } from '../repository/images'
import { getReadPresignedUrl } from '../util/r2'
import { zValidator } from '@hono/zod-validator'

export const gamesRouter = new Hono<{ Bindings: Bindings }>()

gamesRouter.get('/:gameDate', async (ctx) => {
  const gameDate = ctx.req.param('gameDate')

  // TODO: date validation

  let game: GameRow | null
  try {
    game = await getGame(ctx.env.D1, gameDate)
  } catch (e) {
    console.error('error getting game', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('error getting game'),
    })
  }

  if (!game) {
    throw new HTTPException(404, {
      message: generateHttpExceptionMessage('game not found'),
    })
  }

  let image: ImageRow | null
  try {
    image = await getImage(ctx.env.D1, game.image_id)
  } catch (e) {
    console.error('error getting image for game', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('error getting image'),
    })
  }

  if (!image) {
    console.error(
      `corrupted game ${game.date}: image ${game.image_id} does not exist`
    )
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage(
        'corrupted game: image does not exist'
      ),
    })
  }

  let signedUrl: string
  try {
    signedUrl = await getReadPresignedUrl(ctx.env, image.file_location)
  } catch (e) {
    console.error('failed to get presigned url', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('error generating signed url'),
    })
  }

  return ctx.json({
    success: true,
    game: { ...game, image: { ...image, url: signedUrl } },
  } satisfies GetGameSuccessResponse)
})

gamesRouter.post('/', zValidator('json', NewGameSchema), async (ctx) => {
  const newGameBody = ctx.req.valid('json')

  let image: ImageRow | null
  try {
    image = await getImage(ctx.env.D1, newGameBody.image_id)
  } catch (e) {
    console.error('failed to fetch image data', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('failed to fetch image data'),
    })
  }

  if (!image) {
    throw new HTTPException(400, {
      message: generateHttpExceptionMessage(
        `image ${newGameBody.image_id} does not exist`
      ),
    })
  }

  let possibleExistingGame: GameRow | null
  try {
    possibleExistingGame = await getGame(ctx.env.D1, newGameBody.date)
  } catch (e) {
    console.error('failed to fetch possible existing game', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage(
        'failed to fetch possible existing game'
      ),
    })
  }

  if (possibleExistingGame) {
    throw new HTTPException(409, {
      message: generateHttpExceptionMessage(
        `game on ${newGameBody.date} already exists`
      ),
    })
  }

  try {
    const result = await insertGame(ctx.env.D1, newGameBody)
    if (!result.success) {
      throw new Error(result.error ? result.error : 'failed to insert game')
    }
  } catch (e) {
    console.error('failed to insert game', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('failed to insert game'),
    })
  }

  try {
    const result = await markImageUsed(ctx.env.D1, image.id)
    if (!result.success) {
      throw new Error(
        result.error
          ? result.error
          : 'failed to mark image as used--WARNING: this must be fixed via the console'
      )
    }
  } catch (e) {
    console.error(e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage(
        'failed to mark image as used--WARNING: this must be fixed via the console'
      ),
    })
  }

  return ctx.json({ success: true })
})

gamesRouter.get('/', async (ctx) => {
  const toSelect = ctx.req.queries('select')

  if (toSelect && toSelect.length > 0) {
    if (toSelect.includes('date')) {
      try {
        const gameDates = await listGamesDateOnly(ctx.env.D1)
        return ctx.json({
          success: true,
          games: gameDates,
        } satisfies GetGameDatesSuccessResponse)
      } catch (e) {
        console.error('failed to get game dates', e)
        throw new HTTPException(500, {
          message: generateHttpExceptionMessage('failed to get game dates'),
        })
      }
    } else {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(
          "supported values for 'select' are: 'date'"
        ),
      })
    }
  }

  let games: GameRows
  try {
    games = await listGames(ctx.env.D1)
  } catch (e) {
    console.error('failed to get games', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('failed to get games'),
    })
  }

  return ctx.json({
    success: true,
    games,
  } satisfies GetGamesSuccessResponse)
})

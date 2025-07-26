import { Hono } from 'hono'
import { Bindings } from '../config'
import { HTTPException } from 'hono/http-exception'
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
import { zValidator } from '@hono/zod-validator'
import { adminTokenAuth } from '../middleware/auth'
import { ImageBucketClient } from '../util/buckets'
import { GameTableClient, ImageTableClient } from '../util/tables'

export const gamesRouter = new Hono<{ Bindings: Bindings }>()

gamesRouter.get('/:gameDate', async (ctx) => {
  const gameDate = ctx.req.param('gameDate')

  const gameTableClient = new GameTableClient(ctx.env)
  const imageTableClient = new ImageTableClient(ctx.env)

  // TODO: date validation

  let game: GameRow | null
  try {
    game = await gameTableClient.getGame(gameDate)
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
    image = await imageTableClient.getImage(game.image_id)
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

  const imageBucketClient = new ImageBucketClient(ctx.env)

  let signedUrl: string
  try {
    signedUrl = await imageBucketClient.generateGetPresignedUrl(
      image.file_location
    )
  } catch (e) {
    console.error('failed to get presigned url', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('error generating signed url'),
    })
  }

  return ctx.json({
    success: true,
    game: {
      ...game,
      image: { ...image, taken_at: image.taken_at.getTime(), url: signedUrl },
    },
  } satisfies GetGameSuccessResponse)
})

gamesRouter.post(
  '/',
  adminTokenAuth(),
  zValidator('json', NewGameSchema),
  async (ctx) => {
    const newGameBody = ctx.req.valid('json')

    const gameTableClient = new GameTableClient(ctx.env)
    const imageTableClient = new ImageTableClient(ctx.env)

    let image: ImageRow | null
    try {
      image = await imageTableClient.getImage(newGameBody.image_id)
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
      possibleExistingGame = await gameTableClient.getGame(newGameBody.date)
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
      const result = await gameTableClient.insertGame(newGameBody)
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
      const result = await imageTableClient.setImageUsedStatus(image.id, true)
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
  }
)

gamesRouter.get('/', async (ctx) => {
  const toSelect = ctx.req.queries('select')

  const gameTableClient = new GameTableClient(ctx.env)

  if (toSelect && toSelect.length > 0) {
    if (toSelect.includes('date')) {
      try {
        const gameDates = await gameTableClient.listGameDates()
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
    games = await gameTableClient.listGames()
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

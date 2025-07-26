import { z } from 'zod'
import { ErrorJSONResponseSchema, generateSuccessJSONResponseSchema } from '.'
import { ImageDtoSchema } from './images'

// NOTE: this must be kept in sync with game table definition
export const GameRowSchema = z.object({
  date: z.string(),
  image_id: z.number(),
  plays: z.number(),
  total_dist: z.number(),
})

export type GameRow = z.infer<typeof GameRowSchema>

export const NewGameSchema = GameRowSchema.omit({
  plays: true,
  total_dist: true,
})

export type NewGame = z.infer<typeof NewGameSchema>

export const GameRowsSchema = z.array(GameRowSchema)

export type GameRows = z.infer<typeof GameRowsSchema>

export const GameDateSchema = GameRowSchema.pick({ date: true })

export type GameDate = z.infer<typeof GameDateSchema>

export const GameDatesSchema = z.array(GameDateSchema)

export type GameDates = z.infer<typeof GameDatesSchema>

export const GetGameDatesSuccessResponseSchema =
  generateSuccessJSONResponseSchema({ games: GameDatesSchema })

export type GetGameDatesSuccessResponse = z.infer<
  typeof GetGameDatesSuccessResponseSchema
>

export const GetGameDatesResponseSchema = z.discriminatedUnion('success', [
  ErrorJSONResponseSchema,
  GetGameDatesSuccessResponseSchema,
])

export type GetGameDatesResponse = z.infer<
  typeof GetGameDatesSuccessResponseSchema
>

export const GetGameSuccessResponseSchema = generateSuccessJSONResponseSchema({
  game: GameRowSchema.omit({ image_id: true }).extend({
    image: ImageDtoSchema.extend({ url: z.string() }),
  }),
})

export type GetGameSuccessResponse = z.infer<
  typeof GetGameSuccessResponseSchema
>

export const GetGameResponseSchema = z.discriminatedUnion('success', [
  ErrorJSONResponseSchema,
  GetGameSuccessResponseSchema,
])

export type GetGameResponse = z.infer<typeof GetGameResponseSchema>

export const CreateGameSuccessResponseSchema =
  generateSuccessJSONResponseSchema({})

export type CreateGameSuccessResponse = z.infer<
  typeof CreateGameSuccessResponseSchema
>

export const CreateGameResponseSchema = z.discriminatedUnion('success', [
  ErrorJSONResponseSchema,
  CreateGameSuccessResponseSchema,
])

export const GetGamesSuccessResponseSchema = generateSuccessJSONResponseSchema({
  games: GameRowsSchema,
})

export type GetGamesSuccessResponse = z.infer<
  typeof GetGamesSuccessResponseSchema
>

export const GetGamesResponseSchema = z.discriminatedUnion('success', [
  ErrorJSONResponseSchema,
  GetGamesSuccessResponseSchema,
])

export type GetGamesResponse = z.infer<typeof GetGamesResponseSchema>

import { D1Database } from '@cloudflare/workers-types'
import {
  GameDatesSchema,
  GameRowSchema,
  GameRowsSchema,
  NewGame,
} from '@ncsuguessr/types/games'

export const insertGame = async (d1: D1Database, game: NewGame) => {
  return await d1
    .prepare(
      `INSERT INTO games (image_id, date, plays, total_dist)
      VALUES (?, ?, ?, ?)`
    )
    .bind(game.image_id, game.date, 0, 0)
    .run()
}

// TODO: paginate
export const listGames = async (d1: D1Database) => {
  const results = await d1.prepare('SELECT * FROM games').all()

  if (!results.success) {
    throw new Error(
      results.error ? results.error : 'failed to fetch games from database'
    )
  }

  return GameRowsSchema.parse(results.results)
}

// TODO: paginate and allow for selection of date range
export const listGamesDateOnly = async (d1: D1Database) => {
  const results = await d1.prepare('SELECT date FROM games').all()

  if (!results.success) {
    throw new Error(
      results.error ? results.error : 'failed to fetch game dates from database'
    )
  }

  return GameDatesSchema.parse(results.results)
}

// TODO: date validation?
export const getGame = async (d1: D1Database, date: string) => {
  const result = await d1
    .prepare('SELECT * FROM games WHERE date = ?')
    .bind(date)
    .first()

  return result ? GameRowSchema.parse(result) : null
}

import { D1Database, D1Result } from '@cloudflare/workers-types'
import { Bindings } from '../config'
import {
  ImageRow,
  ImageRows,
  ImageRowSchema,
  ImageRowsSchema,
  NewImage,
} from '@ncsuguessr/types/images'
import {
  GameDate,
  GameDates,
  GameDatesSchema,
  GameRow,
  GameRows,
  GameRowSchema,
  GameRowsSchema,
  NewGame,
} from '@ncsuguessr/types/games'

export class ImageTableClient {
  private d1: D1Database

  constructor(env: Bindings) {
    this.d1 = env.D1
  }

  async insertImage(
    image: NewImage
  ): Promise<D1Result<Record<string, unknown>>> {
    return await this.d1
      .prepare(
        `INSERT INTO images (file_location, latitude, longitude, taken_at, used, location_name, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        image.file_location,
        image.latitude,
        image.longitude,
        image.taken_at.getTime(),
        image.used,
        image.location_name,
        image.description
      )
      .run()
  }

  async getImage(imageId: number): Promise<ImageRow | null> {
    const result = await this.d1
      .prepare('SELECT * FROM images WHERE id = ?')
      .bind(imageId)
      .first()

    return result ? ImageRowSchema.parse(result) : null
  }

  async setImageUsedStatus(
    imageId: number,
    used: boolean
  ): Promise<D1Result<Record<string, unknown>>> {
    return await this.d1
      .prepare('UPDATE images SET used = ? WHERE id = ?')
      .bind(used, imageId)
      .run()
  }

  async getImages(used: boolean): Promise<ImageRows> {
    const results = await this.d1
      .prepare('SELECT * FROM images WHERE used = ?')
      .bind(used)
      .all()

    if (!results.success) {
      throw new Error(
        results.error ? results.error : 'failed to fetch images from database'
      )
    }

    return ImageRowsSchema.parse(results.results)
  }
}

export class GameTableClient {
  private d1: D1Database

  constructor(env: Bindings) {
    this.d1 = env.D1
  }

  async insertGame(game: NewGame): Promise<D1Result<Record<string, unknown>>> {
    return await this.d1
      .prepare(
        `INSERT INTO games (image_id, date, plays, total_dist)
        VALUES (?, ?, ?, ?)`
      )
      .bind(game.image_id, game.date, 0, 0)
      .run()
  }

  // TODO: paginate
  async listGames(): Promise<GameRows> {
    const results = await this.d1.prepare('SELECT * FROM games').all()
    if (!results.success) {
      throw new Error(
        results.error ? results.error : 'failed to fetch games from database'
      )
    }

    return GameRowsSchema.parse(results.results)
  }

  // TODO: paginate and allow for selection of date range
  async listGameDates(): Promise<GameDates> {
    const results = await this.d1.prepare('SELECT date FROM games').all()
    if (!results.success) {
      throw new Error(
        results.error
          ? results.error
          : 'failed to fetch game dates from database'
      )
    }

    return GameDatesSchema.parse(results.results)
  }

  // TODO: date validation?
  async getGame(date: string): Promise<GameRow | null> {
    const result = await this.d1
      .prepare('SELECT * FROM games WHERE date = ?')
      .bind(date)
      .first()

    return result ? GameRowSchema.parse(result) : null
  }

  // TODO: paginate and allow for selection of date range
  async getGames(): Promise<GameRows> {
    const results = await this.d1.prepare('SELECT * FROM games').all()
    if (!results.success) {
      throw new Error(
        results.error ? results.error : 'failed to fetch games from database'
      )
    }
    return GameRowsSchema.parse(results.results)
  }
}

import z from 'zod'
import { LocalStore } from '.'
import { Day } from '../time/day'

export const GamesPlayedSchema = z.array(z.number().transform(Day.ofJSON))

export type GamesPlayed = z.infer<typeof GamesPlayedSchema>

export class GamesLocalStore {
  private static readonly GAMES_KEY: string = '@ncsuguessr:games'
  private static readonly store: LocalStore<typeof GamesPlayedSchema> =
    new LocalStore(GamesPlayedSchema, this.GAMES_KEY)

  static async getPlayedGames(): Promise<GamesPlayed | null> {
    return await this.store.getItem()
  }

  static async getPlayedGamesOrDefault(): Promise<GamesPlayed> {
    return (await this.getPlayedGames()) ?? []
  }

  static async setPlayedGames(games: GamesPlayed): Promise<void> {
    await this.store.setItem(games)
  }

  static async addLocalPlayedGame(gameDay: Day): Promise<void> {
    const games = await this.getPlayedGamesOrDefault()
    games.push(gameDay)
    await this.setPlayedGames(games)
  }
}

import z from 'zod'
import { LocalStore } from '.'
import { Distance } from '../space/distance'
import { Day } from '../time/day'
import { Duration } from '../time/duration'

const Guess = z.object({
  distance: z.number().transform(Distance.ofJSON),
  location: z.string(),
})

// NOTE: all fields here must provide a default so that we can get a default
// stats data object with `StatsDataSchema.parse({})`
export const StatsDataSchema = z.object({
  gamesPlayed: z.number().default(0),
  totalGuessDistance: z.number().default(0).transform(Distance.ofJSON),
  totalGuessTime: z.number().default(0).transform(Duration.ofJSON),
  bestOverallGuess: z.nullable(Guess).default(null),
  // TODO: I'm not entirely sold on this best weekly guess.
  // how do you make sure it's always up-to-date?
  // maybe simpler would be 'best guess of last 10 games' or similar
  // bestWeeklyGuess: z
  //   .nullable(
  //     Guess.extend({
  //       weekOf: z.string(),
  //     })
  //   )
  //   .default(null),
  playStreak: z
    .nullable(
      z.object({
        current: z.number(),
        lastPlayed: z.number().transform(Day.ofJSON),
      })
    )
    .default(null),
  dailyGames: z.record(z.string(), z.number()).default({}), // tracks daily game counts
})

export type StatsData = z.infer<typeof StatsDataSchema>

export class StatsLocalStore {
  private static readonly STATS_KEY: string = '@myapp:stats'
  private static readonly store: LocalStore<typeof StatsDataSchema> =
    new LocalStore(StatsDataSchema, this.STATS_KEY)

  static async getStats(): Promise<StatsData | null> {
    return await this.store.getItem()
  }

  static async getStatsOrDefault(): Promise<StatsData> {
    const maybeStats = await this.getStats()
    return maybeStats ?? StatsDataSchema.parse({})
  }

  // TODO: may not be necessary
  // static async incrementGamesPlayed(): Promise<void> {
  //   const today = Day.ofDate(new Date())
  //   const todayStringKey = today.toString()

  //   const existingStats = await this.getStatsOrDefault()

  //   const newDailyGames = existingStats.dailyGames
  //   newDailyGames[todayStringKey] = (newDailyGames[todayStringKey] ?? 0) + 1

  //   const newGamesPlayed = existingStats.gamesPlayed + 1

  //   const newStats = {
  //     ...existingStats,
  //     newDailyGames,
  //     newGamesPlayed,
  //   }

  //   await this.store.setItem(newStats)
  // }

  // TODO: do stats not stored number of wins?
  static async recordGame(
    distance: Distance,
    location: string,
    gameDay: Day,
    gameDuration: Duration
  ): Promise<void> {
    const existingStats = await this.getStatsOrDefault()

    // aggregate stats
    const newGamesPlayed = existingStats.gamesPlayed + 1
    const newTotalDistance = existingStats.totalGuessDistance.add(distance)
    const newTotalTime = existingStats.totalGuessTime.add(gameDuration)

    const newBestOverallGuess =
      existingStats.bestOverallGuess === null ||
      distance.compareTo(existingStats.bestOverallGuess.distance) < 0
        ? { distance, location }
        : existingStats.bestOverallGuess

    // streak calculation
    const lastPlayedDate = existingStats.playStreak?.lastPlayed
    const yesterday = gameDay.minusDays(1)

    let newPlayStreak = existingStats.playStreak
    if (lastPlayedDate !== undefined && lastPlayedDate.isEqual(gameDay)) {
      // already played today, no change in streak
    } else if (
      lastPlayedDate !== undefined &&
      lastPlayedDate.isEqual(yesterday)
    ) {
      // last time played was yesterday, streak continued with this game
      newPlayStreak = {
        current: (newPlayStreak?.current ?? 0) + 1,
        lastPlayed: gameDay,
      }
    } else {
      // either streak was broken or this is first play
      newPlayStreak = { current: 1, lastPlayed: gameDay }
    }

    const dayStringKey = gameDay.toString()
    const newDailyGames = existingStats.dailyGames
    newDailyGames[dayStringKey] = (newDailyGames[dayStringKey] ?? 0) + 1

    const newStats: StatsData = {
      gamesPlayed: newGamesPlayed,
      totalGuessDistance: newTotalDistance,
      totalGuessTime: newTotalTime,
      bestOverallGuess: newBestOverallGuess,
      playStreak: newPlayStreak,
      dailyGames: newDailyGames,
    }

    await this.store.setItem(newStats)
  }

  static async resetStats(): Promise<void> {
    await this.store.removeItem()
  }
}

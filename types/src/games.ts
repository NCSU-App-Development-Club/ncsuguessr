import { z } from "zod";

// NOTE: this must be kept in sync with game table definition
export const GameRow = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number(),
});

export type GameRowType = z.infer<typeof GameRow>;

export const NewGame = GameRow.omit({ id: true }).extend({
  plays: z.literal(0),
  totalDist: z.literal(0),
});

export type NewGameType = z.infer<typeof NewGame>;

export const GameRows = z.array(GameRow);

export type GameRowsType = z.infer<typeof GameRows>;

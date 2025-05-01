import { z } from "zod";

// NOTE: this must be kept in sync with game table definition
export const GameRowSchema = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number(),
});

export type GameRow = z.infer<typeof GameRowSchema>;

export const NewGameSchema = GameRowSchema.omit({ id: true }).extend({
  plays: z.literal(0),
  totalDist: z.literal(0),
});

export type NewGame = z.infer<typeof NewGameSchema>;

export const GameRowsSchema = z.array(GameRowSchema);

export type GameRows = z.infer<typeof GameRowsSchema>;

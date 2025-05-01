import { z } from "zod";

export const HelloSchema = z.object({ hello: z.string() });

export type Hello = z.infer<typeof HelloSchema>;

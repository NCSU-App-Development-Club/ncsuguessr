import { z } from "zod";

export const Hello = z.object({ hello: z.string() });

export type HelloType = z.infer<typeof Hello>;

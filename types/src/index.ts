import { z } from 'zod'

export const ErrorJSONResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
})

export type ErrorJSONResponse = z.infer<typeof ErrorJSONResponseSchema>

export const generateSuccessJSONResponseSchema = <T extends z.ZodRawShape>(
  successSchema: T
) => {
  return z.object({ success: z.literal(true), ...successSchema })
}

import { z } from "zod";
import { ErrorJSONResponseSchema, generateSuccessJSONResponseSchema } from ".";

// NOTE: this must be kept in sync with image table definition
export const ImageRowSchema = z.object({
  id: z.number(),
  file_location: z.string().max(50),
  latitude: z.number(),
  longitude: z.number(),
  taken_at: z
    .number()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
  used: z.number().transform((val) => !!val),
  location_name: z.string().max(100),
  description: z.string(),
});

export type ImageRow = z.infer<typeof ImageRowSchema>;

export const NewImageSchema = ImageRowSchema.omit({ id: true });

export type NewImage = z.infer<typeof NewImageSchema>;

export const ImageRowsSchema = z.array(ImageRowSchema);

export type ImageRows = z.infer<typeof ImageRowsSchema>;

export const ImageSubmissionForm = z.object({
  latitude: z
    .string()
    .transform(Number)
    .refine((v) => !isNaN(v)),
  longitude: z
    .string()
    .transform(Number)
    .refine((v) => !isNaN(v)),
  description: z.string(),
  taken_at: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
  location_name: z.string(),
});

export const CreateImageSuccessResponseSchema =
  generateSuccessJSONResponseSchema({});

export type CreateGameSuccessResponse = z.infer<
  typeof CreateImageSuccessResponseSchema
>;

export const CreateGameResponseSchema = z.discriminatedUnion("success", [
  ErrorJSONResponseSchema,
  CreateImageSuccessResponseSchema,
]);

export type CreateGameResponse = z.infer<
  typeof CreateImageSuccessResponseSchema
>;

export const GetImagesSuccessResponseSchema = generateSuccessJSONResponseSchema(
  { images: ImageRowsSchema }
);

export type GetImagesSuccessResponse = z.infer<
  typeof GetImagesSuccessResponseSchema
>;

export const GetImagesResponseSchema = z.discriminatedUnion("success", [
  ErrorJSONResponseSchema,
  GetImagesSuccessResponseSchema,
]);

export type GetImagesResponse = z.infer<typeof GetImagesResponseSchema>;

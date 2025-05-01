import { z } from "zod";

// NOTE: this must be kept in sync with image table definition
export const ImageRowSchema = z.object({
  id: z.number(),
  fileLocation: z.string().max(50),
  latitude: z.number(),
  longitude: z.number(),
  takenAt: z.date(),
  used: z.boolean(),
  locationName: z.string().max(100),
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
  takenAt: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
  locationName: z.string(),
});

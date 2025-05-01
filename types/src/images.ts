import { z } from "zod";

// NOTE: this must be kept in sync with image table definition
export const ImageRow = z.object({
  id: z.number(),
  fileLocation: z.string().max(50),
  latitude: z.number(),
  longitude: z.number(),
  takenAt: z.date(),
  used: z.boolean(),
  locationName: z.string().max(100),
  description: z.string(),
});

export type ImageRowType = z.infer<typeof ImageRow>;

export const NewImage = ImageRow.omit({ id: true });

export type NewImageType = z.infer<typeof NewImage>;

export const ImageRows = z.array(ImageRow);

export type ImageRowsType = z.infer<typeof ImageRows>;

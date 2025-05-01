import { D1Database } from '@cloudflare/workers-types'
import {
  ImageRowSchema,
  ImageRowsSchema,
  NewImage,
} from '@ncsuguessr/types/images'

export const insertImage = async (d1: D1Database, image: NewImage) => {
  return await d1
    .prepare(
      `INSERT INTO images (file_location, latitude, longitude, taken_at, used, location_name, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      image.file_location,
      image.latitude,
      image.longitude,
      image.taken_at.getTime(),
      image.used,
      image.location_name,
      image.description
    )
    .run()
}

export const getImage = async (d1: D1Database, imageId: number) => {
  const result = await d1
    .prepare('SELECT * FROM images WHERE id = ?')
    .bind(imageId)
    .first()

  return result ? ImageRowSchema.parse(result) : null
}

export const markImageUsed = async (
  d1: D1Database,
  imageId: number,
  used: boolean = true
) => {
  return await d1
    .prepare('UPDATE images SET used = ? WHERE id = ?')
    .bind(used, imageId)
    .run()
}

export const getImagesByUsed = async (d1: D1Database, used: boolean) => {
  const results = await d1
    .prepare('SELECT * FROM images WHERE used = ?')
    .bind(used)
    .all()

  if (!results.success) {
    throw new Error(
      results.error ? results.error : 'failed to fetch images from database'
    )
  }

  return ImageRowsSchema.parse(results.results)
}

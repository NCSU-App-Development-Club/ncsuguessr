import { D1Database } from "@cloudflare/workers-types";
import { NewImage } from "@ncsuguessr/types/images";

// TODO: create migrations

export const insertImage = async (d1: D1Database, image: NewImage) => {
  return await d1
    .prepare(
      `INSERT INTO images (file_location, latitude, longitude, takenAt, used, locationName, description) 
        VALUES (:fileLocation, :latitude, :longitude, :takenAt, :used, :locationName, :description)`
    )
    .bind(image)
    .run();
};

export const getImage = async (d1: D1Database, imageId: number) => {
  return await d1
    .prepare("SELECT * FROM images WHERE id = ?")
    .bind(imageId)
    .first();
};

export const markImageUsed = async (
  d1: D1Database,
  imageId: number,
  used: boolean = true
) => {
  return await d1
    .prepare("UPDATE images SET used = ? WHERE id = ?")
    .bind(used, imageId)
    .run();
};

export const getImagesByUsed = async (d1: D1Database, used: boolean) => {
  return await d1
    .prepare("SELECT * FROM images WHERE used = ?")
    .bind(used)
    .all();
};

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Bindings } from "../config";
import { ImageSubmissionForm, NewImage } from "@ncsuguessr/types/images";
import { getImageExtension } from "../util";
import { insertImage } from "../repository/images";
import { D1Result } from "@cloudflare/workers-types";

export const imagesRouter = new Hono<{ Bindings: Bindings }>();

// TODO: presigned urls: https://developers.cloudflare.com/r2/api/s3/presigned-urls/#presigned-url-alternative-with-workers

imagesRouter.post("/", async (ctx) => {
  let form;
  try {
    form = await ctx.req.formData();
  } catch (e) {
    console.error(e);
    throw new HTTPException(400, {
      message: "body is not valid form data",
      cause: e,
    });
  }

  // attempt to process the passed image
  const image = form.get("image");
  if (typeof image === "string" || image === null) {
    throw new HTTPException(400, {
      message: "image must be defined and must be a file",
    });
  }

  // process the remaining fields
  const formBody = Object.fromEntries(
    [...form.entries()].filter((entry) => entry[0] !== "image")
  );

  const parsedFormBody = ImageSubmissionForm.safeParse(formBody);
  if (parsedFormBody.error) {
    throw new HTTPException(400, { message: parsedFormBody.error.message });
  }

  const fileExtension = getImageExtension(image.type);

  if (!fileExtension) {
    throw new HTTPException(400, {
      message:
        "unsupported image type--supported types include: .jpg, .jpeg, .png, .heic, .heif",
    });
  }

  // TODO: handle heic/heif

  const fileLocation = crypto.randomUUID().trim() + fileExtension;
  const imageContent = await image.arrayBuffer();

  try {
    await ctx.env.STAGING_R2.put(fileLocation, imageContent, {
      httpMetadata: { contentType: image.type },
    });
  } catch (e) {
    console.error(e);
    throw new HTTPException(500, { message: "failed to upload image" });
  }

  const newImage: NewImage = {
    ...parsedFormBody.data,
    fileLocation,
    used: false,
  };

  let insertResult: D1Result<Record<string, unknown>> | null;
  try {
    insertResult = await insertImage(ctx.env.STAGING_D1, newImage);
    if (!insertResult.success) {
      throw new Error(
        insertResult.error
          ? insertResult.error
          : "error inserting image record into database"
      );
    }
  } catch (e) {
    console.error(e);
    throw new HTTPException(500, {
      message: "failed to insert image record into database",
    });
  }

  // TODO: rollback r2 insertion if db insertion fails

  return ctx.json({
    image: insertResult.results.length > 0 ? insertResult.results[0] : null,
  });
});

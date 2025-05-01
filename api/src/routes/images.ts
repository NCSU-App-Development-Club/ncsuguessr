import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Bindings } from "../config";
import {
  GetImagesSuccessResponse,
  ImageRows,
  ImageSubmissionForm,
  NewImage,
} from "@ncsuguessr/types/images";
import { generateHttpExceptionMessage, getImageExtension } from "../util";
import { getImage, getImagesByUsed, insertImage } from "../repository/images";
import { getReadPresignedUrl } from "../util/r2";
import { validator } from "hono/validator";

export const imagesRouter = new Hono<{ Bindings: Bindings }>();

imagesRouter.post(
  "/",
  validator("form", (val, _) => {
    // attempt to process the passed image
    const image = val["image"];
    if (
      image === undefined ||
      Array.isArray(image) ||
      typeof image === "string" ||
      image === null
    ) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(
          "image must be defined and must be a file"
        ),
      });
    }

    // process the remaining fields
    const formBody = Object.fromEntries(
      Object.entries(val).filter((entry) => entry[0] !== "image")
    );

    const parsedFormBody = ImageSubmissionForm.safeParse(formBody);
    if (!parsedFormBody.success) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(parsedFormBody.error.message),
      });
    }

    return { image, ...parsedFormBody.data };
  }),
  async (ctx) => {
    const { image, ...parsedFormFields } = ctx.req.valid("form");

    const fileExtension = getImageExtension(image.type);

    if (!fileExtension) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(
          "unsupported image type--supported types include: .jpg, .jpeg, .png, .heic, .heif"
        ),
      });
    }

    // TODO: handle heic/heif

    const fileLocation = crypto.randomUUID().trim() + fileExtension;
    const imageContent = await image.arrayBuffer();

    try {
      await ctx.env.R2.put(fileLocation, imageContent, {
        httpMetadata: { contentType: image.type },
      });
    } catch (e) {
      console.error("failed to process uploaded image", e);
      throw new HTTPException(500, {
        message: generateHttpExceptionMessage("failed to upload image"),
      });
    }

    const newImage: NewImage = {
      ...parsedFormFields,
      file_location: fileLocation,
      used: false,
    };

    try {
      const insertResult = await insertImage(ctx.env.D1, newImage);
      if (!insertResult.success) {
        throw new Error(
          insertResult.error
            ? insertResult.error
            : "error inserting image record into database"
        );
      }

      return ctx.json({ success: true });
    } catch (e) {
      console.error("failed to insert image record into database", e);

      // cleanup by attempting to delete the image from r2
      try {
        await ctx.env.R2.delete(fileLocation);
      } catch (e) {
        console.error(
          "failed to insert image record into database, orphaned object remains",
          e
        );
        throw new HTTPException(500, {
          message: generateHttpExceptionMessage(
            "failed to insert image record into database, orphaned object remains"
          ),
        });
      }

      throw new HTTPException(500, {
        message: generateHttpExceptionMessage(
          "failed to insert image record into database"
        ),
      });
    }
  }
);

// TODO: possibly remove, mostly used for debugging
imagesRouter.get("/:imageId/url", async (ctx) => {
  const imageId = Number(ctx.req.param("imageId"));

  if (isNaN(imageId)) {
    throw new HTTPException(400, {
      message: generateHttpExceptionMessage(
        "invalid imageId: must be a number"
      ),
    });
  }

  const image = await getImage(ctx.env.D1, imageId);

  if (!image) {
    throw new HTTPException(404, {
      message: generateHttpExceptionMessage("image not found"),
    });
  }

  const signedUrl = await getReadPresignedUrl(ctx.env, image.file_location);

  return ctx.json({ success: true, imageUrl: signedUrl });
});

imagesRouter.get("/", async (ctx) => {
  const usedParamStr = ctx.req.query("used");
  if (usedParamStr !== "true" && usedParamStr !== "false") {
    throw new HTTPException(400, {
      message: generateHttpExceptionMessage(
        "'used' query param should be 'true' or 'false'"
      ),
    });
  }

  const usedParam = usedParamStr === "true";

  let images: ImageRows;
  try {
    images = await getImagesByUsed(ctx.env.D1, usedParam);
  } catch (e) {
    console.error("failed to fetch images", e);
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage("failed to fetch images"),
    });
  }

  return ctx.json({ success: true, images } satisfies GetImagesSuccessResponse);
});

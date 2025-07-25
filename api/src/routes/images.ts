import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { Bindings } from '../config'
import {
  GetImagesSuccessResponse,
  ImagesDto,
  ImageSubmissionForm,
  NewImage,
} from '@ncsuguessr/types/images'
import { generateHttpExceptionMessage, getImageExtension } from '../util'
import { ImageBucketClient } from '../util/buckets'
import { validator } from 'hono/validator'
import { adminTokenAuth } from '../middleware/auth'
import { GameTableClient, ImageTableClient } from '../util/tables'

export const imagesRouter = new Hono<{ Bindings: Bindings }>()

imagesRouter.post(
  '/',
  validator('form', (val, _) => {
    // attempt to process the passed image
    const image = val['image']
    if (
      image === undefined ||
      Array.isArray(image) ||
      typeof image === 'string' ||
      image === null
    ) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(
          'image must be defined and must be a file'
        ),
      })
    }

    // process the remaining fields
    const formBody = Object.fromEntries(
      Object.entries(val).filter((entry) => entry[0] !== 'image')
    )

    const parsedFormBody = ImageSubmissionForm.safeParse(formBody)
    if (!parsedFormBody.success) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(parsedFormBody.error.message),
      })
    }

    return { image, ...parsedFormBody.data }
  }),
  async (ctx) => {
    const { image, ...parsedFormFields } = ctx.req.valid('form')

    const fileExtension = getImageExtension(image.type)

    if (!fileExtension) {
      throw new HTTPException(400, {
        message: generateHttpExceptionMessage(
          'unsupported image type--supported types include: .jpg, .jpeg, .png, .heic, .heif'
        ),
      })
    }

    const imageBucketClient = new ImageBucketClient(ctx.env)
    const imageTableClient = new ImageTableClient(ctx.env)

    // TODO: handle heic/heif

    const imageKey = crypto.randomUUID().trim() + fileExtension

    try {
      await imageBucketClient.putImage(imageKey, image)
    } catch (e) {
      console.error('failed to process uploaded image', e)
      throw new HTTPException(500, {
        message: generateHttpExceptionMessage('failed to upload image'),
      })
    }

    const newImage: NewImage = {
      ...parsedFormFields,
      file_location: imageKey,
      used: false,
    }

    try {
      const insertResult = await imageTableClient.insertImage(newImage)
      if (!insertResult.success) {
        throw new Error(
          insertResult.error
            ? insertResult.error
            : 'error inserting image record into database'
        )
      }

      return ctx.json({ success: true })
    } catch (e) {
      console.error('failed to insert image record into database', e)

      // cleanup by attempting to delete the image from r2
      try {
        await imageBucketClient.deleteImage(imageKey)
      } catch (e) {
        console.error(
          'failed to insert image record into database, orphaned object remains',
          e
        )
        throw new HTTPException(500, {
          message: generateHttpExceptionMessage(
            'failed to insert image record into database, orphaned object remains'
          ),
        })
      }

      throw new HTTPException(500, {
        message: generateHttpExceptionMessage(
          'failed to insert image record into database'
        ),
      })
    }
  }
)

// TODO: possibly remove, mostly used for debugging
imagesRouter.get('/:imageId/url', async (ctx) => {
  const imageId = Number(ctx.req.param('imageId'))

  if (isNaN(imageId)) {
    throw new HTTPException(400, {
      message: generateHttpExceptionMessage(
        'invalid imageId: must be a number'
      ),
    })
  }

  const imageBucketClient = new ImageBucketClient(ctx.env)
  const imageTableClient = new ImageTableClient(ctx.env)

  const image = await imageTableClient.getImage(imageId)

  if (!image) {
    throw new HTTPException(404, {
      message: generateHttpExceptionMessage('image not found'),
    })
  }

  const signedUrl = await imageBucketClient.generateGetPresignedUrl(
    image.file_location
  )

  return ctx.json({ success: true, imageUrl: signedUrl })
})

imagesRouter.get('/', adminTokenAuth(), async (ctx) => {
  const usedParamStr = ctx.req.query('used')
  if (usedParamStr !== 'true' && usedParamStr !== 'false') {
    throw new HTTPException(400, {
      message: generateHttpExceptionMessage(
        "'used' query param should be 'true' or 'false'"
      ),
    })
  }

  const usedParam = usedParamStr === 'true'

  const imageTableClient = new ImageTableClient(ctx.env)

  let images: ImagesDto
  try {
    const imagesByUsed = await imageTableClient.getImages(usedParam)
    images = imagesByUsed.map((image) => ({
      ...image,
      taken_at: image.taken_at.getTime(),
    }))
  } catch (e) {
    console.error('failed to fetch images', e)
    throw new HTTPException(500, {
      message: generateHttpExceptionMessage('failed to fetch images'),
    })
  }

  return ctx.json({ success: true, images } satisfies GetImagesSuccessResponse)
})

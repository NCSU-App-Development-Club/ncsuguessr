import { useEffect, useState } from 'react'
import { getImageUrl, getUnverifiedImages } from '../util'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import UnverifiedImage from './UnverifiedImage'
import { ImagesDto } from '@ncsuguessr/types/images'

const Images = () => {
  const { auth, authLoaded } = useAuthContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (authLoaded && auth === null) {
      navigate('/', {
        replace: true,
      })
    }
  }, [navigate, auth, authLoaded])

  const [images, setImages] = useState<undefined | ImagesDto>(undefined)
  // id => url
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({})

  const [imagesError, setImagesError] = useState<string | null>(null)

  useEffect(() => {
    if (auth) {
      ;(async () => {
        setImagesError(null)
        try {
          const data = await getUnverifiedImages(auth)

          if (!data.success) {
            throw new Error(data.error)
          }

          setImages(data.images)
        } catch (e) {
          console.error(e)
          setImagesError(`${e}`)
        }
      })()
    }
  }, [auth])

  useEffect(() => {
    if (auth) {
      ;(async () => {
        if (images) {
          const newImageUrls: Record<number, string> = {}
          await Promise.all(
            images.map(async (image) => {
              const imageUrl = await getImageUrl(image.id, auth)
              if (!imageUrl.success) {
                console.error(imageUrl.error)
                return
              }

              newImageUrls[image.id] = imageUrl.imageUrl
            })
          )
          setImageUrls(newImageUrls)
        }
      })()
    }
  }, [images, auth])

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-5">
      <div className="flex flex-col gap-5 w-[100%]">
        <h1 className="text-4xl font-bold text-center">Unverified Images</h1>
        {imagesError ? (
          <div>Error loading images: {imagesError}</div>
        ) : images === undefined ? (
          <div className="text-center">loading...</div>
        ) : images.length === 0 ? (
          <div className="text-center">no unverified images found</div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {images.map((image, idx) => (
              <UnverifiedImage
                key={idx}
                image={image}
                url={imageUrls[image.id]}
                token={auth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Images

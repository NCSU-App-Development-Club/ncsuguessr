import { useState } from 'react'
import { createGame } from '../util'
import { ImageDto } from '@ncsuguessr/types/images'

const UnverifiedImage = ({
  image,
  url,
  token,
}: {
  image: ImageDto
  url: string
  token: string | null
}) => {
  const [gameCreated, setGameCreated] = useState(false)
  const [gameCreatedError, setGameCreatedError] = useState<string | null>(null)

  const handleCreateGame = async () => {
    try {
      if (!token) {
        throw new Error('missing auth token')
      }

      console.log(image.id)
      const game = await createGame(image.id, token)

      if (!game.success) {
        throw new Error(game.error)
      }

      setGameCreated(true)
    } catch (e) {
      console.error(e)
      setGameCreatedError(`${e}`)
    }
  }

  return (
    <div className="border-[1px] border-black/25 rounded-lg p-2 flex flex-col gap-3 w-[90%] max-w-[700px]">
      {/* TODO: add some kind of map to show the location, perhaps
      https://developers.google.com/maps/documentation/maps-static/overview */}
      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl">{image.location_name}</h2>
          <h3 className="text-xl">
            {new Date(image.taken_at).toLocaleString()}
          </h3>
        </div>
        <div>
          ({image.latitude}, {image.longitude})
        </div>
      </div>
      <div className="flex justify-center">
        {url ? (
          <img src={`${url}`} className="rounded-md" />
        ) : (
          <div>loading image...</div>
        )}
      </div>
      <div className="text-center">{image.description}</div>
      {gameCreatedError ? <div>Error: {gameCreatedError}</div> : null}

      <div className={gameCreated ? '' : `flex justify-center`}>
        {gameCreated ? (
          <p>Game successfully created!</p>
        ) : (
          <button
            className="border-[1px] bg-gray-50 w-fit p-2 rounded-lg"
            onClick={handleCreateGame}
          >
            Create game with this image
          </button>
        )}
      </div>
    </div>
  )
}

export default UnverifiedImage

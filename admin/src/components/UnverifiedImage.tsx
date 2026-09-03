import { useState } from 'react'
import { createGame, deleteImage, isValidGameDate } from '../util'
import { ImageDto } from '@ncsuguessr/types/images'

const UnverifiedImage = ({
  image,
  url,
  token,
  onReject,
}: {
  image: ImageDto
  url: string
  token: string | null
  onReject: (id: number) => void
}) => {
  const [gameCreated, setGameCreated] = useState(false)
  const [gameCreatedLoading, setGameCreatedLoading] = useState(false)
  const [gameCreatedError, setGameCreatedError] = useState<string | null>(null)
  const [gameDateInput, setGameDateInput] = useState('')
  const [rejected, setRejected] = useState(false)
  const [rejectedLoading, setRejectedLoading] = useState(false)
  const [rejectedError, setRejectedError] = useState<string | null>(null)

  const handleCreateGame = async () => {
    try {
      setGameCreatedError(null)
      setGameCreatedLoading(true)
      if (!token) {
        throw new Error('missing auth token')
      }

      if (!isValidGameDate(gameDateInput)) {
        throw new Error('date is not valid')
      }
      const game = await createGame(
        {
          date: gameDateInput,
          image_id: image.id,
        },
        token
      )

      if (!game.success) {
        throw new Error(game.error)
      }

      setGameCreated(true)
    } catch (e) {
      console.error(e)
      setGameCreatedError(`${e}`)
    } finally {
      setGameCreatedLoading(false)
    }
  }

  const handleRejectImage = async () => {
    try {
      setRejectedError(null)
      setRejectedLoading(true)
      if (!token) {
        throw new Error('missing auth token')
      }

      const result = await deleteImage(image.id, token)

      if (!result.success) {
        throw new Error(result.error)
      }

      setRejected(true)
      onReject(image.id)
    } catch (e) {
      console.error(e)
      setRejectedError(`${e}`)
    } finally {
      setRejectedLoading(false)
    }
  }

  if (rejected) {
    return null
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
      {gameCreatedError ? (
        <div className="text-center text-red-500">{gameCreatedError}</div>
      ) : null}
      {rejectedError ? (
        <div className="text-center text-red-500">{rejectedError}</div>
      ) : null}

      <div className={gameCreated ? '' : `flex justify-center`}>
        {gameCreated ? (
          <p className="text-center">Game successfully created!</p>
        ) : (
          <div className="flex justify-center gap-2">
            <input
              className="rounded-lg px-2 py-1 border-[1px] border-black/50"
              placeholder="Date (YYYY-MM-DD)"
              value={gameDateInput}
              onChange={(e) => setGameDateInput(e.target.value)}
            />
            <button
              className="border-[1px] bg-gray-50 w-fit px-2 py-1 rounded-lg hover:cursor-pointer"
              onClick={handleCreateGame}
              disabled={gameCreatedLoading}
            >
              Create game
            </button>
            <button
              className="border-[1px] bg-red-50 text-red-700 w-fit px-2 py-1 rounded-lg hover:cursor-pointer"
              onClick={handleRejectImage}
              disabled={rejectedLoading}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnverifiedImage

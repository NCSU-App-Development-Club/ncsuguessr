import { useState } from 'react'
import { createGame, isValidGameDate } from '../util'
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
  const [gameCreatedLoading, setGameCreatedLoading] = useState(false)
  const [gameCreatedError, setGameCreatedError] = useState<string | null>(null)
  const [gameDateInput, setGameDateInput] = useState('')

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

      console.log(image.id)
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
          </div>
        )}
      </div>
    </div>
  )
}

export default UnverifiedImage

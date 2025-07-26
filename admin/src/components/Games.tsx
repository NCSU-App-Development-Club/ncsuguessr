import { useEffect, useState } from 'react'
import { getImageUrl, getGames } from '../util'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { GameRows } from '@ncsuguessr/types/games'

const Games = () => {
  const { auth, authLoaded } = useAuthContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (authLoaded && auth === null) {
      navigate('/', {
        replace: true,
      })
    }
  }, [navigate, auth, authLoaded])

  const [games, setGames] = useState<undefined | GameRows>(undefined)

  // image id => url
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({})

  const [gamesError, setGamesError] = useState<string | null>(null)

  useEffect(() => {
    if (auth) {
      ;(async () => {
        setGamesError(null)
        try {
          const data = await getGames(auth)

          if (!data.success) {
            throw new Error(data.error)
          }

          setGames(data.games)
        } catch (e) {
          console.error(e)
          setGamesError(`${e}`)
        }
      })()
    }
  }, [auth])

  useEffect(() => {
    if (auth) {
      ;(async () => {
        if (games) {
          const newImageUrls: Record<number, string> = {}
          await Promise.all(
            games.map(async (game) => {
              const imageUrl = await getImageUrl(game.image_id, auth)
              if (!imageUrl.success) {
                console.error(imageUrl.error)
                return
              }
              newImageUrls[game.image_id] = imageUrl.imageUrl
            })
          )
          setImageUrls(newImageUrls)
        }
      })()
    }
  }, [games, auth])

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-5">
      <div className="flex flex-col gap-5 w-[100%]">
        <h1 className="text-4xl font-bold text-center">Games</h1>
        {gamesError ? (
          <div>Error loading games: {gamesError}</div>
        ) : games === undefined ? (
          <div className="text-center">loading...</div>
        ) : games.length === 0 ? (
          <div className="text-center">no games found</div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {games.map((game, idx) => (
              <div
                className="flex flex-col gap-2 border-[1px] p-2 w-[90%] max-w-[950px] rounded-lg"
                key={idx}
              >
                <div className="flex justify-between">
                  <h1 className="text-xl">{game.date}</h1>
                </div>
                <div className="flex justify-start gap-3">
                  <h2>{game.plays} plays</h2>
                  <h2>{game.total_dist} total distance</h2>
                </div>
                {imageUrls[game.image_id] ? (
                  <div className="flex flex-col gap-2">
                    <img
                      src={`${imageUrls[game.image_id]}`}
                      className="rounded-md"
                    />
                    <p>Image ID: {game.image_id}</p>
                  </div>
                ) : (
                  <div>loading image...</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Games

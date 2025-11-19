import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import { Link, Redirect } from 'expo-router'
import { GamesLocalStore } from '../util/storage/games'
import ScreenButton from '../components/global/ScreenButton'

export default function App() {
  if (!__DEV__) return <Redirect href="/home" />

  return (
    <ScreenView className="items-center justify-center">
      <Text className="font-bold text-5xl m-4 mb-8">NCSUGuessr</Text>
      <ScreenLink link="/home">Home</ScreenLink>
      <ScreenLink link="/games/select">Game Select</ScreenLink>
      <ScreenLink link="/games/play/2025-10-30">Game 2025-10-30</ScreenLink>
      <ScreenLink link="/games/finished">Game Finished</ScreenLink>
      <ScreenLink link="/archive">Archive</ScreenLink>
      <ScreenLink link="/contribute">Contribute</ScreenLink>
      <ScreenLink link="/contribute/photo">Take Photo</ScreenLink>
      <ScreenLink link="/contribute/finalize">Contribute Finalize</ScreenLink>
      <ScreenLink link="/stats">Stats</ScreenLink>
      <ScreenButton
        onPress={async () => {
          console.log('clearing games')
          await GamesLocalStore.clearGames()
          console.log('cleared games')
          console.log(await GamesLocalStore.getPlayedGames())
        }}
        title="Clear games local data"
      />
    </ScreenView>
  )
}

function ScreenLink({
  link,
  children,
}: {
  link: string
  children: React.ReactNode
}) {
  return (
    <Link
      className="rounded-xl bg-ncsured w-52 p-1.5 m-1.5 text-center text-white font-bold"
      href={link}
    >
      {children}
    </Link>
  )
}

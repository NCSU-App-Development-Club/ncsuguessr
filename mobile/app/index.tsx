import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import { Link, Redirect } from 'expo-router'

export default function App() {
  if (!__DEV__) return <Redirect href="/home" />

  return (
    <ScreenView className="items-center justify-center">
      <Text className="font-bold text-5xl m-4 mb-8">NCSUGuessr</Text>
      <ScreenLink link="/home">Home</ScreenLink>
      <ScreenLink link="/game-select">Game Select</ScreenLink>
      <ScreenLink link="/games/2025-05-01">Game 2025-05-01</ScreenLink>
      <ScreenLink link="/game-finished">Game Finished</ScreenLink>
      <ScreenLink link="/archive">Archive</ScreenLink>
      <ScreenLink link="/contribute">Contribute</ScreenLink>
      <ScreenLink link="/contribute-photo">Take Photo</ScreenLink>
      <ScreenLink link="/contribute-finalize">Contribute Finalize</ScreenLink>
      <ScreenLink link="/stats">Stats</ScreenLink>
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
      className="rounded bg-ncsured w-52 p-1.5 m-1.5 text-center text-white font-bold"
      href={link}
    >
      {children}
    </Link>
  )
}

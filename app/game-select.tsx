import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'

export default function GameSelect() {
  return (
    <ScreenView className="items-center justify-center border-4">
      <Text>Game Select Page</Text>
      <BackLink to="/" />
    </ScreenView>
  )
}

import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import { Link } from 'expo-router'

export default function Contribute() {
  return (
    <ScreenView className="items-center justify-center border-4">
      <Text>Contribute Page</Text>

      <Link href="/contribute/photo">Take photo</Link>

      <BackLink to="/" />
    </ScreenView>
  )
}

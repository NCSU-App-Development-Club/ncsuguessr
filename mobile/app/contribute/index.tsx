import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import Button from '../../components/global/Button'
import { router } from 'expo-router'

export default function Contribute() {
  return (
    <ScreenView className="items-center justify-center gap-4 p-16">
      <Text className="text-2xl mb-4">Contribute a Photo</Text>

      <Button
        onPress={() => router.push('/contribute/photo')}
        title="Take photo"
        size="xl"
        fullWidth
        buttonClassName="mx-8"
      />
      <Button
        onPress={() => router.push('/contribute/upload')}
        title="Upload image"
        size="xl"
        fullWidth
        buttonClassName="mx-8"
      />

      <BackLink to="/" />
    </ScreenView>
  )
}

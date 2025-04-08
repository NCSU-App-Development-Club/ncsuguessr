import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, View } from 'react-native'
import ScreenButton from '../components/global/ScreenButton'

export default function ContributeFinalize() {
  const { pictureUri, latitude, longitude } = useLocalSearchParams();

  if (typeof pictureUri === "object") {
    console.log("why is this object");
    return;
  }

  console.log(pictureUri);

  return (
    <ScreenView className="flex-1">
      <Image source={{ uri: pictureUri }} className="flex-1" resizeMode="cover" />
      <View className="flex-row justify-items-end">
        <ScreenButton className="flex-1" title="Retake" onPress={() => router.navigate({pathname: '/contribute-photo'})} />
        <ScreenButton className="flex-1" title="Submit" onPress={() => console.log("Upload photo")} />
      </View>
      <BackLink to="/" />
    </ScreenView>
  )
}

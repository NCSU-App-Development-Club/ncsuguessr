import { GestureResponderEvent, Pressable, Text } from "react-native"

export default function ScreenButton({
  onPress,
  title
}: {
  onPress: null | ((event: GestureResponderEvent) => void) | undefined,
  title: string
}) {
  return(
    <Pressable onPress={onPress} className="rounded bg-ncsured w-52 p-1.5 m-1.5">
      <Text className="text-center text-white font-bold">{title}</Text>
    </Pressable>
  )
}
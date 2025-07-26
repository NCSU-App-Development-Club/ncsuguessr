import { View, Text } from 'react-native'

export default function ScreenView({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <View className={'h-full ' + className}>{children}</View>
}

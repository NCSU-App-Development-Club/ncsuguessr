import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import { ReactNode } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type ButtonVariant = 'primary' | 'secondary'

const SIZE_CLASSES: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-xl', text: 'text-md' },
  md: { container: 'px-4 py-2 rounded-2xl', text: 'text-xl' },
  lg: { container: 'px-5 py-3 rounded-3xl', text: 'text-2xl' },
  xl: { container: 'px-6 py-4 rounded-3xl', text: 'text-3xl' },
}

const VARIANT_CLASSES: Record<
  ButtonVariant,
  { container: string; text: string }
> = {
  primary: { container: 'bg-primary', text: 'text-white' },
  secondary: {
    container: 'bg-white border-[1px] border-primary',
    text: 'text-primary',
  },
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Button({
  onPress,
  title,
  buttonClassName,
  textClassName,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  icon,
}: {
  onPress: (event: GestureResponderEvent) => void
  title: string
  buttonClassName?: string
  textClassName?: string
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: ReactNode
}) {
  const sizeClasses = SIZE_CLASSES[size]
  const variantClasses = VARIANT_CLASSES[variant]
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        opacity.value = withTiming(0.6, { duration: 75 })
      }}
      onPressOut={() => {
        opacity.value = withTiming(1, { duration: 75 })
      }}
      // only use this prop for animated styles; keep everything else in tailwind
      style={animatedStyle}
      className={`
        items-center justify-center shadow-button
        ${sizeClasses.container}
        ${variantClasses.container}
        ${fullWidth ? 'w-full' : ''}
        ${buttonClassName ?? ''}
      `}
    >
      <View className="flex-row items-center gap-2">
        {icon}
        <Text
          className={`text-center ${sizeClasses.text} ${variantClasses.text} ${textClassName ?? ''}`}
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  )
}

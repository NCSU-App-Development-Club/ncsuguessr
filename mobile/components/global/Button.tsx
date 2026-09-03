import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import { ReactNode, useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
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
  baseOpacity = 1,
}: {
  onPress?: (event: GestureResponderEvent) => void
  title: string
  buttonClassName?: string
  textClassName?: string
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: ReactNode
  baseOpacity?: number
}) {
  const disabled = !onPress
  const sizeClasses = SIZE_CLASSES[size]
  const variantClasses = VARIANT_CLASSES[variant]
  const opacity = useSharedValue(baseOpacity)

  useEffect(() => {
    opacity.value = disabled ? 0.5 : baseOpacity
  }, [disabled, baseOpacity, opacity])

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
        opacity.value = withTiming(baseOpacity, { duration: 75 })
      }}
      disabled={disabled}
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
      {disabled && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className={`absolute inset-0 bg-gray-600/50 rounded-[inherit]`}
        />
      )}
      <Animated.View
        key={`${title}-${disabled}`}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="flex-row items-center gap-2"
      >
        {icon}
        <Text
          className={`text-center ${sizeClasses.text} ${variantClasses.text} ${textClassName ?? ''}`}
        >
          {title}
        </Text>
      </Animated.View>
    </AnimatedPressable>
  )
}

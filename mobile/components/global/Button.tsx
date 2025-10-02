import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import { ReactNode } from 'react'

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'secondary'

const SIZE_CLASSES: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-xl', text: 'text-md' },
  md: { container: 'px-4 py-2 rounded-2xl', text: 'text-xl' },
  lg: { container: 'px-5 py-3 rounded-3xl', text: 'text-2xl' },
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

export default function Button({
  onPress,
  title,
  className,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  icon,
}: {
  onPress: (event: GestureResponderEvent) => void
  title: string
  className?: string
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: ReactNode
}) {
  const sizeClasses = SIZE_CLASSES[size]
  const variantClasses = VARIANT_CLASSES[variant]

  return (
    <Pressable
      onPress={onPress}
      className={`
        items-center justify-center
        ${sizeClasses.container}
        ${variantClasses.container}
        ${fullWidth ? 'w-full' : ''}
        ${className ?? ''}
      `}
    >
      <View className="flex-row items-center gap-2">
        <Text
          className={`font-bold text-center ${sizeClasses.text} ${variantClasses.text}`}
        >
          {title}
        </Text>
        {icon}
      </View>
    </Pressable>
  )
}

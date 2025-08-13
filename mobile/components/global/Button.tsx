import { GestureResponderEvent, Pressable, Text } from 'react-native'

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'secondary' | 'danger'

const SIZE_CLASSES: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-md', text: 'text-sm' },
  md: { container: 'px-4 py-2 rounded-xl', text: 'text-base' },
  lg: { container: 'px-5 py-3 rounded-3xl', text: 'text-lg' },
}

const VARIANT_CLASSES: Record<
  ButtonVariant,
  { container: string; text: string }
> = {
  primary: { container: 'bg-ncsured', text: 'text-white' },
  secondary: { container: 'bg-gray-700', text: 'text-white' },
  danger: { container: 'bg-red-600', text: 'text-white' },
}

export default function Button({
  onPress,
  title,
  className,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
}: {
  onPress?: (event: GestureResponderEvent) => void
  title: string
  className?: string
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
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
      <Text
        className={`font-bold text-center ${sizeClasses.text} ${variantClasses.text}`}
      >
        {title}
      </Text>
    </Pressable>
  )
}

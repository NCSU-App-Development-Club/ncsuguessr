import { Text as Txt, Platform, StyleProp, TextStyle } from 'react-native'

export default function Text({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: StyleProp<TextStyle>
}) {
  return (
    <Txt className={className} style={style}>
      {Platform.OS == 'android' ? '  ' : ''}
      {children}
      {Platform.OS == 'android' ? '  ' : ''}
    </Txt>
  )
}

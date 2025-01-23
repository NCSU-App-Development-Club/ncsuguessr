import { Text as Txt, Platform } from 'react-native'

export default function Text({ children, className }: { children: React.ReactNode, className?: string }) {
    return <Txt className={className}>{Platform.OS == "android" ? '  ' : ''}{children}{Platform.OS == "android" ? '  ' : ''}</Txt>
}
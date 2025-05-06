import { Link } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

export default function BackLink({
  to,
  label,
}: {
  to: string
  label?: string
}) {
  return (
    <Link
      className="w-28 border-1 text-center p-1.5 m-1 absolute top-1 left-1 font-bold text-lg"
      href={to}
    >
      <Feather name="arrow-left" color="black" size={16} /> {label || 'Back'}
    </Link>
  )
}

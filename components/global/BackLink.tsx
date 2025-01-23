import { Link } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function BackLink({ to }: { to: string }) {
  return (
    <Link style={{top: 8, left: 12}} className="w-32 border-1 text-center p-1.5 m-1 absolute font-bold" href={to}>
        <AntDesign name="caretleft" />{' '}Back
    </Link>
  );
}
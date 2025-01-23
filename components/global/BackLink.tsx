import { Link } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function BackLink({ to }: { to: string }) {
  return (
    <Link className="w-20 border-1 text-center p-1.5 m-1 absolute top-1 left-1 font-bold" href={to}>
        <AntDesign name="caretleft" />{' '}Back
    </Link>
  );
}
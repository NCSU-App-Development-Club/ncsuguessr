import { Text } from 'react-native';
import ScreenView from '../components/global/ScreenView';
import BackLink from '../components/global/BackLink';

export default function ContributeFinalize() {
  return (
    <ScreenView className="items-center justify-center border-4">
      <Text>Contribute Finalize Page</Text>
      <BackLink to="/" />
    </ScreenView>
  );
}

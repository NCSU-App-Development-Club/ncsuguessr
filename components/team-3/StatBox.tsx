import { View, Text } from 'react-native';

interface Icon {
    icon: JSX.Element; // Accepts an entire icon component
    title: string;
    text: string;
}

export default function StatBox({ icon, title, text }: Icon) {
    return (
        <View className="border border-gray-400 p-3 rounded-lg items-center w-30">
            {icon}
            <View className="items-center">
                <Text className="text-lg font-bold">{title}</Text>
                <Text className="text-gray-600">{text}</Text>
            </View>
        </View>
    );
}

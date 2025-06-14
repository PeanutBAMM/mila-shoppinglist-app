import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold mb-4">Mijn Profiel</Text>
      <Text className="text-gray-600">
        Beheer hier je account en instellingen.
      </Text>
    </View>
  );
}
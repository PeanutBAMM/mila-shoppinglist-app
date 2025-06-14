import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // Redirect based on auth status
  return <Redirect href={user ? "/(tabs)" : "/(auth)/login"} />;
}

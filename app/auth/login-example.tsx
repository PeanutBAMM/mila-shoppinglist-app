import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      
      if (result.success) {
        // Navigation will be handled by auth state change
        console.log('Successfully signed in!');
      } else {
        Alert.alert(
          'Inloggen mislukt',
          result.error?.message || 'Er is iets misgegaan bij het inloggen'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Er is een onverwachte fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <View className="w-full max-w-sm">
        {/* Logo */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-primary">Mila</Text>
          <Text className="text-lg text-gray-600 mt-2">Je slimme boodschappen buddy</Text>
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          className="bg-white border border-gray-300 rounded-lg p-4 flex-row items-center justify-center shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <>
              {/* Google Icon - You can replace this with an actual icon */}
              <View className="w-5 h-5 mr-3">
                <Text className="text-xl">G</Text>
              </View>
              <Text className="text-base font-medium text-gray-700">
                Inloggen met Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text className="text-xs text-gray-500 text-center mt-6">
          Door in te loggen ga je akkoord met onze{' '}
          <Text className="text-primary">Voorwaarden</Text> en{' '}
          <Text className="text-primary">Privacybeleid</Text>
        </Text>
      </View>
    </View>
  );
}

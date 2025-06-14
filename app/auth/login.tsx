import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Image } from 'react-native';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('Google sign in button clicked');
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      console.log('Google sign in result:', result);
      
      if (result.success) {
        // Auth state change will handle navigation
        console.log('Sign in successful, waiting for redirect...');
        // On web, we don't need to do anything else
        if (Platform.OS !== 'web') {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert(
          'Inloggen mislukt',
          result.error?.message || 'Er is iets misgegaan bij het inloggen met Google'
        );
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Er is een onverwachte fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={Platform.OS === 'web' ? { width: '100%', height: '100%' } : {}}
    >
      <View className="flex-1 justify-center items-center p-4 sm:p-6 w-full">
        <View className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <View className="items-center mb-12">
            <Image 
              source={require('../../assets/images/icon.png')}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className="text-4xl font-bold text-primary">Mila</Text>
            <Text className="text-lg text-gray-600 mt-2">Je slimme boodschappen buddy</Text>
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className="bg-white border-2 border-gray-200 rounded-full p-4 flex-row items-center justify-center mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <>
                {/* Google Icon */}
                <View className="mr-3">
                  <Text className="text-2xl">🔍</Text>
                </View>
                <Text className="text-base font-semibold text-gray-700">
                  Inloggen met Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">of</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Email Login Link */}
          <Link href="/auth/login-email" asChild>
            <TouchableOpacity className="border-2 border-primary rounded-full p-4">
              <Text className="text-center text-primary font-semibold">
                Inloggen met e-mail
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Nog geen account? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-semibold">Registreren</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Terms */}
          <Text className="text-xs text-gray-500 text-center mt-8">
            Door in te loggen ga je akkoord met onze{' '}
            <Text className="text-primary underline">Voorwaarden</Text> en{' '}
            <Text className="text-primary underline">Privacybeleid</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

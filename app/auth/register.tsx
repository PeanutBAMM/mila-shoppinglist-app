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

export default function RegisterScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      // Google OAuth handles both sign in and sign up
      const result = await signInWithGoogle();
      
      if (result.success) {
        // Check if this is a new user and show welcome screen
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Registratie mislukt',
          result.error?.message || 'Er is iets misgegaan bij het registreren met Google'
        );
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', 'Er is een onverwachte fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center items-center p-6">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <View className="items-center mb-12">
            <Image 
              source={require('../../assets/images/icon.png')}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className="text-4xl font-bold text-primary">Welkom bij Mila!</Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              Maak een account aan en start met slim boodschappen doen
            </Text>
          </View>

          {/* Google Sign Up Button */}
          <TouchableOpacity
            onPress={handleGoogleSignUp}
            disabled={isLoading}
            className="bg-primary rounded-full p-4 flex-row items-center justify-center mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                {/* Google Icon */}
                <View className="mr-3">
                  <Text className="text-2xl">🔍</Text>
                </View>
                <Text className="text-base font-semibold text-white">
                  Registreren met Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Benefits */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="font-semibold text-gray-800 mb-2">
              Met een gratis account krijg je:
            </Text>
            <View className="space-y-1">
              <Text className="text-gray-600">✓ Onbeperkt boodschappenlijstjes</Text>
              <Text className="text-gray-600">✓ Recepten opslaan</Text>
              <Text className="text-gray-600">✓ Uitgaven bijhouden</Text>
              <Text className="text-gray-600">✓ 30 dagen gratis Mila AI assistant</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">of</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Email Register Link */}
          <Link href="/auth/register-email" asChild>
            <TouchableOpacity className="border-2 border-primary rounded-full p-4">
              <Text className="text-center text-primary font-semibold">
                Registreren met e-mail
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Al een account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-semibold">Inloggen</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Terms */}
          <Text className="text-xs text-gray-500 text-center mt-8">
            Door te registreren ga je akkoord met onze{' '}
            <Text className="text-primary underline">Voorwaarden</Text> en{' '}
            <Text className="text-primary underline">Privacybeleid</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

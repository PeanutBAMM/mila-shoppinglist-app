import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Platform } from 'react-native';

export default function AuthCallbackScreen() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (Platform.OS === 'web') {
          // Get the session from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          
          if (access_token && refresh_token) {
            // Set the session
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            
            if (error) throw error;
            
            // Redirect to main app
            router.replace('/(tabs)');
          } else {
            // Check if we have an error
            const error = hashParams.get('error');
            const errorDescription = hashParams.get('error_description');
            
            console.error('OAuth error:', error, errorDescription);
            router.replace('/auth/login');
          }
        } else {
          // For native platforms, this screen shouldn't be reached
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/auth/login');
      }
    };

    handleCallback();
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="mt-4 text-gray-600">Even geduld...</Text>
    </View>
  );
}

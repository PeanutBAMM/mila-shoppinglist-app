import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function MilaChatScreen() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { profile } = useAuth();

  const isPremium = profile?.subscription_tier === 'premium' || 
                   (profile?.subscription_tier === 'trial' && 
                    profile?.trial_ends_at && 
                    new Date(profile.trial_ends_at) > new Date());

  if (!isPremium) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
          <Text className="text-5xl">🤖</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Mila is een Premium feature
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Upgrade naar Premium om met Mila te chatten en je boodschappen moeiteloos te beheren.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Bekijk Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSend = async () => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    // TODO: Implement actual Mila AI integration
    setTimeout(() => {
      setMessage('');
      setIsProcessing(false);
      router.back();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="bg-white shadow-sm">
        <View className="pt-14 pb-4 px-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
            <Text className="text-2xl">🤖</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">Mila</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-gray-900">
            Hoi! Ik ben Mila, je slimme boodschappen buddy! 👋
          </Text>
          <Text className="text-gray-600 mt-2">
            Je kunt me vragen zoals:
          </Text>
          <View className="mt-2">
            <Text className="text-gray-500 mb-1">• "Voeg melk en brood toe"</Text>
            <Text className="text-gray-500 mb-1">• "Maak een lijst voor het weekend"</Text>
            <Text className="text-gray-500 mb-1">• "Wat moet ik kopen voor pasta?"</Text>
          </View>
        </View>

        {isProcessing && (
          <View className="bg-primary/10 p-4 rounded-xl mb-4 flex-row items-center">
            <ActivityIndicator size="small" color="#10b981" className="mr-3" />
            <Text className="text-gray-700">Mila is aan het nadenken...</Text>
          </View>
        )}
      </ScrollView>

      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center">
          <TextInput
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            placeholder="Typ je bericht..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-gray-100 px-4 py-3 rounded-full mr-3 text-base"
            editable={!isProcessing}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim() || isProcessing}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              !message.trim() || isProcessing
                ? 'bg-gray-300'
                : 'bg-primary'
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
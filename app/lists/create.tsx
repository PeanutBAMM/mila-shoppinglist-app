import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListService } from '../../src/services/shoppingListService';
import { Store } from '../../src/types';

export default function CreateListScreen() {
  const [name, setName] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await ShoppingListService.getStores();
      setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Fout', 'Geef je lijst een naam');
      return;
    }

    setIsLoading(true);
    try {
      await ShoppingListService.createList({
        name: name.trim(),
        storeId: selectedStore?.id
      });
      router.back();
    } catch (error) {
      console.error('Error creating list:', error);
      Alert.alert('Fout', 'Kon lijst niet aanmaken');
    } finally {
      setIsLoading(false);
    }
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
          <Text className="text-2xl font-bold text-gray-900">Nieuwe Lijst</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Naam</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Weekboodschappen"
            placeholderTextColor="#9ca3af"
            className="bg-white p-4 rounded-xl border border-gray-200 text-base"
            autoFocus
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Winkel (optioneel)
          </Text>
          
          {isLoadingStores ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  onPress={() => setSelectedStore(
                    selectedStore?.id === store.id ? null : store
                  )}
                  className={`mr-3 mb-3 px-4 py-2 rounded-full border ${
                    selectedStore?.id === store.id
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={
                      selectedStore?.id === store.id
                        ? 'text-white font-medium'
                        : 'text-gray-700'
                    }
                  >
                    {store.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCreate}
          disabled={isLoading || !name.trim()}
          className={`p-4 rounded-full ${
            isLoading || !name.trim()
              ? 'bg-gray-300'
              : 'bg-primary'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Lijst aanmaken
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
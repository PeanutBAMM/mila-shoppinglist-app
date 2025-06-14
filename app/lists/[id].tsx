import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListService } from '../../src/services/shoppingListService';
import { ShoppingList, ShoppingItem } from '../../src/types';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { profile } = useAuth();

  const isPremium = profile?.subscription_tier === 'premium' || 
                   (profile?.subscription_tier === 'trial' && 
                    profile?.trial_ends_at && 
                    new Date(profile.trial_ends_at) > new Date());

  useEffect(() => {
    if (id) {
      loadList();
      // Set up real-time subscription
      const subscription = ShoppingListService.subscribeToList(id, () => {
        loadList();
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id]);
  const loadList = async () => {
    if (!id) return;
    
    try {
      const data = await ShoppingListService.getList(id);
      setList(data);
    } catch (error) {
      console.error('Error loading list:', error);
      Alert.alert('Fout', 'Kon lijst niet laden');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !id) return;

    setIsAddingItem(true);
    try {
      await ShoppingListService.addItem(id, {
        name: newItemName.trim()
      });
      setNewItemName('');
      await loadList();
    } catch (error) {
      Alert.alert('Fout', 'Kon item niet toevoegen');
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleToggleItem = async (item: ShoppingItem) => {
    try {
      await ShoppingListService.toggleItem(item.id);
    } catch (error) {
      Alert.alert('Fout', 'Kon item niet updaten');
    }
  };

  const handleDeleteItem = async (item: ShoppingItem) => {
    try {
      await ShoppingListService.deleteItem(item.id);
      await loadList();
    } catch (error) {
      Alert.alert('Fout', 'Kon item niet verwijderen');
    }
  };
  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View className="bg-white mx-4 mb-2 p-4 rounded-xl flex-row items-center">
      <TouchableOpacity
        onPress={() => handleToggleItem(item)}
        className="mr-3"
      >
        <View className={`w-6 h-6 rounded-full border-2 ${
          item.is_checked 
            ? 'bg-primary border-primary' 
            : 'border-gray-300'
        } items-center justify-center`}>
          {item.is_checked && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>

      <Text className={`flex-1 text-base ${
        item.is_checked ? 'line-through text-gray-400' : 'text-gray-900'
      }`}>
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={() => handleDeleteItem(item)}
        className="p-2"
      >
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!list) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Lijst niet gevonden</Text>
      </View>
    );
  }
  const sortedItems = [...(list.items || [])].sort((a, b) => {
    // Unchecked items first
    if (a.is_checked !== b.is_checked) {
      return a.is_checked ? 1 : -1;
    }
    // Then by position
    return (a.position || 0) - (b.position || 0);
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="bg-white shadow-sm">
        <View className="pt-14 pb-4 px-6 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900" numberOfLines={1}>
                {list.name}
              </Text>
              {list.store && (
                <Text className="text-sm text-gray-500">{list.store.name}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {isPremium && (
        <TouchableOpacity 
          className="bg-primary p-3 mx-4 mt-4 rounded-xl flex-row items-center"
          onPress={() => router.push(`/mila-chat?listId=${id}`)}
        >
          <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3">
            <Text className="text-lg">🤖</Text>
          </View>
          <Text className="text-white font-medium flex-1">
            Vraag Mila om items toe te voegen
          </Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      )}
      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-6">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="cart-outline" size={40} color="#9ca3af" />
            </View>
            <Text className="text-lg font-medium text-gray-900 mb-2">
              Lijst is nog leeg
            </Text>
            <Text className="text-gray-500 text-center">
              Voeg je eerste item toe om te beginnen
            </Text>
          </View>
        }
        contentContainerStyle={
          sortedItems.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
        }
      />

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center">
          <TextInput
            value={newItemName}
            onChangeText={setNewItemName}
            onSubmitEditing={handleAddItem}
            placeholder="Item toevoegen..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-gray-100 px-4 py-3 rounded-full mr-3 text-base"
            editable={!isAddingItem}
          />
          <TouchableOpacity
            onPress={handleAddItem}
            disabled={!newItemName.trim() || isAddingItem}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              !newItemName.trim() || isAddingItem
                ? 'bg-gray-300'
                : 'bg-primary'
            }`}
          >
            {isAddingItem ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="add" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
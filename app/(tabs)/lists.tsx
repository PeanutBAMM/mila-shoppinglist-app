import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MilaFriendlyGreenStyle from '../../src/styles/MilaFriendlyGreenStyle';

const { Colors, Typography, Spacing, Components, scale } = MilaFriendlyGreenStyle;

export default function StoresScreen() {
  const stores = [
    { id: '1', name: 'Albert Heijn', icon: '🛒', color: '#00A0E2', distance: '0.8 km' },
    { id: '2', name: 'Jumbo', icon: '🛍️', color: '#FFCC00', distance: '1.2 km' },
    { id: '3', name: 'Lidl', icon: '🏪', color: '#0050AA', distance: '1.5 km' },
    { id: '4', name: 'PLUS', icon: '🛒', color: '#00A851', distance: '2.1 km' },
  ];

  return (
    <SafeAreaView style={Components.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.lg,
        }}>
          <Text style={{
            fontSize: Typography.fontSize.xxl,
            fontWeight: 'bold',
            color: Colors.neutral.charcoal,
          }}>
            Winkels in de buurt
          </Text>
          <Text style={{
            fontSize: Typography.fontSize.sm,
            color: Colors.neutral.darkGray,
            marginTop: Spacing.xs,
          }}>
            Kies je favoriete winkel
          </Text>
        </View>

        {/* Store List */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              activeOpacity={0.7}
              style={{ marginBottom: Spacing.md }}
            >
              <View style={[
                Components.card,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Spacing.lg,
                }
              ]}>
                <View style={{
                  width: scale(50),
                  height: scale(50),
                  borderRadius: scale(25),
                  backgroundColor: Colors.primary.lighter,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Spacing.md,
                }}>
                  <Text style={{ fontSize: scale(24) }}>{store.icon}</Text>
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: Typography.fontSize.md,
                    fontWeight: '600',
                    color: Colors.neutral.charcoal,
                    marginBottom: Spacing.xxs,
                  }}>
                    {store.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name="location-outline" 
                      size={14} 
                      color={Colors.neutral.darkGray} 
                    />
                    <Text style={{
                      fontSize: Typography.fontSize.sm,
                      color: Colors.neutral.darkGray,
                      marginLeft: Spacing.xxs,
                    }}>
                      {store.distance}
                    </Text>
                  </View>
                </View>
                
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={Colors.neutral.darkGray} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <View style={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.xl,
          paddingBottom: Spacing.xxl,
        }}>
          <View style={[
            Components.card,
            {
              backgroundColor: Colors.primary.lighter,
              borderWidth: 1,
              borderColor: Colors.primary.light,
              padding: Spacing.lg,
            }
          ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name="information-circle" 
                size={24} 
                color={Colors.primary.dark} 
              />
              <Text style={{
                fontSize: Typography.fontSize.sm,
                color: Colors.primary.dark,
                marginLeft: Spacing.sm,
                flex: 1,
              }}>
                Selecteer een winkel om je boodschappenlijst te optimaliseren voor hun indeling
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
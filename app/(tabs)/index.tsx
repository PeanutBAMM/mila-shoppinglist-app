import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  Animated,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { useAuth } from '../../src/contexts/AuthContext';
import { ShoppingListService } from '../../src/services/shoppingListService';
import { ShoppingList } from '../../src/types';
import MilaFriendlyGreenStyle from '../../src/styles/MilaFriendlyGreenStyle';

const { Colors, Typography, Spacing, Layouts, Components, scale } = MilaFriendlyGreenStyle;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heroScale = useRef(new Animated.Value(0.95)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const isPremium = profile?.subscription_tier === 'premium' || 
                   (profile?.subscription_tier === 'trial' && 
                    profile?.trial_ends_at && 
                    new Date(profile.trial_ends_at) > new Date());

  useEffect(() => {
    loadLists();
    
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(heroScale, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadLists = async () => {
    try {
      const data = await ShoppingListService.getUserLists();
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getSeasonalContent = () => {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 7) {
      return {
        title: 'Zomer BBQ Deals',
        subtitle: 'Tot 40% korting op BBQ producten',
        emoji: '🍖',
        gradient: ['#FF6B35', '#FFD93D'],
      };
    } else if (month >= 11 || month <= 1) {
      return {
        title: 'Winter Warmte',
        subtitle: 'Alles voor je stamppot met korting',
        emoji: '🥘',
        gradient: ['#42A5F5', '#66BB6A'],
      };
    }
    return {
      title: 'Verse Aanbiedingen',
      subtitle: 'Bespaar tot 30% deze week',
      emoji: '🛒',
      gradient: [Colors.primary.main, Colors.primary.light],
    };
  };

  const seasonal = getSeasonalContent();

  const quickActions = [
    { id: '1', icon: '🥬', title: 'Groenten', count: 12 },
    { id: '2', icon: '🥛', title: 'Zuivel', count: 8 },
    { id: '3', icon: '🍞', title: 'Bakkerij', count: 5 },
    { id: '4', icon: '🧺', title: 'Alles', count: 25 },
  ];

  const renderHeader = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Welcome Section with Glass Effect */}
      <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
        <Text style={{
          fontSize: Typography.fontSize.xs,
          color: Colors.neutral.darkGray,
          marginBottom: Spacing.xxs,
        }}>
          {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text style={{
          fontSize: Typography.fontSize.xxl,
          fontWeight: 'bold',
          color: Colors.neutral.black,
          marginBottom: Spacing.md,
        }}>
          Hallo, {profile?.full_name?.split(' ')[0] || 'daar'} 👋
        </Text>
      </View>

      {/* Search Bar with Glass Effect */}
      <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg }}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: '#FFFFFF',
              borderRadius: scale(16),
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }
          ]}
        >
          <Ionicons name="search" size={20} color={Colors.neutral.darkGray} />
          <TextInput
            placeholder="Zoek producten of recepten..."
            value={searchValue}
            onChangeText={setSearchValue}
            style={{
              flex: 1,
              marginLeft: Spacing.sm,
              fontSize: Typography.fontSize.md,
              color: Colors.neutral.charcoal,
            }}
            placeholderTextColor={Colors.neutral.darkGray}
          />
          {isPremium && (
            <TouchableOpacity
              onPress={() => Alert.alert('Voice Search', 'Komt binnenkort!')}
              style={{ marginLeft: Spacing.sm }}
            >
              <Ionicons name="mic" size={22} color={Colors.primary.main} />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>

      {/* Modern Hero Section */}
      <Animated.View
        style={{
          paddingHorizontal: Spacing.lg,
          marginBottom: Spacing.xl,
          transform: [{ scale: heroScale }],
        }}
      >
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={seasonal.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: scale(24),
              padding: Spacing.xl,
              minHeight: scale(160),
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Glass overlay effect */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }} />
            
            <View style={{ zIndex: 1 }}>
              <Text style={{
                fontSize: Typography.fontSize.xs,
                fontWeight: '600',
                color: '#FFFFFF',
                opacity: 0.9,
                marginBottom: Spacing.xs,
              }}>
                EXCLUSIEF DEZE WEEK
              </Text>
              <Text style={{
                fontSize: Typography.fontSize.xxl,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: Spacing.xs,
              }}>
                {seasonal.title}
              </Text>
              <Text style={{
                fontSize: Typography.fontSize.md,
                color: '#FFFFFF',
                opacity: 0.9,
                marginBottom: Spacing.lg,
              }}>
                {seasonal.subtitle}
              </Text>
              
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.sm,
                  borderRadius: scale(20),
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Text style={{
                  color: seasonal.gradient[0],
                  fontWeight: '700',
                  fontSize: Typography.fontSize.sm,
                }}>
                  Bekijk aanbiedingen
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={16} 
                  color={seasonal.gradient[0]} 
                  style={{ marginLeft: Spacing.xs }}
                />
              </Pressable>
            </View>

            {/* Floating Product Illustration */}
            <Animated.View
              style={{
                position: 'absolute',
                right: -scale(20),
                bottom: -scale(20),
                transform: [
                  { translateY: floatAnim },
                  { rotate: '15deg' },
                ],
              }}
            >
              <Text style={{ fontSize: scale(120), opacity: 0.3 }}>
                {seasonal.emoji}
              </Text>
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Actions */}
      <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: Spacing.lg }}
        >
          {quickActions.map((action, index) => (
            <Pressable
              key={action.id}
              onPress={() => Alert.alert('Categorie', `${action.title} geselecteerd`)}
              style={({ pressed }) => ({
                marginRight: Spacing.md,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50 + (index * 10)],
                    }),
                  }],
                }}
              >
                <View style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: scale(20),
                  padding: Spacing.md,
                  alignItems: 'center',
                  minWidth: scale(80),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Text style={{ fontSize: scale(32), marginBottom: Spacing.xs }}>
                    {action.icon}
                  </Text>
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    fontWeight: '600',
                    color: Colors.neutral.charcoal,
                  }}>
                    {action.title}
                  </Text>
                  <View style={{
                    backgroundColor: Colors.primary.lighter,
                    borderRadius: scale(10),
                    paddingHorizontal: Spacing.xs,
                    paddingVertical: Spacing.xxxs,
                    marginTop: Spacing.xxs,
                  }}>
                    <Text style={{
                      fontSize: Typography.fontSize.xs,
                      fontWeight: '700',
                      color: Colors.primary.dark,
                    }}>
                      {action.count}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lists Header */}
      <View style={{
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
      }}>
        <View>
          <Text style={{
            fontSize: Typography.fontSize.lg,
            fontWeight: '700',
            color: Colors.neutral.black,
          }}>
            Mijn Lijsten
          </Text>
          <Text style={{
            fontSize: Typography.fontSize.sm,
            color: Colors.neutral.darkGray,
            marginTop: Spacing.xxxs,
          }}>
            {lists.length} actieve lijst{lists.length !== 1 ? 'en' : ''}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/lists/create')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary.lighter,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            borderRadius: scale(16),
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Ionicons name="add" size={20} color={Colors.primary.main} />
          <Text style={{
            marginLeft: Spacing.xxs,
            color: Colors.primary.main,
            fontWeight: '600',
            fontSize: Typography.fontSize.sm,
          }}>
            Nieuw
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderListItem = ({ item, index }: { item: ShoppingList; index: number }) => {
    const itemCount = item.items?.length || 0;
    const checkedCount = item.items?.filter(i => i.is_checked).length || 0;
    const progress = itemCount > 0 ? checkedCount / itemCount : 0;
    const listItemScale = useRef(new Animated.Value(1)).current;

    return (
      <Pressable
        onPress={() => router.push(`/lists/${item.id}`)}
        onPressIn={() => {
          Animated.spring(listItemScale, {
            toValue: 0.97,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(listItemScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }}
        style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}
      >
        <Animated.View
          style={{
            transform: [{ scale: listItemScale }],
            opacity: fadeAnim,
          }}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: scale(20),
            padding: Spacing.lg,
            shadowColor: Colors.primary.main,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}>
            {/* Progress Ring */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                  <Text style={{
                    fontSize: Typography.fontSize.md,
                    fontWeight: '700',
                    color: Colors.neutral.black,
                  }}>
                    {item.name}
                  </Text>
                  {item.store && (
                    <View style={{
                      marginLeft: Spacing.sm,
                      backgroundColor: Colors.primary.lighter,
                      borderRadius: scale(8),
                      paddingHorizontal: Spacing.xs,
                      paddingVertical: Spacing.xxxs,
                    }}>
                      <Text style={{
                        fontSize: Typography.fontSize.xs,
                        fontWeight: '600',
                        color: Colors.primary.dark,
                      }}>
                        {item.store.name}
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text style={{
                  fontSize: Typography.fontSize.sm,
                  color: Colors.neutral.darkGray,
                }}>
                  {itemCount === 0 
                    ? 'Lijst is leeg' 
                    : `${checkedCount} van ${itemCount} items`}
                </Text>
              </View>
              
              {/* Progress Indicator */}
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <View style={{
                  width: scale(60),
                  height: scale(60),
                  borderRadius: scale(30),
                  backgroundColor: Colors.neutral.lightGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3,
                }}>
                  <View style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: scale(27),
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <LinearGradient
                      colors={progress === 1 
                        ? [Colors.status.success, Colors.primary.light]
                        : [Colors.primary.main, Colors.primary.light]
                      }
                      style={{
                        width: scale(48),
                        height: scale(48),
                        borderRadius: scale(24),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: Typography.fontSize.md,
                        fontWeight: '700',
                        color: '#FFFFFF',
                      }}>
                        {Math.round(progress * 100)}%
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Updated timestamp */}
            <View style={{
              marginTop: Spacing.sm,
              paddingTop: Spacing.sm,
              borderTopWidth: 1,
              borderTopColor: Colors.neutral.lightGray,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="time-outline" size={14} color={Colors.neutral.darkGray} />
              <Text style={{
                fontSize: Typography.fontSize.xs,
                color: Colors.neutral.darkGray,
                marginLeft: Spacing.xxs,
              }}>
                Laatst bijgewerkt: {new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={{
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xxl,
      alignItems: 'center',
    }}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <LinearGradient
          colors={[Colors.primary.lighter, Colors.primary.light]}
          style={{
            width: scale(120),
            height: scale(120),
            borderRadius: scale(60),
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.lg,
          }}
        >
          <Text style={{ fontSize: scale(60) }}>📝</Text>
        </LinearGradient>
      </Animated.View>
      
      <Text style={{
        fontSize: Typography.fontSize.xl,
        fontWeight: '700',
        color: Colors.neutral.black,
        marginBottom: Spacing.xs,
      }}>
        Begin met je eerste lijst
      </Text>
      <Text style={{
        fontSize: Typography.fontSize.md,
        color: Colors.neutral.darkGray,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
      }}>
        Maak een boodschappenlijst en laat Mila je helpen met slimme suggesties
      </Text>
      <Pressable
        onPress={() => router.push('/lists/create')}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <LinearGradient
          colors={[Colors.primary.main, Colors.primary.light]}
          style={{
            paddingHorizontal: Spacing.xl,
            paddingVertical: Spacing.md,
            borderRadius: scale(24),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={{
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: Typography.fontSize.md,
            marginLeft: Spacing.xs,
          }}>
            Maak eerste lijst
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView 
      style={[Components.container, { backgroundColor: '#F8FFFE' }]}
      testID="home-screen"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadLists}
              tintColor={Colors.primary.main}
              colors={[Colors.primary.main]}
            />
          }
          contentContainerStyle={lists.length === 0 ? { flexGrow: 1 } : { paddingBottom: Spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {/* Modern FAB with Gradient */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: scale(80),
          right: scale(20),
          transform: [{ scale: pulseAnim }],
        }}
      >
        <Pressable
          onPress={() => Alert.alert('Winkelmandje', 'Binnenkort beschikbaar!')}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          <LinearGradient
            colors={[Colors.accent.orange, Colors.accent.coral]}
            style={{
              width: scale(60),
              height: scale(60),
              borderRadius: scale(30),
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: Colors.accent.orange,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Ionicons name="cart" size={28} color="#FFFFFF" />
            <View style={{
              position: 'absolute',
              top: -5,
              right: -5,
              backgroundColor: Colors.primary.main,
              borderRadius: scale(12),
              paddingHorizontal: scale(8),
              paddingVertical: scale(4),
              minWidth: scale(24),
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: Typography.fontSize.xs,
                fontWeight: 'bold',
              }}>
                3
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Premium Mila Chat Button */}
      {isPremium && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: scale(150),
            right: scale(20),
          }}
        >
          <Pressable
            onPress={() => router.push('/mila-chat')}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <View style={{
              width: scale(50),
              height: scale(50),
              borderRadius: scale(25),
              backgroundColor: Colors.primary.main,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: Colors.primary.main,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}>
              <Text style={{ fontSize: scale(24) }}>🤖</Text>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
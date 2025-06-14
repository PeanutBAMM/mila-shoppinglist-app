import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MilaFuturistic from '../../src/styles/MilaFuturisticStyle';

const { Colors, Typography, Spacing, Layouts, Components } = MilaFuturistic;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FuturisticForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Background rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Oeps!', 'Vul je e-mailadres in');
      return;
    }

    setIsLoading(true);
    // TODO: Implement Supabase password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      
      // Success animation
      Animated.spring(successScale, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isEmailSent) {
    return (
      <View style={Components.darkContainer}>
        {/* Animated Background */}
        <LinearGradient
          colors={Colors.gradients.aurora}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg }}>
          <Animated.View
            style={{
              transform: [{ scale: successScale }],
            }}
          >
            <View style={[
              Components.glassCard,
              {
                alignItems: 'center',
                marginHorizontal: 0,
              }
            ]}>
              {/* Success Icon */}
              <LinearGradient
                colors={[Colors.neon.green, Colors.status.success]}
                style={{
                  width: MilaFuturistic.scale(100),
                  height: MilaFuturistic.scale(100),
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing.lg,
                  ...Platform.select({
                    ios: {
                      shadowColor: Colors.neon.green,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 20,
                    },
                  }),
                }}
              >
                <Text style={{
                  fontSize: Typography.fontSize.gigantic,
                  color: Colors.dark.background,
                }}>
                  ✓
                </Text>
              </LinearGradient>

              <Text style={{
                fontSize: Typography.fontSize.xl,
                fontWeight: '900',
                color: Colors.text.dark.primary,
                marginBottom: Spacing.sm,
                textAlign: 'center',
              }}>
                Check je Inbox! 📬
              </Text>

              <Text style={{
                fontSize: Typography.fontSize.md,
                color: Colors.text.dark.secondary,
                textAlign: 'center',
                marginBottom: Spacing.xl,
                lineHeight: Typography.fontSize.md * 1.5,
              }}>
                We hebben een magic link gestuurd naar{'\n'}
                <Text style={{ fontWeight: '700', color: Colors.neon.blue }}>{email}</Text>
              </Text>

              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    Components.buttonGradient,
                    { width: SCREEN_WIDTH - Spacing.lg * 4 }
                  ]}
                >
                  <Text style={Components.buttonTextFuturistic}>
                    Back to Login
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={Components.darkContainer}>
      {/* Animated Background */}
      <LinearGradient
        colors={Colors.gradients.night}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: SCREEN_WIDTH * 1.5,
            height: SCREEN_WIDTH * 1.5,
            marginLeft: -SCREEN_WIDTH * 0.75,
            marginTop: -SCREEN_WIDTH * 0.75,
            borderRadius: SCREEN_WIDTH * 0.75,
            backgroundColor: Colors.neon.purple,
            opacity: 0.05,
            transform: [{ rotate: spin }],
          }}
        />
      </LinearGradient>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[Components.scrollContainer, { paddingHorizontal: Spacing.lg }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  marginTop: Spacing.md,
                  marginBottom: Spacing.xl,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: Typography.fontSize.xl,
                  color: Colors.neon.blue,
                  marginRight: Spacing.xs,
                }}>
                  ←
                </Text>
                <Text style={{
                  fontSize: Typography.fontSize.md,
                  color: Colors.neon.blue,
                  fontWeight: '600',
                }}>
                  Terug
                </Text>
              </TouchableOpacity>

              {/* Header */}
              <View style={{
                alignItems: 'center',
                marginBottom: Spacing.xl,
              }}>
                <View style={{
                  width: MilaFuturistic.scale(100),
                  height: MilaFuturistic.scale(100),
                  borderRadius: 50,
                  backgroundColor: Colors.glass.whiteLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing.lg,
                  borderWidth: 2,
                  borderColor: Colors.neon.purple,
                }}>
                  <Text style={{
                    fontSize: Typography.fontSize.gigantic,
                  }}>
                    🔐
                  </Text>
                </View>

                <Text style={{
                  fontSize: Typography.fontSize.xxl,
                  fontWeight: '900',
                  color: Colors.text.dark.primary,
                  marginBottom: Spacing.sm,
                }}>
                  Wachtwoord Reset
                </Text>

                <Text style={{
                  fontSize: Typography.fontSize.md,
                  color: Colors.text.dark.secondary,
                  textAlign: 'center',
                  lineHeight: Typography.fontSize.md * 1.5,
                }}>
                  Geen stress! We sturen je een magic link{'\n'}om weer toegang te krijgen.
                </Text>
              </View>

              {/* Form - Glass Card */}
              <View style={[
                Components.glassCard,
                {
                  marginHorizontal: 0,
                  marginBottom: Spacing.lg,
                }
              ]}>
                <View style={{ marginBottom: Spacing.lg }}>
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    color: Colors.text.dark.secondary,
                    marginBottom: Spacing.xs,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    E-mailadres
                  </Text>
                  <TextInput
                    style={[
                      Components.inputFuturistic,
                      { borderColor: Colors.neon.purple }
                    ]}
                    placeholder="future@mila.nl"
                    placeholderTextColor={Colors.text.dark.disabled}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.neon.purple, Colors.neon.blue]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      Components.buttonGradient,
                      isLoading && { opacity: 0.7 },
                      {
                        ...Platform.select({
                          ios: {
                            shadowColor: Colors.neon.purple,
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                          },
                          android: {
                            elevation: 10,
                          },
                        }),
                      }
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={Colors.text.dark.primary} />
                    ) : (
                      <Text style={Components.buttonTextFuturistic}>
                        Send Reset Link →
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Help Text */}
              <View style={{
                backgroundColor: Colors.glass.whiteLight,
                borderRadius: Layouts.borderRadius.md,
                padding: Spacing.md,
                borderWidth: 1,
                borderColor: Colors.neon.blue,
              }}>
                <Text style={{
                  fontSize: Typography.fontSize.sm,
                  color: Colors.text.dark.secondary,
                  lineHeight: Typography.fontSize.sm * 1.5,
                }}>
                  💡 <Text style={{ fontWeight: '700', color: Colors.neon.blue }}>Pro tip:</Text>{' '}
                  Check ook je spam folder. Onze futuristische emails komen soms in de verkeerde dimensie terecht.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
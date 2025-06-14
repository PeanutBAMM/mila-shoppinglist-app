import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MilaFuturistic from '../../src/styles/MilaFuturisticStyle';
import { useAuth } from '../../src/contexts/AuthContext';

const { Colors, Typography, Spacing, Layouts, Components, Glass } = MilaFuturistic;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FuturisticLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);
  const { signInWithGoogle } = useAuth();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
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

    // Continuous pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation for background element
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Let op', 'Vul alle velden in');
      return;
    }

    setIsLoading(true);
    // TODO: Implement Supabase login
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    console.log('Google sign in button clicked');
    try {
      setIsGoogleLoading(true);
      const result = await signInWithGoogle();
      console.log('Google sign in result:', result);
      
      if (result.success) {
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
      setIsGoogleLoading(false);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={Components.darkContainer}>
      {/* Animated Background */}
      <LinearGradient
        colors={Colors.gradients.cosmic}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        {/* Floating orbs */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '10%',
            right: '-20%',
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            borderRadius: SCREEN_WIDTH * 0.4,
            backgroundColor: Colors.neon.purple,
            opacity: 0.1,
            transform: [{ rotate: spin }, { scale: pulseAnim }],
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-30%',
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            borderRadius: SCREEN_WIDTH * 0.5,
            backgroundColor: Colors.neon.blue,
            opacity: 0.1,
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
              {/* Logo Section */}
              <View style={{
                alignItems: 'center',
                marginTop: Spacing.xxxl,
                marginBottom: Spacing.xl,
              }}>
                <Animated.View
                  style={[
                    {
                      transform: [{ scale: pulseAnim }],
                    }
                  ]}
                >
                  <LinearGradient
                    colors={Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      Components.avatarFuturistic,
                      {
                        ...Platform.select({
                          ios: {
                            shadowColor: Colors.neon.pink,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 20,
                          },
                          android: {
                            elevation: 20,
                          },
                        }),
                      }
                    ]}
                  >
                    <Text style={{
                      fontSize: Typography.fontSize.gigantic,
                      color: Colors.text.dark.primary,
                      fontWeight: '900',
                    }}>
                      M
                    </Text>
                  </LinearGradient>
                </Animated.View>

                <Text style={{
                  fontSize: Typography.fontSize.huge,
                  fontWeight: '900',
                  color: Colors.text.dark.primary,
                  marginTop: Spacing.lg,
                  marginBottom: Spacing.xs,
                  letterSpacing: -1,
                }}>
                  Welkom bij Mila
                </Text>

                <Text style={{
                  fontSize: Typography.fontSize.md,
                  color: Colors.text.dark.secondary,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}>
                  De toekomst van boodschappen
                </Text>
              </View>

              {/* Login Form - Glass Card */}
              <View style={[
                Components.glassCard,
                {
                  marginHorizontal: 0,
                  ...Platform.select({
                    ios: {
                      shadowColor: Colors.neon.blue,
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.1,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 10,
                    },
                  }),
                }
              ]}>
                {/* Email Input */}
                <View style={{ marginBottom: Spacing.md }}>
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
                      focusedInput === 'email' && Components.inputFocused,
                    ]}
                    placeholder="future@mila.nl"
                    placeholderTextColor={Colors.text.dark.disabled}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: Spacing.lg }}>
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    color: Colors.text.dark.secondary,
                    marginBottom: Spacing.xs,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Wachtwoord
                  </Text>
                  <TextInput
                    style={[
                      Components.inputFuturistic,
                      focusedInput === 'password' && Components.inputFocused,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.text.dark.disabled}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                </View>

                {/* Remember Me & Forgot */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: Spacing.xl,
                }}>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: rememberMe ? Colors.neon.blue : Colors.glass.whiteStrong,
                      backgroundColor: rememberMe ? Colors.neon.blue : 'transparent',
                      marginRight: Spacing.xs,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {rememberMe && (
                        <Text style={{ color: Colors.dark.background, fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                      )}
                    </View>
                    <Text style={{
                      fontSize: Typography.fontSize.sm,
                      color: Colors.text.dark.secondary,
                    }}>
                      Onthoud mij
                    </Text>
                  </TouchableOpacity>

                  <Link href="/(auth)/forgot-password" asChild>
                    <TouchableOpacity>
                      <Text style={{
                        fontSize: Typography.fontSize.sm,
                        color: Colors.neon.blue,
                        fontWeight: '600',
                      }}>
                        Wachtwoord vergeten?
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      Components.buttonGradient,
                      isLoading && { opacity: 0.7 },
                      {
                        ...Platform.select({
                          ios: {
                            shadowColor: Colors.neon.pink,
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
                        Login to the Future
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={Components.dividerFuturistic} />

                {/* Google Login */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  style={[
                    Components.buttonGlass,
                    {
                      borderColor: Colors.neon.blue,
                      borderWidth: 1,
                      opacity: isGoogleLoading ? 0.7 : 1,
                    }
                  ]}
                  activeOpacity={0.8}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator color={Colors.text.dark.primary} />
                  ) : (
                    <>
                      <Text style={{ fontSize: 20, marginRight: Spacing.sm }}>🌐</Text>
                      <Text style={[
                        Components.buttonTextFuturistic,
                        { fontWeight: '600' }
                      ]}>
                        Continue with Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={{
                alignItems: 'center',
                marginTop: Spacing.xl,
                marginBottom: Spacing.lg,
              }}>
                <Text style={{
                  fontSize: Typography.fontSize.sm,
                  color: Colors.text.dark.secondary,
                }}>
                  Nieuw bij Mila?{' '}
                </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity style={{ marginTop: Spacing.xs }}>
                    <Text style={{
                      fontSize: Typography.fontSize.md,
                      color: Colors.neon.blue,
                      fontWeight: '700',
                      textDecorationLine: 'underline',
                    }}>
                      Start je reis hier →
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {/* Premium Badge */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <LinearGradient
                  colors={Colors.gradients.aurora}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: Layouts.borderRadius.lg,
                    padding: Spacing.md,
                    marginBottom: Spacing.xl,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.neon.blue,
                  }}
                >
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    color: Colors.dark.background,
                    fontWeight: '800',
                    textAlign: 'center',
                  }}>
                    🚀 30 DAGEN GRATIS PREMIUM AI
                  </Text>
                </LinearGradient>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
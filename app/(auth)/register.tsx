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
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MilaFuturistic from '../../src/styles/MilaFuturisticStyle';

const { Colors, Typography, Spacing, Layouts, Components, Glass } = MilaFuturistic;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FuturisticRegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

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

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    // Validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Oeps!', 'Vul alle velden in om door te gaan');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch!', 'Wachtwoorden komen niet overeen');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Terms', 'Accepteer de voorwaarden om verder te gaan');
      return;
    }

    setIsLoading(true);
    // TODO: Implement Supabase registration
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Welcome to the Future! 🚀',
        'Je account is klaar met 30 dagen Premium AI',
        [{ text: "Let's Go!", onPress: () => router.replace('/(tabs)') }]
      );
    }, 1500);
  };

  const handleGoogleRegister = () => {
    Alert.alert('Coming Soon', 'Google signup wordt binnenkort gelanceerd! 🌟');
  };

  return (
    <View style={Components.darkContainer}>
      {/* Animated Background */}
      <LinearGradient
        colors={Colors.gradients.night}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        {/* Floating particles */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Colors.neon.green,
            opacity: 0.1,
            transform: [{ translateY: floatAnim }],
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '5%',
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: Colors.neon.purple,
            opacity: 0.1,
            transform: [{ translateY: floatAnim }],
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
                <Text style={{
                  fontSize: Typography.fontSize.huge,
                  fontWeight: '900',
                  color: Colors.text.dark.primary,
                  marginBottom: Spacing.xs,
                  letterSpacing: -1,
                }}>
                  Join the Future
                </Text>

                <Text style={{
                  fontSize: Typography.fontSize.md,
                  color: Colors.text.dark.secondary,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}>
                  Begin je AI-powered shopping reis
                </Text>
              </View>

              {/* Premium Banner */}
              <Animated.View
                style={{
                  opacity: glowAnim,
                }}
              >
                <LinearGradient
                  colors={Colors.gradients.aurora}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: Layouts.borderRadius.lg,
                    padding: Spacing.md,
                    marginBottom: Spacing.lg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.neon.green,
                    ...Platform.select({
                      ios: {
                        shadowColor: Colors.neon.green,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                      },
                      android: {
                        elevation: 10,
                      },
                    }),
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: Spacing.sm }}>🎁</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: Typography.fontSize.md,
                      color: Colors.dark.background,
                      fontWeight: '800',
                    }}>
                      30 DAGEN GRATIS PREMIUM
                    </Text>
                    <Text style={{
                      fontSize: Typography.fontSize.xs,
                      color: Colors.dark.surface,
                      marginTop: 2,
                    }}>
                      AI Assistant • Smart Lists • Voice Control
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Registration Form - Glass Card */}
              <View style={[
                Components.glassCard,
                {
                  marginHorizontal: 0,
                  ...Platform.select({
                    ios: {
                      shadowColor: Colors.neon.purple,
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
                <View style={{ marginBottom: Spacing.md }}>
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
                    placeholder="Minimaal 8 karakters"
                    placeholderTextColor={Colors.text.dark.disabled}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                </View>

                {/* Confirm Password Input */}
                <View style={{ marginBottom: Spacing.lg }}>
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    color: Colors.text.dark.secondary,
                    marginBottom: Spacing.xs,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Bevestig wachtwoord
                  </Text>
                  <TextInput
                    style={[
                      Components.inputFuturistic,
                      focusedInput === 'confirmPassword' && Components.inputFocused,
                    ]}
                    placeholder="Herhaal je wachtwoord"
                    placeholderTextColor={Colors.text.dark.disabled}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                {/* Terms Checkbox */}
                <TouchableOpacity
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: Spacing.xl,
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: acceptTerms ? Colors.neon.green : Colors.glass.whiteStrong,
                    backgroundColor: acceptTerms ? Colors.neon.green : 'transparent',
                    marginRight: Spacing.sm,
                    marginTop: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {acceptTerms && (
                      <Text style={{ color: Colors.dark.background, fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                    )}
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: Typography.fontSize.sm,
                    color: Colors.text.dark.secondary,
                    lineHeight: Typography.fontSize.sm * 1.5,
                  }}>
                    Ik accepteer de{' '}
                    <Text style={{ color: Colors.neon.blue, fontWeight: '600' }}>
                      voorwaarden
                    </Text>
                    {' '}en{' '}
                    <Text style={{ color: Colors.neon.blue, fontWeight: '600' }}>
                      privacy policy
                    </Text>
                  </Text>
                </TouchableOpacity>

                {/* Register Button */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={Colors.gradients.secondary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      Components.buttonGradient,
                      isLoading && { opacity: 0.7 },
                      {
                        ...Platform.select({
                          ios: {
                            shadowColor: Colors.neon.green,
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
                        Start je Gratis Trial →
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={Components.dividerFuturistic} />

                {/* Google Register */}
                <TouchableOpacity
                  onPress={handleGoogleRegister}
                  style={[
                    Components.buttonGlass,
                    {
                      borderColor: Colors.neon.purple,
                      borderWidth: 1,
                    }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 20, marginRight: Spacing.sm }}>🌐</Text>
                  <Text style={[
                    Components.buttonTextFuturistic,
                    { fontWeight: '600' }
                  ]}>
                    Sign up with Google
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View style={{
                alignItems: 'center',
                marginTop: Spacing.xl,
                marginBottom: Spacing.xxxl,
              }}>
                <Text style={{
                  fontSize: Typography.fontSize.sm,
                  color: Colors.text.dark.secondary,
                }}>
                  Al een account?{' '}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={{ marginTop: Spacing.xs }}>
                    <Text style={{
                      fontSize: Typography.fontSize.md,
                      color: Colors.neon.purple,
                      fontWeight: '700',
                    }}>
                      Log in →
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
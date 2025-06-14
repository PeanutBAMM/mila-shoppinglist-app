import React, { useState } from 'react'
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
} from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle login
  const handleLogin = async () => {
    // Reset errors
    setErrors({ email: '', password: '', general: '' })

    // Validate inputs
    let hasError = false
    const newErrors = { email: '', password: '', general: '' }

    if (!email) {
      newErrors.email = 'E-mailadres is verplicht'
      hasError = true
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ongeldig e-mailadres'
      hasError = true
    }

    if (!password) {
      newErrors.password = 'Wachtwoord is verplicht'
      hasError = true
    } else if (password.length < 6) {
      newErrors.password = 'Wachtwoord moet minimaal 6 karakters zijn'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ ...errors, general: 'Onjuist e-mailadres of wachtwoord' })
        } else {
          setErrors({ ...errors, general: 'Er is een fout opgetreden. Probeer het later opnieuw.' })
        }
        return
      }

      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email)
      } else {
        await AsyncStorage.removeItem('savedEmail')
      }

      // Navigate to home screen
      router.replace('/(tabs)')
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ ...errors, general: 'Er is een fout opgetreden. Probeer het later opnieuw.' })
    } finally {
      setLoading(false)
    }
  }

  // Load saved email on mount
  React.useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await AsyncStorage.getItem('savedEmail')
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    }
    loadSavedEmail()
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
          {/* Logo/Title */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 8 }}>Mila</Text>
            <Text style={{ fontSize: 18, color: '#7F8C8D' }}>
              Jouw slimme boodschappen assistent
            </Text>
          </View>

          {/* Error message */}
          {errors.general ? (
            <View style={{ 
              backgroundColor: '#FEE2E2', 
              borderWidth: 1, 
              borderColor: '#FECACA', 
              borderRadius: 8, 
              padding: 12, 
              marginBottom: 24 
            }}>
              <Text style={{ color: '#DC2626', textAlign: 'center' }}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Email input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#2C3E50', fontWeight: '500', marginBottom: 8 }}>E-mailadres</Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: errors.email ? '#EF4444' : '#D1D5DB',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: '#2C3E50'
              }}
              placeholder="jouw@email.nl"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4 }}>{errors.email}</Text>
            ) : null}
          </View>

          {/* Password input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#2C3E50', fontWeight: '500', marginBottom: 8 }}>Wachtwoord</Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: errors.password ? '#EF4444' : '#D1D5DB',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: '#2C3E50'
              }}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password ? (
              <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4 }}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Remember me checkbox */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderRadius: 4,
                backgroundColor: rememberMe ? '#FF6B6B' : 'transparent',
                borderColor: rememberMe ? '#FF6B6B' : '#D1D5DB',
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {rememberMe && (
                  <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
                )}
              </View>
              <Text style={{ color: '#2C3E50' }}>Onthoud mij</Text>
            </TouchableOpacity>
            
            <View style={{ flex: 1 }} />
            
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={{ color: '#FF6B6B', fontSize: 14 }}>Wachtwoord vergeten?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9CA3AF' : '#FF6B6B',
              borderRadius: 8,
              paddingVertical: 16,
              marginBottom: 16,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 18 }}>
                Inloggen
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
            <Text style={{ marginHorizontal: 12, color: '#7F8C8D' }}>of</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
          </View>

          {/* Google login button */}
          <TouchableOpacity
            onPress={() => Alert.alert('Google Login', 'Google login wordt binnenkort toegevoegd!')}
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingVertical: 16,
              marginBottom: 24
            }}
          >
            <Text style={{ color: '#2C3E50', textAlign: 'center', fontWeight: '500' }}>
              Doorgaan met Google
            </Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#7F8C8D' }}>Nog geen account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={{ color: '#FF6B6B', fontWeight: '600' }}>Registreer nu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

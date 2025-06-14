import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession()

export function GoogleAuthTest() {
  const handleGoogleSignIn = async () => {
    try {
      // For Expo, we use the web browser auth flow
      const redirectUrl = makeRedirectUri({
        scheme: 'mila',
        path: 'auth/callback'
      })
      
      console.log('Redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true
        }
      })
      
      if (error) throw error
      
      // Open the OAuth URL in the browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        )
        
        if (result.type === 'success' && result.url) {
          // Parse the URL to get the auth tokens
          const url = new URL(result.url)
          const access_token = url.searchParams.get('access_token')
          const refresh_token = url.searchParams.get('refresh_token')
          
          if (access_token && refresh_token) {
            // Set the session
            const { data: session, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            })
            
            if (sessionError) throw sessionError
            
            Alert.alert('Success!', `Welkom ${session.user?.email}`)
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
      console.error('Google sign in error:', error)
    }
  }
  
  const testEmailAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'Test123!',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })
      
      if (error) throw error
      
      Alert.alert('Success', 'Check je email voor verificatie!')
      console.log('User created:', data)
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }
  
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .limit(1)
      
      if (error) throw error
      
      Alert.alert('Connected!', `Found ${data.length} stores`)
    } catch (error: any) {
      Alert.alert('Connection Error', error.message)
    }
  }
  
  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        OAuth Test Component
      </Text>
      
      <TouchableOpacity
        onPress={checkConnection}
        style={{
          backgroundColor: '#10b981',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Test Supabase Connection
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={testEmailAuth}
        style={{
          backgroundColor: '#3b82f6',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Test Email Signup
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        style={{
          backgroundColor: '#ea4335',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Test Google Sign In
        </Text>
      </TouchableOpacity>
    </View>
  )
}
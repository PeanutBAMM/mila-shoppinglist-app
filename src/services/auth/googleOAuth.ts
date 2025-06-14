// OAuth implementation for Expo with Supabase
// Supports both native and web platforms

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Ensure web browser sessions complete properly
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    // For web, use the current origin
    return `${window.location.origin}/auth/callback`;
  }
  
  // For native platforms
  return AuthSession.makeRedirectUri({
    scheme: Constants.expoConfig?.scheme || 'mila',
    path: 'auth/callback'
  });
};

export const signInWithGoogle = async () => {
  try {
    const redirectUri = getRedirectUri();
    console.log('OAuth redirect URI:', redirectUri);

    if (Platform.OS === 'web') {
      // Web implementation - direct redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // On web, the browser will redirect automatically
      return { success: true };
    } else {
      // Native implementation using WebBrowser
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No URL returned from Supabase');

      // Open auth session for native
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );

      if (result.type === 'success' && result.url) {
        // Extract tokens from URL
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.substring(1));
        
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        
        if (access_token && refresh_token) {
          // Set session in Supabase
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          
          if (sessionError) throw sessionError;
          return { success: true, session: sessionData };
        }
      }
      
      return { success: false, error: 'Authentication cancelled' };
    }
  } catch (error) {
    console.error('OAuth error:', error);
    return { success: false, error };
  }
};

// Function to handle the OAuth callback on web
export const handleOAuthCallback = async () => {
  if (Platform.OS === 'web') {
    try {
      const { data, error } = await supabase.auth.getSessionFromUrl({ 
        storeSession: true 
      });
      
      if (error) throw error;
      
      return { success: true, session: data.session };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return { success: false, error };
    }
  }
  
  return { success: false, error: 'Not on web platform' };
};

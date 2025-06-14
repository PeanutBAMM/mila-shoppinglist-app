/**
 * OAuth Configuration for Mila App
 * Generated on: June 13, 2025
 * 
 * IMPORTANT: This file contains OAuth client IDs. These are safe to commit to version control
 * as they are public identifiers. However, NEVER commit client secrets.
 */

export const OAuthConfig = {
  // Google OAuth Client IDs
  google: {
    // Web client - used for Expo development
    webClientId: '825601697120-ja9m7sp9u7q4bmv4b41mp9tgg2tldr5e.apps.googleusercontent.com',
    
    // Android client - used for Android production builds
    androidClientId: '825601697120-vfsijc6ld5dlaruu5pb5vd4b5qooi7kf.apps.googleusercontent.com',
    
    // iOS client - TODO: Add when creating iOS OAuth client
    iosClientId: null,
  },
  
  // OAuth redirect configuration
  redirectUrls: {
    development: {
      metro: 'http://localhost:8081/auth/callback',      // Metro bundler (React Native)
      web: 'http://localhost:19006/auth/callback',       // Expo web
    },
    production: 'https://lfaybrusgkaxmovyegy.supabase.co/auth/v1/callback',
  },
  
  // Package information
  android: {
    packageName: 'com.yourcompany.mila',
    // TODO: Replace with actual SHA-1 fingerprint from your keystore
    sha1Fingerprint: 'DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09',
  },
  
  // Supabase configuration (to be used with OAuth)
  supabase: {
    // These will be set from environment variables
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lfaybrusgkaxmovyegy.supabase.co',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    projectId: 'lfaybrusgkaxmovyegy',
  },
};

// Helper function to get the appropriate client ID based on platform
export function getGoogleClientId(platform: 'web' | 'android' | 'ios' = 'web'): string | null {
  switch (platform) {
    case 'web':
      return OAuthConfig.google.webClientId;
    case 'android':
      return OAuthConfig.google.androidClientId;
    case 'ios':
      return OAuthConfig.google.iosClientId;
    default:
      return OAuthConfig.google.webClientId;
  }
}

// OAuth scopes needed for the app
export const OAUTH_SCOPES = [
  'openid',
  'profile',
  'email',
];

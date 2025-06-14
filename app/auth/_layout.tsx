import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Inloggen',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Registreren',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login-email" 
        options={{ 
          title: 'Inloggen met e-mail',
          headerBackTitle: 'Terug'
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Wachtwoord vergeten',
          headerBackTitle: 'Terug'
        }} 
      />
      <Stack.Screen 
        name="login-example" 
        options={{ 
          title: 'Login Voorbeeld',
          headerBackTitle: 'Terug'
        }} 
      />
    </Stack>
  );
}

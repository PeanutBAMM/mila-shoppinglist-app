import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Inloggen',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Registreren',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
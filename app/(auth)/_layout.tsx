import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="player-signup" />
      <Stack.Screen name="manager-signup" />
      <Stack.Screen name="director-signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="two-factor-setup" />
    </Stack>
  );
}
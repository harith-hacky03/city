import { Stack } from 'expo-router';

export default function MapsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: 'none',
    }}>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: 'Details',
        }}
      />
    </Stack>
  );
} 
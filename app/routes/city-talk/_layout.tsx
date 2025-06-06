import { Stack } from 'expo-router';

export default function CityTalkLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: false,
          presentation: 'modal'
        }}
      />
    </Stack>
  );
} 
import { Stack } from 'expo-router';
import { PetProvider } from '../context/PetContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <PetProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="food/[id]"
          options={{ title: 'Food Details', presentation: 'modal' }}
        />
        <Stack.Screen
          name="pet/add"
          options={{ title: 'Add Pet', presentation: 'modal' }}
        />
        <Stack.Screen
          name="pet/[id]"
          options={{ title: 'Edit Pet', presentation: 'modal' }}
        />
      </Stack>
    </PetProvider>
  );
}

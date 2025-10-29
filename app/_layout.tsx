import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'サンプル集' }} />
      <Stack.Screen name="counter/index" options={{ title: 'カウンター' }} />
    </Stack>
  );
}

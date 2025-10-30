import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'サンプル集' }} />
        <Stack.Screen name="counter/index" options={{ title: 'カウンター' }} />
        <Stack.Screen name="draggable-flatlist-sample/index" options={{ title: 'draggable-flatlistのサンプル' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

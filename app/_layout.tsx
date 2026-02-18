import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'サンプル集' }} />
        <Stack.Screen name="screen/Counter" options={{ title: 'カウンター' }} />
        <Stack.Screen name="screen/DraggableFlatListSample" options={{ title: 'draggable-flatlistのサンプル' }} />
        <Stack.Screen name="screen/Camera" options={{ title: 'カメラのサンプル' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

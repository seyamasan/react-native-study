import { Text, View, Button, Alert } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>ボタンです。</Text>
      <Button
        onPress={() => Alert.alert('Simple Button pressed')} // このアラートはモバイルのみで表示されるみたい
        title="Learn More"
        color="#841584"
      />
    </View>
  );
}

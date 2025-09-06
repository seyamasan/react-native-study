import { useState } from 'react';
import { Text, View, Button, Alert } from "react-native";

export default function Index() {
  const [count, setCount] = useState(0); // フックを用いて状態管理

  const handleButtonPress = () => {
    setCount(count + 1) // 状態を更新
    
    Alert.alert(
      'ボタンをタップしました。',
      `+1されます。`
    ) // このアラートはモバイルのみで表示されるみたい
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{ count }回ボタンをタップしました。</Text>
      <Button
        onPress={
          () => handleButtonPress()
        } 
        title="カウントアップ"
        color="#841584"
      />
    </View>
  );
}

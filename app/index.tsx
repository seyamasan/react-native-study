import { useState } from 'react';
import { Alert, Button, Text, View } from "react-native";
import styles from './theme/styles';

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
    <View style={styles.container}>
      <Text>{ count }回ボタンをタップしました。</Text>
      <View style={styles.space} />
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

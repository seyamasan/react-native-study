import { ScrollView, View, Button, Text } from "react-native";
import { Link } from "expo-router";
import colors from './theme/colors';
import styles from './theme/styles';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      {/* スクロール部分 */}
      <ScrollView contentContainerStyle={styles.container}>
        <Link href="/counter" asChild>
          <Button title="カウンター画面へGo" color={colors.primary} />
        </Link>
        <View style={styles.space} />
        <Link href="/draggable-flatlist-sample" asChild>
          <Button title="draggable-flatlistのサンプル画面へGo" color={colors.primary} />
        </Link>
      </ScrollView>
    </View>
  );
}

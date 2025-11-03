import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function DraggableFlatListSample() {
  interface ListItem {
    id: string;
    label: string;
    backgroundColor: string;
  };

  const initialData: ListItem[] = [
    { id: 'item-1', label: 'りんご', backgroundColor: '#FFEBEE' },
    { id: 'item-2', label: 'バナナ', backgroundColor: '#FFF8E1' },
    { id: 'item-3', label: 'さくらんぼ', backgroundColor: '#F3E5F5' },
    { id: 'item-4', label: 'マスカット', backgroundColor: '#E8F5E9' },
    { id: 'item-5', label: '巨峰', backgroundColor: '#E3F2FD' },
    { id: 'item-6', label: 'ドリアン', backgroundColor: '#E0F2F1' },
  ];

  const [data, setData] = useState<ListItem[]>(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    return (
      <TouchableOpacity
        onLongPress={drag} // 長押しでドラッグを開始する
        disabled={isActive} // ドラッグ中はインタラクション無効化
        style={[
          styles.row,
          { backgroundColor: item.backgroundColor },
          isActive && styles.activeRow,
        ]}
      >
        <Text style={styles.label}>{item.label}</Text>
        <View style={styles.dragHint}>
          <Text style={styles.dragHintText}>≡ 長押しで並び替え</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          長押しして上下にドラッグして並び替えできます。{'\n'}
          iOSとAndroidのみで動作します。
        </Text>
      </View>

      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id} // ユニークなキー(String)を指定
        renderItem={renderItem} // 描画するコンポーネント
        ItemSeparatorComponent={() => <View style={styles.separator} />} // アイテム間の区切り
        onDragEnd={({ data: newData }) => {
          // ドロップしたら走る
          // 並び替え後の配列が渡されるので、そのまま反映
          setData(newData);
        }}
        containerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>現在の順序:</Text>
        <Text style={styles.footerContent}>
          {data.map((d) => d.label).join('  ›  ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#616161',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  activeRow: {
    // ドラッグ中の見た目
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  dragHint: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF99',
  },
  dragHintText: {
    color: '#424242',
    fontSize: 12,
  },
  separator: {
    height: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  footerTitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  footerContent: {
    fontSize: 14,
    color: '#212121',
  },
});
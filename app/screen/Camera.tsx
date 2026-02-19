import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // カメラの権限が読み込み中の時
    return <View />;
  }

  if (!permission.granted) {
    // カメラの権限はまだ許可されていない場合
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラを使用するには、権限を許可してください。</Text>
        <Button onPress={requestPermission} title="権限を許可する" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, facing === 'back' ? styles.buttonBack : styles.buttonFront]}
          onPress={toggleCameraFacing}
        >
          <Ionicons
            name={facing === 'back' ? 'camera-reverse' : 'camera-reverse-outline'}
            size={24}
            color={facing === 'back' ? '#000' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBack: {
    backgroundColor: '#fff',
  },
  buttonFront: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
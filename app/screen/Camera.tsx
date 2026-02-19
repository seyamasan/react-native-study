import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Camera() {
  const [camera, setCamera] = useState<CameraView | null>(null);
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

  // 写真の撮影
  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync();
      
      // Android および iOS ではローカル画像ファイルへの URI
      // Web では base64 文字列
      console.log(photo.uri);
      console.log(photo.base64);
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        facing={facing} 
      />

      <View style={styles.bottomBar}>
        <View style={styles.controlsRow}>
          <View style={styles.sidePlaceholder} />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraReverseButton} onPress={toggleCameraFacing}>
            <Ionicons
              name={facing === 'back' ? 'camera-reverse-outline' : 'camera-reverse'}
              size={24}
              color="#fff"
              style={styles.cameraReverseIcon}
            />
          </TouchableOpacity>
        </View>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
  },
  sidePlaceholder: {
    width: 52,
    height: 52,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  captureInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
  },
  cameraReverseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#888',
  },
  cameraReverseIcon: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
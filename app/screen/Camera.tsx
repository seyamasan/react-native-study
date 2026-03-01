import { CameraView, CameraMode, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Camera() {
  const isWeb = Platform.OS === 'web';

  const [camera, setCamera] = useState<CameraView | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('picture');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [facing, setFacing] = useState<CameraType>('back');
  const [zoom, setZoom] = useState(0); // 0〜1
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  // 録画中だけ 1 秒ごとに秒数を進める
  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      return;
    }

    setRecordingSeconds(0); // 開始時にリセット
    const id = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [isRecording]);

  {/* ここから状態切り替え */}

  // カメラのモードを切り替え
  const onChangeModeSwitch = (value: boolean) => {
    setCameraMode(value ? 'video' : 'picture');

    // なぜかiosだけズーム値が反映されないので、強制的にリセットする仕様にする
    setZoom(0);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  {/* ここからロジック*/}

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

  // 録画の開始
  const startRecording = async () => {
    if (!camera) return;

    setIsRecording(true);

    const result = await camera.recordAsync(); // Web非対応

    console.log(result?.uri);
  };

  // 録画の停止
  const stopRecording = () => {
    if (!camera) return;

    camera.stopRecording();
    setIsRecording(false);
  };

  // 撮影ボタンをタップした時の処理
  const onPressShutter = () => {
    if (cameraMode === 'picture') {
      takePicture();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  // mm:ss フォーマット
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  {/* ここからView */}

  if (!cameraPermission || (!isWeb && !micPermission)) {
    // 権限が読み込み中のとき
    return <View />;
  }

  // Web: カメラだけ / モバイル: カメラ＋マイク
  if (
    !cameraPermission.granted ||
    (!isWeb && micPermission && !micPermission.granted)
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {isWeb
            ? 'カメラの権限を許可してください。'
            : 'カメラとマイクの権限を許可してください。'}
        </Text>
        <Button
          onPress={async () => {
            await requestCameraPermission();
            if (!isWeb) {
              await requestMicPermission();
            }
          }}
          title="権限を許可する"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 録画中だけ表示されるタイマー */}
      {cameraMode === 'video' && isRecording && (
        <View style={styles.recordingTimerContainer}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingTimerText}>
            {formatTime(recordingSeconds)}
          </Text>
        </View>
      )}

      {/* カメラ画面 */}
      <CameraView 
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        mode={cameraMode}
        facing={facing}
        zoom={zoom} // Webも対応されているが、自分の端末では動作していない
      />

      {/* ズームスライダー */}
      <View style={styles.zoomContainer}>
        <Text style={styles.zoomLabel}>
          {/* 1.0x〜4.0x っぽく見せてるだけ（実倍率は端末依存らしい） */}
          {(1 + zoom * 3).toFixed(1)}x
        </Text>
        <Slider
          style={styles.zoomSlider}
          value={zoom}
          minimumValue={0}
          maximumValue={1}
          onValueChange={setZoom}
          minimumTrackTintColor="#ffffff"
          maximumTrackTintColor="rgba(255,255,255,0.4)"
          thumbTintColor="#ffffff"
        />
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.controlsRow}>
          {/* 左側：モード切り替えボタン */}
          <View style={styles.sideArea}>
            {/* Web では常に非表示、ネイティブでも録画中は非表示 */}
            {!isWeb && !isRecording && (
              <View style={styles.modeRow}>
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={cameraMode === 'picture' ? '#fff' : '#aaa'}
                />
                <Switch
                  value={cameraMode === 'video'}
                  onValueChange={onChangeModeSwitch}
                  trackColor={{ false: '#666', true: '#e53935' }}
                  thumbColor="#fff"
                />
                <Ionicons
                  name="videocam-outline"
                  size={18}
                  color={cameraMode === 'video' ? '#fff' : '#aaa'}
                />
              </View>
            )}
          </View>

          {/* 中央：シャッターボタン */}
          <View style={styles.centerArea}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                cameraMode === 'video' && isRecording && styles.captureButtonRecording,
              ]}
              onPress={onPressShutter}
            >
              <View
                style={[
                  styles.captureInner,
                  cameraMode === 'video' && isRecording && styles.captureInnerRecording,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* 右側：インカメ/外カメ切り替え */}
          <View style={styles.sideArea}>
            {/* 録画中は非表示 */}
            {!isRecording && (
              <TouchableOpacity style={styles.cameraReverseButton} onPress={toggleCameraFacing}>
                <Ionicons
                  name={facing === 'back' ? 'camera-reverse-outline' : 'camera-reverse'}
                  size={24}
                  color="#fff"
                  style={styles.cameraReverseIcon}
                />
              </TouchableOpacity>
            )}
          </View>
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
    width: '100%',
    paddingHorizontal: 32,
  },
  sideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  captureButtonRecording: {
    borderColor: '#f33',
  },
  captureInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
  },
  captureInnerRecording: {
    backgroundColor: '#f33',
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
  recordingTimerContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 10,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  recordingTimerText: {
    color: '#fff',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  zoomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 120,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  zoomLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 14,
  },
  zoomSlider: {
    width: '70%',
    height: 40,
  },
});
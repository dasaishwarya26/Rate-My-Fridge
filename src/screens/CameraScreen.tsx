import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { analyzeFridge } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Camera'>;
};

export default function CameraScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to continue.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, base64: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const analysis = await analyzeFridge(base64);
      navigation.navigate('Result', { analysis, imageUri });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong analyzing your fridge. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {imageUri ? 'Looking good! 👀' : 'Show us your fridge'}
        </Text>
        <Text style={styles.subtitle}>
          {imageUri
            ? 'Ready to get roasted?'
            : 'Take a photo or pick one from your gallery'}
        </Text>

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderEmoji}>🚪</Text>
              <Text style={styles.placeholderText}>No fridge selected</Text>
            </View>
          )}
        </View>

        {!imageUri ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => pickImage(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>📸  Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => pickImage(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>🖼  Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={analyzeImage}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0a0a0a" />
                  <Text style={[styles.primaryButtonText, { marginLeft: 10 }]}>
                    Analyzing...
                  </Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>🔍  Rate My Fridge!</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setImageUri(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>↩  Pick Different Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 24 },
  imageContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginBottom: 24,
  },
  preview: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 64, marginBottom: 12 },
  placeholderText: { color: '#555', fontSize: 15 },
  buttonGroup: { gap: 12 },
  primaryButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  primaryButtonText: { color: '#0a0a0a', fontSize: 17, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
});

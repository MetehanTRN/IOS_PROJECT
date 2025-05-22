import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { recognizePlate } from '../utils/plateRecognizer';

export default function TestScreen() {
  const [result, setResult] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);

  const pickImageAndRecognize = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("İzin gerekli!");
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });

    if (!picked.canceled && picked.assets.length > 0) {
      const asset = picked.assets[0];
      setImage(asset.uri);

      // Base64 formatında resmi gönder
      const base64 = `data:image/jpeg;base64,${asset.base64}`;
      const data = await recognizePlate(base64);
      setResult(data);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="📷 Resim Seç ve Plaka Tanı" onPress={pickImageAndRecognize} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultText}>🚗 Tanıma Sonucu:</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
  result: {
    marginTop: 20,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

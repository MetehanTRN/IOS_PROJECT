import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { recognizePlate } from '../utils/plateRecognizer';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Hazır yerel görselleri import et
const testImages = [
  require('../assets/test-plates/plate1.jpg'),
  require('../assets/test-plates/plate2.jpg'),
  require('../assets/test-plates/plate3.jpg'),
];

export default function AutoScanScreen() {
  const [results, setResults] = useState<any[]>([]);

  const processImages = async () => {
    for (let i = 0; i < testImages.length; i++) {
      const image = testImages[i];

      const response = await fetch(Image.resolveAssetSource(image).uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await recognizePlate(base64data);

        const plate = result?.results?.[0]?.plate;
        if (plate) {
          const platesSnapshot = await getDocs(collection(db, 'plates'));
          const matched = platesSnapshot.docs.find((doc) =>
            doc.data().plate?.toLowerCase() === plate.toLowerCase()
          );

          if (matched) {
            await addDoc(collection(db, 'entries'), {
              plate,
              timestamp: serverTimestamp(),
              status: 'Giriş Başarılı',
            });
            Alert.alert('✅ Giriş Başarılı', `${plate} plakalı araç`);
          } else {
            await addDoc(collection(db, 'entries'), {
              plate,
              timestamp: serverTimestamp(),
              status: 'Erişim Reddedildi',
            });
            Alert.alert('❌ Erişim Reddedildi', `${plate} plakası tanımlı değil`);
          }

          setResults((prev) => [...prev, { plate, status: matched ? 'Giriş' : 'Reddedildi' }]);
        }
      };

      reader.readAsDataURL(blob);
      await new Promise((r) => setTimeout(r, 3000)); // 3 saniye bekle → gerçekçi bir tarama hissi
    }
  };

  useEffect(() => {
    processImages();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📂 Görseller Otomatik İşleniyor</Text>
      {results.map((r, i) => (
        <Text key={i} style={{ marginVertical: 4 }}>
          {r.plate} → {r.status}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

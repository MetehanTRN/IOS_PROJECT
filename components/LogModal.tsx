import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { query, orderBy, limit } from "firebase/firestore";

interface LogModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LogModal({ visible, onClose }: LogModalProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const { dark } = useTheme();

  useEffect(() => {
    if (visible) {
      const q = query(
        collection(db, "entries"),
        orderBy("timestamp", "desc"),
        limit(15)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logsData = snapshot.docs.map((doc) => doc.data());
        setLogs(logsData);
      });

      return () => unsubscribe();
    }
  }, [visible]);

  const windowHeight = Dimensions.get('window').height;
  const maxHeight = windowHeight * 0.8; // Modal yüksekliği ekranın %80'ini geçmesin

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: dark ? '#000000aa' : '#00000088' }]}>
        <View style={[styles.container, { backgroundColor: dark ? '#1e1e1e' : '#fff', maxHeight }]}>
          <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>Giriş/Çıkış Kayıtları</Text>
          <FlatList
            data={logs}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.logEntry,
                  {
                    backgroundColor: dark ? '#333' : '#f4f4f4',
                  },
                ]}
              >
                <Text style={{ color: dark ? '#ddd' : '#333' }}>Plaka: {item.plate}</Text>
                <Text style={{ color: dark ? '#ddd' : '#333' }}>Giriş Zamanı: {item.timestamp?.toDate().toString()}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: dark ? '#555' : '#ccc' }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    width: '85%',
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  logEntry: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

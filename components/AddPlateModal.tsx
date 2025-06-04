// AddPlateModal.tsx - Dark/Light tema uyumlu hale getirildi
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useTheme } from 'react-native-paper';
import { useEffect } from 'react';
import { deleteDoc, doc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { normalizePlate } from '../utils/normalizePlate';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';


type Props = {
  visible: boolean;
  onClose: () => void;
  prefillPlate?: string;
};

export default function AddPlateModal({ visible, onClose, prefillPlate }: Props) {
  
  useEffect(() => {
    if (visible) {
      setPlate(prefillPlate || '');
      setOwner('');
      setError('');
    }
  }, [visible, prefillPlate]);

  const [plate, setPlate] = useState('');
  const [owner, setOwner] = useState('');
  const [error, setError] = useState('');
  const { dark } = useTheme();

  const handleAdd = () => {
    if (!plate || !owner) return;

    Alert.alert(
      'Emin misiniz?',
      'Bu plakayı kaydetmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const plateQuery = query(
                collection(db, "plates"),
                where("plate", "==", plate.trim().toUpperCase())
              );
              const existing = await getDocs(plateQuery);

              if (!existing.empty) {
                setError("⚠️ Bu plaka zaten kayıtlı.");
                return;
              }

              const newPlate = {
                plate: normalizePlate(plate),
                owner: owner.trim(),
                timestamp: serverTimestamp(),
              };

              await addDoc(collection(db, "plates"), newPlate);
              const blacklistRef = doc(db, "blacklist", newPlate.plate);
              await deleteDoc(blacklistRef);
              
              setPlate('');
              setOwner('');
              onClose();
            } catch (error) {
              console.error("Plaka eklenemedi:", error);
              setError("❌ Plaka eklenemedi.");
            }
          }
        }

      ]
    );
  };

    useEffect(() => {
    if (visible) {
      setPlate('');
      setOwner('');
      setError('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>➕ Plaka Ekle</Text>
          
          {error !== "" && (
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
              {error}
            </Text>
          )}
          <TextInput
            style={[styles.input, { color: dark ? '#fff' : '#000', borderColor: dark ? '#555' : '#ccc' }]}
            placeholder="Plaka"
            placeholderTextColor={dark ? '#aaa' : '#888'}
            value={plate}
            onChangeText={setPlate}
          />
          <TextInput
            style={[styles.input, { color: dark ? '#fff' : '#000', borderColor: dark ? '#555' : '#ccc' }]}
            placeholder="Ad Soyad"
            placeholderTextColor={dark ? '#aaa' : '#888'}
            value={owner}
            onChangeText={setOwner}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: dark ? '#555' : '#ccc' }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: dark ? '#0288d1' : '#00bcd4' }]}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>Ekle</Text>
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
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 10,
    padding: 20,
    width: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
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
  addButton: {
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase projenin konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyCF0dhT_20J8YBVBCDQ3NGjuHWMgvcG2GOA",
  authDomain: "plate-recognition-system-15ee8.firebaseapp.com",
  projectId: "plate-recognition-system-15ee8",
  storageBucket: "plate-recognition-system-15ee8.appspot.com",
  messagingSenderId: "987248740857",
  appId: "1:987248740057:web:264d2491a06f17c6d260c8",
  measurementId: "G-3MZHNt65GC"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanını başlat
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };


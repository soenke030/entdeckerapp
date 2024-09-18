import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Konfiguration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase-App initialisieren
const app = initializeApp(firebaseConfig);

// Authentifizierungs- und Firestore-Dienste
export const auth = getAuth(app);
export const db = getFirestore(app);

// Persistenz der Authentifizierung einstellen (Benutzer bleibt eingeloggt)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistenz erfolgreich auf lokal eingestellt');
  })
  .catch((error) => {
    console.error('Fehler beim Einstellen der Persistenz:', error);
  });
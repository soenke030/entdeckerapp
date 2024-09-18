"use client";

import { useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import QrScanner from 'react-qr-scanner'; // Verwende den neuen QR-Scanner

export default function Scan() {
  const [scannedCode, setScannedCode] = useState(null);
  const router = useRouter();

  const handleQRScan = async (data) => {
    if (data && data.text && !scannedCode) {
      console.log('Gescanntes QR-Code-Text:', data.text); // Ausgabe des gescannten Textes
      setScannedCode(data.text); // Setze den gescannten Text
  
      try {
        const user = auth.currentUser; // Hol den aktuellen Benutzer
        if (user) {
          const userDoc = doc(db, 'progress', user.uid); // Verweis auf das Dokument des Benutzers
  
          // Fortschritt in Firestore aktualisieren
          await updateDoc(userDoc, {
            current_step: Number(data.text), // Setzt den aktuellen Schritt basierend auf dem QR-Code-Text
          });
  
          alert(`Erfolgreich QR-Code gescannt! Du bist jetzt bei Schritt ${data.text}`);
          router.push('/'); // Zurück zur Startseite
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Fortschritts:', error); // Fehlerausgabe
      }
    }
  };
  

  return (
    <div>
      <h1>QR-Code scannen</h1>
      <QrScanner
        delay={300}
        onError={(err) => console.error(err)}
        onScan={handleQRScan} // Funktion aufrufen, wenn ein QR-Code gescannt wurde
        style={{ width: '100%' }}
      />
    </div>
  );
}

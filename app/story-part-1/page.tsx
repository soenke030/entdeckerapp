"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Importiere Link für Navigation
import QrScanner from 'react-qr-scanner'; // QR Scanner importieren
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Firestore-Funktionen importieren

export default function StoryPart2() {
  const [user, setUser] = useState(null); // Zustand für den eingeloggten Benutzer
  const [scanning, setScanning] = useState(false); // Zustand für den QR-Code-Scanner
  const [currentStep, setCurrentStep] = useState(1); // Aktueller Fortschritt
  const router = useRouter(); // Router für Navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProgress(currentUser.uid); // Fortschritt des Benutzers abrufen
      } else {
        router.push('/login'); // Zur Login-Seite umleiten, wenn nicht eingeloggt
      }
    });

    return () => unsubscribe(); // Clean-up bei Komponentendemontage
  }, []);

  const fetchProgress = async (userId) => {
    const progressDoc = doc(db, 'progress', userId);
    const progressSnapshot = await getDoc(progressDoc);
    if (progressSnapshot.exists()) {
      setCurrentStep(progressSnapshot.data().current_step); // Setze den aktuellen Schritt
    }
  };

  const handleScan = async (data) => {
    if (data && data.text) {
      const scannedText = data.text; // Text des gescannten QR-Codes abrufen
      console.log('Gescannt:', scannedText);

      if (scannedText === 'QR-Code-Schritt-2') {
        // Fortschritt aktualisieren
        const newStep = 2; // Setze den Fortschritt auf 2

        await updateDoc(doc(db, 'progress', user.uid), { current_step: newStep });
        setCurrentStep(newStep); // Aktuellen Schritt setzen
        console.log(`Fortschritt aktualisiert auf Schritt ${newStep}`);
        setScanning(false); // Scanner stoppen

        // Weiterleitung zur nächsten Seite
        router.push('/story-part-2'); // Leitet zur nächsten Geschichte weiter
      } else {
        console.log('Falscher QR-Code:', scannedText);
      }
    }
  };

  const handleError = (err) => {
    console.error('Fehler beim Scannen:', err);
  };

  return (
    <div style={styles.container}>
      {/* App Bar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Link href="/">Logo.png</Link>
        </div>
        <div style={styles.links}>
          <p style={styles.userText}>Eingeloggt als {user?.email || 'Benutzer'}</p>
          <Link href="/profile">Profil</Link>
        </div>
      </nav>

      <div style={styles.content}>
        <h1>Geschichte Teil 1</h1>
        <p>
          Du hast den ersten QR-Code erfolgreich gescannt! Jetzt geht dein Abenteuer weiter.
          Hier ist der nächste Teil deiner Geschichte. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Nulla ac elit nec quam accumsan ultrices.
        </p>

        {/* QR-Code Scanner Toggle */}
        <button onClick={() => setScanning(!scanning)} style={styles.toggleButton}>
          {scanning ? 'QR-Code-Scanner beenden' : 'Jetzt QR-Code scannen'}
        </button>

        {scanning && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', marginTop: '20px' }}
          />
        )}
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#2E2E2E',
    color: 'white',
    fontFamily: '"Roboto", sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003366',
    color: 'white',
    padding: '10px 20px',
    position: 'fixed',
    width: 'calc(100% + 10px)',
    top: 0,
    zIndex: 1000,
    marginLeft: '-20px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  userText: {
    marginRight: '15px',
  },
  content: {
    marginTop: '80px',
  },
  toggleButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};


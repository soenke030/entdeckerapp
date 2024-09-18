"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { useRouter } from 'next/navigation'; // Router für Navigation
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link'; // Importiere Link für Navigation
import QrScanner from 'react-qr-scanner'; // QR Scanner importieren
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Firestore-Funktionen importieren

export default function Story() {
  const [user, setUser] = useState(null); // Zustand für den eingeloggten Benutzer
  const [scanning, setScanning] = useState(false); // Zustand für den QR-Code-Scanner
  const [currentStep, setCurrentStep] = useState(0); // Aktueller Fortschritt
  const router = useRouter(); // Router für Navigation

  const coordinates = [53.69176700446304, 7.802582235433357]; // Beispielkoordinaten

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
    } else {
      await updateDoc(progressDoc, { user_id: userId, current_step: 0 }); // Setze initialen Fortschritt
      setCurrentStep(0); // Setze den aktuellen Schritt auf 0
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Benutzer abmelden
      router.push('/'); // Nach dem Logout zur Startseite weiterleiten
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

  const handleScan = async (data) => {
    if (data && data.text) {
      const scannedText = data.text; // Text des gescannten QR-Codes abrufen
      console.log('Gescannt:', scannedText);

      if (scannedText === 'QR-Code-Schritt-1') {
        // Fortschritt aktualisieren
        const newStep = 1; // Setze den Fortschritt auf 1

        await updateDoc(doc(db, 'progress', user.uid), { current_step: newStep });
        setCurrentStep(newStep); // Aktuellen Schritt setzen
        console.log(`Fortschritt aktualisiert auf Schritt ${newStep}`);
        setScanning(false); // Scanner stoppen
        
        // Navigiere zur neuen Seite oder lade die aktuelle Seite neu
        router.push('/story-part-1'); // Hier könnte eine separate Seite für Teil 2 sein
      } else {
        console.log('Falscher QR-Code:', scannedText);
      }
    }
  };

  const handleError = (err) => {
    console.error('Fehler beim Scannen:', err);
  };

  // Aktueller Geschichtsinhalt basierend auf dem Fortschritt
  const storyContent = currentStep === 0 
    ? 'Geschichte Teil 1: Willkommen zu deinem Abenteuer! Scanne den QR-Code, um fortzufahren.'
    : 'Du hast den ersten QR-Code gescannt und das Abenteuer geht weiter!';

  return (
    <div style={styles.container}>
      {/* App Bar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Link href="/">
            Logo.png
          </Link>
        </div>
        <div style={styles.links}>
          
          <button onClick={handleLogout} style={styles.logoutButton}>
            Abmelden
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1>Eingeloggt als {user?.email || 'Benutzer'}</h1>
        <MapContainer center={coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coordinates}>
            <Popup>Hier startet dein Abenteuer!</Popup>
          </Marker>
        </MapContainer>
        <p>Koordinaten: {coordinates[0]}, {coordinates[1]}</p>

        <p style={styles.instructions}>
          Um das Spiel zu starten, gehe zu diesem Punkt und scanne den ersten QR-Code. 
          Folge den Anweisungen, um dein Abenteuer zu beginnen!
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

        {/* Aktueller Geschichtsinhalt */}
        <p style={styles.storyContent}>{storyContent}</p>
      </div>
    </div>
  );
}

// Inline Styles für die Geschichte
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
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  content: {
    marginTop: '80px',
  },
  instructions: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#FFD700',
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
  storyContent: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#FFD700',
  },
};

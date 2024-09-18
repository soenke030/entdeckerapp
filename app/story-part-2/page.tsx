"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Importiere Link für Navigation
import { doc, getDoc } from 'firebase/firestore'; // Firestore-Funktionen importieren

export default function StoryPart2() {
  const [user, setUser] = useState(null); // Zustand für den eingeloggten Benutzer
  const router = useRouter(); // Router für Navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProgress(currentUser.uid); // Fortschritt des Benutzers abrufen
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
      const progressData = progressSnapshot.data();
      
      if (progressData.current_step < 1) {
        router.push('/story'); // Wenn current_step < 1, zurück zur Story-Seite
      } else if (progressData.current_step === 1) {
        // Wenn current_step 1, weiterleiten zu Story-Part-1
        router.push('/story-part-1');
      } else if (progressData.current_step >= 2) {
        // Hier kann weitere Logik hinzugefügt werden
        // Der Benutzer bleibt auf dieser Seite
      }
    } else {
      router.push('/story'); // Wenn kein Fortschritt gefunden, zurück zur Story-Seite
    }
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
        <h1>Geschichte Teil 2</h1>
        <p>
          Du hast den ersten QR-Code erfolgreich gescannt! Jetzt geht dein Abenteuer weiter.
          Hier ist der nächste Teil deiner Geschichte. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Nulla ac elit nec quam accumsan ultrices.
        </p>
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
};

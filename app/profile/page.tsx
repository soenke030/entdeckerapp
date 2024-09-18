"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore Funktionen
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Authentifizierung
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Link für Navigation zwischen Seiten

export default function Profile() {
  const [user, setUser] = useState(null); // Zustand für den eingeloggten Benutzer
  const [nickname, setNickname] = useState(''); // Zustand für den Spitznamen
  const [progress, setProgress] = useState(null); // Zustand für den Fortschritt
  const [message, setMessage] = useState(''); // Zustand für die Statuskarte
  const router = useRouter(); // Router für Navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const progressDoc = await getDoc(doc(db, 'progress', currentUser.uid)); // Fortschritt des Benutzers abrufen
        if (progressDoc.exists()) {
          const progressData = progressDoc.data();
          setProgress(progressData);
          setNickname(progressData.nickname || ''); // Nickname setzen
        } else {
          router.push('/'); // Zurück zur Startseite, wenn kein Fortschritt gefunden wird
        }
      } else {
        router.push('/'); // Zur Login-Seite umleiten, wenn nicht eingeloggt
      }
    });

    return () => unsubscribe(); // Clean-up bei Komponentendemontage
  }, []);

  const handleUpdate = async () => {
    if (user) {
      await updateDoc(doc(db, 'progress', user.uid), {
        nickname: nickname, // Nickname aktualisieren
      });
      setMessage('Profil aktualisiert!'); // Erfolgreiche Aktualisierung
    }
  };

  // Funktion zum Ausloggen
  const handleLogout = async () => {
    try {
      await signOut(auth); // Benutzer abmelden
      setMessage('Erfolgreich abgemeldet!'); // Erfolgsnachricht setzen
      setTimeout(() => {
        router.push('/'); // Nach dem Logout zur Startseite weiterleiten
      }, 2000); // 2 Sekunden warten bevor weitergeleitet wird
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

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

      <div style={styles.overlay}>
        <div style={styles.content}>
          <h1>Profil von {user?.email}</h1>
          <div style={styles.progressSection}>
            <h2>Fortschritt</h2>
            {progress ? (
              <div>
                <p>Aktueller Schritt: {progress.current_step}</p>
                <p>Story ID: {progress.story_id}</p>
                <p>Punktzahl: {progress.score || 0}</p>
              </div>
            ) : (
              <p>Fortschritt nicht gefunden.</p>
            )}
          </div>
          <h2>Spitzname</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Gib deinen Spitznamen ein"
            style={styles.input}
          />
          <button onClick={handleUpdate} style={styles.button}>Speichern</button>
          {message && <div style={styles.card}>{message}</div>} {/* Statuskarte */}
        </div>
      </div>
    </div>
  );
}

// Inline Styles für die App Bar und den Inhalt
const styles = {
  container: {
    minHeight: '100vh', // Sicherstellen, dass der Hintergrund die volle Höhe abdeckt
    padding: '20px',
    textAlign: 'center', // Inhalte zentrieren
    backgroundColor: '#2E2E2E', // Dunkle Farbe, die an "alt" erinnert
    color: 'white', // Textfarbe auf weiß
    fontFamily: '"Roboto", sans-serif', // Schriftart
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003366', // Dunkelblau
    color: 'white',
    padding: '10px 20px',
    position: 'fixed',
    width: 'calc(100% + 10px)', // Breite um den negativen Margin auszugleichen
    top: 0,
    zIndex: 1000,
    marginLeft: '-20px', // Negativer Rand
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  overlay: {
    position: 'relative',
    minHeight: 'calc(100vh - 80px)', // Höhe unter der Navbar
    backdropFilter: 'blur(5px)', // Unschärfe hinzufügen
    backgroundColor: 'rgba(46, 46, 46, 0.7)', // Dunkler, transparenter Hintergrund
    marginTop: '80px', // Platz für die Navbar
  },
  content: {
    maxWidth: '600px', // Maximalbreite für den Inhalt
    margin: '20px auto', // Zentriert den Inhalt
    padding: '20px',
    backgroundColor: '#003366', // Hintergrund für das Formular
    borderRadius: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid white',
    borderRadius: '4px',
    backgroundColor: '#2E2E2E', // Dunkler Hintergrund für Eingabefelder
    color: 'white', // Textfarbe in den Eingabefeldern
  },
  button: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#0066cc', // Blau für den Button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  progressSection: {
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e', // Dunkler Hintergrund für die Karte
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
};

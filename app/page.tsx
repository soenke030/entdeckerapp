"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseClient'; // Firebase-Client importieren
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Link für Navigation zwischen Seiten
import { doc, getDoc } from 'firebase/firestore'; // Firestore-Funktionen importieren

export default function Home() {
  const [user, setUser] = useState(null); // Zustand für den eingeloggten Benutzer
  const router = useRouter(); // Router für Navigation

  // Beobachte den Authentifizierungsstatus und setze den Benutzer
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean-up bei Komponentendemontage
  }, []);

  // Funktion zum Ausloggen
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Benutzer abmelden
      router.push('/'); // Nach dem Logout zur Startseite weiterleiten
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

  // Funktion zum Handhaben des Klicks auf die Piratengeschichte
  const handleStoryClick = async () => {
    if (!user) {
      // Wenn nicht eingeloggt, zur Login-Seite weiterleiten
      router.push('/login');
      return;
    }

    // Fortgeschritt des Benutzers abrufen
    const progressDoc = doc(db, 'progress', user.uid);
    const progressSnapshot = await getDoc(progressDoc);

    if (progressSnapshot.exists()) {
      const currentStep = progressSnapshot.data().current_step;
      if (currentStep === 0) {
        router.push('/story'); // Leitet zur ersten Geschichte weiter
      } else if (currentStep === 1) {
        router.push('/story-part-1'); // Leitet zur zweiten Geschichte weiter
      } else if (currentStep === 2) {
        router.push('/story-part-2'); // Leitet zur zweiten Geschichte weiter
      }
    } else {
      // Wenn kein Fortschritt gefunden wird, zurück zur ersten Geschichte
      router.push('/story');
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
          {user ? (
            <div>
              <Link href="/profile">Profil</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Abmelden
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <span style={styles.separator}>|</span>
              <Link href="/register">Registrieren</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hauptinhalt */}
      <div style={styles.content}>
        <h1>Willkommen zu Abenteuer.com</h1>
        <h2 style={styles.subTitle}>Wähle deine Geschichte</h2>

        <div style={styles.card} onClick={handleStoryClick}>
          <img src="/assets/pirat.webp" alt="Piratentour" style={styles.image} />
          <p style={styles.cardText}>Piratentour</p>
        </div>

        <p style={styles.description}>
          Willkommen bei Abenteuer.com, der virtuellen Schnitzeljagd! Entdecke spannende Geschichten, 
          finde versteckte QR-Codes und erlebe ein unvergessliches Abenteuer. Wähle deine Geschichte und 
          beginne deine Reise!
        </p>
      </div>
    </div>
  );
}

// Inline Styles für die App Bar und den Inhalt
const styles = {
  container: {
    minHeight: '100vh', // Sicherstellen, dass der Hintergrund die volle Höhe abdeckt
    marginTop: '50px',
    padding: '20px',
    paddingTop: '20px',
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
  separator: {
    margin: '0 10px',
  },
  logoutButton: {
    marginLeft: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  content: {
    maxWidth: '600px', // Maximalbreite für den Inhalt
    margin: '0 auto', // Zentriert den Inhalt
  },
  subTitle: {
    margin: '10px 0',
    fontSize: '18px',
  },
  card: {
    margin: '20px 0',
    padding: '10px',
    border: '2px solid white', // Weißer Rahmen für die Kachel
    borderRadius: '8px',
    display: 'inline-block',
  },
  image: {
    width: '100%', // Bild passt zur Kachel
    borderRadius: '8px',
  },
  cardText: {
    marginTop: '10px',
    fontWeight: 'bold',
  },
  description: {
    marginTop: '20px',
    fontSize: '16px',
  },
};

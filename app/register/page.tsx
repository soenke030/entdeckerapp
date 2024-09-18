"use client";

import { useState } from 'react';
import { auth, db } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Link für Navigation zwischen Seiten
import { setDoc, doc } from 'firebase/firestore'; // Firestore Funktionen

// Funktion zum Generieren eines zufälligen Nicknames
const generateRandomNickname = () => {
  const adjectives = ["Abenteuerlich", "Mutig", "Lustig", "Schnell", "Kreativ"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNumber = Math.floor(Math.random() * 100); // Zufallszahl zwischen 0 und 99
  return `${randomAdjective}${randomNumber}`;
};

export default function Register() {
  const [email, setEmail] = useState(''); // Zustand für die E-Mail
  const [password, setPassword] = useState(''); // Zustand für das Passwort
  const [error, setError] = useState(''); // Zustand für Fehlernachricht
  const router = useRouter(); // Router für Navigation

  const handleRegister = async (e) => {
    e.preventDefault(); // Verhindere das Standard-Formularverhalten
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Benutzer registrieren
      const user = userCredential.user;

      // Generiere einen zufälligen Nickname
      const nickname = generateRandomNickname();

      // Fortschritt in Firestore erstellen
      await setDoc(doc(db, 'progress', user.uid), {
        user_id: user.uid,
        story_id: 1,
        current_step: 0,
        nickname: nickname, // Zufälligen Nickname setzen
        score: 0, // Zufälligen Nickname setzen
      });

      router.push('/login'); // Nach erfolgreicher Registrierung zur Login-Seite weiterleiten
    } catch (err) {
      setError('Fehler bei der Registrierung: ' + err.message); // Fehlernachricht setzen
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
          <Link href="/login">Login</Link>
        </div>
      </nav>

      {/* Registrierungsinhalt */}
      <div style={styles.content}>
        <h1>Registrieren</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Registrieren</button>
        </form>
        <p style={styles.info}>Die Daten werden nur zur Speicherung deines Fortschritts verwendet.</p>
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
  content: {
    maxWidth: '400px', // Maximalbreite für den Inhalt
    margin: '80px auto', // Zentriert den Inhalt, unter der Navbar
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
  error: {
    color: 'red', // Fehlerfarbe
    marginBottom: '10px',
  },
  infoBox: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid white',
    borderRadius: '4px',
    backgroundColor: '#2E2E2E', // Dunkler Hintergrund für die Info-Box
  },
};


"use client";

import { useState } from 'react';
import { auth } from '../../lib/firebaseClient'; // Firebase-Client importieren
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth
import { useRouter } from 'next/navigation'; // Router für Navigation
import Link from 'next/link'; // Link für Navigation zwischen Seiten

export default function Login() {
  const [email, setEmail] = useState(''); // Zustand für die E-Mail
  const [password, setPassword] = useState(''); // Zustand für das Passwort
  const [error, setError] = useState(''); // Zustand für Fehlernachricht
  const [success, setSuccess] = useState(''); // Zustand für Erfolgsmeldung
  const router = useRouter(); // Router für Navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindere das Standard-Formularverhalten
    setError(''); // Fehler zurücksetzen
    setSuccess(''); // Erfolg zurücksetzen
    try {
      await signInWithEmailAndPassword(auth, email, password); // Benutzer einloggen
      setSuccess('Erfolgreich eingeloggt!'); // Erfolgsmeldung setzen
      setTimeout(() => {
        router.push('/'); // Nach erfolgreichem Login zur Startseite weiterleiten
      }, 2000); // 2 Sekunden warten bevor weitergeleitet wird
    } catch (err) {
      setError('Fehler beim Login: ' + err.message); // Fehlernachricht setzen
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
          <Link href="/register">Registrieren</Link>
        </div>
      </nav>

      {/* Login Inhalt */}
      <div style={styles.content}>
        <h1>Login</h1>
        {error && <div style={styles.card}>{error}</div>}
        {success && <div style={styles.card}>{success}</div>}
        <form onSubmit={handleLogin} style={styles.form}>
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
          <button type="submit" style={styles.button}>Einloggen</button>
        </form>
        <p>
          Noch keinen Account? <Link href="/register">Jetzt registrieren</Link>
        </p>
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
  card: {
    backgroundColor: '#1e1e1e', // Dunkler Hintergrund für die Karte
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
};

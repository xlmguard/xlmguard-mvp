
// XLMGuard Buyer & Seller Dashboard (Updated UI + Multilingual + Payment Flow)

import React, { useState, useEffect } from "react";
import {
  Routes, Route, useNavigate, useLocation, Link
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp
} from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut
} from "firebase/auth";
import emailjs from "@emailjs/browser";

const firebaseConfig = {
  apiKey: "AIzaSyC3hxvl6JGceZhOwiaH1O7pNo92pWMeEuQ",
  authDomain: "xlmguard.firebaseapp.com",
  projectId: "xlmguard",
  storageBucket: "xlmguard.firebasestorage.app",
  messagingSenderId: "369260793839",
  appId: "1:369260793839:web:0aa74cbe7a3d3dfbb3701a",
  measurementId: "G-3SFLTB94BV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const EMAILJS_PUBLIC_KEY = "tcS3_a_kZH9ieBNBV";
emailjs.init(EMAILJS_PUBLIC_KEY);

const Navigation = ({ user, logout }) => (
  <nav style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#f9f9f9', padding: '0.5rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
    <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
    {!user && <Link to="/login" style={{ margin: '0 10px' }}>Login/Register</Link>}
    {user && <Link to="/pay" style={{ margin: '0 10px' }}>Pay</Link>}
    {user && <Link to="/register" style={{ margin: '0 10px' }}>Submit TX</Link>}
    {user && <button onClick={logout} style={{ margin: '0 10px' }}>Logout</button>}
  </nav>
);

const HomePage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <img src="/logo.png" alt="XLMGuard Logo" style={{ margin: '0 auto 1rem', width: '105px' }} />
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to XLMGuard</h1>
    <p style={{ fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
      XLMGuard.com is a blockchain-based transaction protection service that helps buyers and sellers verify payments before goods or services are fulfilled. We link contract terms, payment status, shipment data, and dispute flags to ensure secure cross-border commerce with XLM & XRP.
    </p>
    <div style={{ fontSize: '0.75rem', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <p><b>[Español]</b> Protege las transacciones globales con confianza blockchain.</p>
      <p><b>[Português]</b> Protege transações globais com confiança em blockchain.</p>
      <p><b>[Français]</b> Protégez les transactions mondiales avec la confiance de la blockchain.</p>
      <p><b>[Deutsch]</b> Schützen Sie globale Transaktionen mit Blockchain-Vertrauen.</p>
      <p><b>[Italiano]</b> Proteggi le transazioni globali con la fiducia della blockchain.</p>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate("/pay");
    } catch (err) {
      alert("Login error: " + err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        hasPaid: false
      });
      onLogin();
      navigate("/pay");
    } catch (err) {
      alert("Registration error: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Login or Register</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

const PayGate = ({ user }) => {
  const navigate = useNavigate();

  const handlePaidClick = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      hasPaid: true
    });
    navigate("/register");
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Pay for Protection Service</h2>
      <p>Send XLM or XRP to the following wallet and memo:</p>
      <p><b>XLM:</b> GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL</p>
      <p><b>Memo:</b> <code>#1095582935</code></p>
      <p><b>XRP:</b> rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J</p>
      <p><b>Memo:</b> <code>#1952896539</code></p>
      <p>After sending, enter TXID below and click continue:</p>
      <input type="text" placeholder="TXID (Transaction ID)" style={{ width: '300px', padding: '0.5rem', marginBottom: '1rem' }} /><br />
      <button onClick={handlePaidClick}>I've Paid – Continue</button>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const hasPaid = snap.exists() && snap.data().hasPaid;
        setUser(hasPaid ? currentUser : null);
        if (!hasPaid) navigate("/pay");
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [navigate]);

  const logout = () => {
    signOut(auth);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <Navigation user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/pay" element={<PayGate user={user} />} />
        {user && <Route path="/register" element={<div>Transaction registration page coming next.</div>} />}
      </Routes>
    </>
  );
}



































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
  <nav className="bg-gray-100 p-2 flex gap-4 justify-center text-xs fixed bottom-0 w-full border-t">
    <Link to="/">Home</Link>
    {!user && <Link to="/login">Login/Register</Link>}
    {user && <Link to="/pay">Pay</Link>}
    {user && <Link to="/register">Submit TX</Link>}
    {user && <button onClick={logout}>Logout</button>}
  </nav>
);

const HomePage = () => (
  <div className="p-8 text-center">
    <img src="/logo.png" alt="XLMGuard Logo" className="mx-auto mb-4 w-24" />
    <h1 className="text-3xl font-bold mb-2">Welcome to XLMGuard</h1>
    <p className="mb-6 text-sm max-w-xl mx-auto">
      XLMGuard is a blockchain-based transaction protection service that helps buyers and sellers verify payments before goods or services are fulfilled. We link contract terms, payment status, shipment data, and dispute flags — making it ideal for global digital commerce using XLM and XRP transactions.
    </p>
    <div className="text-xs max-w-md mx-auto text-left">
      <p><b>[Español]</b> Protege las transacciones globales con confianza blockchain.</p>
      <p><b>[Português]</b> Protege transações globais com confiança em blockchain.</p>
      <p><b>[Français]</b> Protégez les transactions mondiales avec la confiance de la blockchain.</p>
      <p><b>[Deutsch]</b> Schützen Sie globale Transaktionen mit Blockchain-Vertrauen.</p>
      <p><b>[Italiano]</b> Proteggi le transazioni globali con la fiducia della blockchain.</p>
    </div>
  </div>
);

// [Rest of the code remains unchanged. No need to duplicate unless there are other update requests.]

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

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
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/pay" element={<PayGate user={user} />} />
        {user && <Route path="/register" element={<RegisterTransaction />} />}
        <Route path="/confirmation" element={<TransactionConfirmation />} />
        <Route path="/seller/verify" element={<SellerVerify />} />
      </Routes>
    </>
  );
}
































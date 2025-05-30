// App.js snapshot from May 18, 2025

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import emailjs from "@emailjs/browser";

const firebaseConfig = {
  apiKey: "AIzaSyC3hxvl6JGceZhOwiaH1O7pNo92pWMeEuQ",
  authDomain: "xlmguard.firebaseapp.com",
  projectId: "xlmguard",
  storageBucket: "xlmguard.appspot.com",
  messagingSenderId: "369260793839",
  appId: "1:369260793839:web:0aa74cbe7a3d3dfbb3701a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

emailjs.init("tcS3_a_kZH9ieBNBV");

const HomePage = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <img src="/logo.png" alt="XLMGuard Logo" style={{ width: "100px" }} />
    <h1>Welcome to XLMGuard</h1>
    <p>
      Protect your blockchain transactions using XLMGuard. Ensure your counterparty
      has paid before delivering goods or services. Multilingual and easy to use.
    </p>
    <p><Link to="/login">Login or Register</Link></p>
  </div>
);

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate("/pay");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), { hasPaid: false });
      onLogin();
      navigate("/pay");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Login or Register</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

const PayPage = ({ user }) => {
  const navigate = useNavigate();

  const markPaid = async () => {
    await updateDoc(doc(db, "users", user.uid), { hasPaid: true });
    navigate("/register");
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Make a Payment</h2>
      <p>XLM Wallet: GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL</p>
      <p>Memo: 1095582935</p>
      <p>XRP Wallet: rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J</p>
      <p>Memo: 1952896539</p>
      <button onClick={markPaid}>I Have Paid</button>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        const paid = docSnap.exists() && docSnap.data().hasPaid;
        setUser(paid ? currentUser : null);
        if (!paid) navigate("/pay");
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
        <Route path="/pay" element={<PayPage user={user} />} />
        <Route path="/register" element={<div>TX Registration Page Placeholder</div>} />
      </Routes>
      <footer style={{ position: "fixed", bottom: 0, width: "100%", textAlign: "center" }}>
        {!user ? (
          <Link to="/login">Login/Register</Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </footer>
    </>
  );
};

export default App;








































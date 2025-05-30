
// XLMGuard Buyer & Seller Dashboard (Full Flow with Auth + Payment Gating + Transaction + Seller Verification)

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
  <nav className="bg-gray-100 p-4 flex gap-6 justify-center text-sm">
    <Link to="/">Home</Link>
    {!user && <Link to="/login">Login</Link>}
    {!user && <Link to="/register-user">Register</Link>}
    {user && <Link to="/pay">Pay</Link>}
    {user && <Link to="/register">Submit TX</Link>}
    {user && <button onClick={logout}>Logout</button>}
  </nav>
);

const HomePage = () => (
  <div className="p-8 text-center">
    <img src="/logo.png" alt="XLMGuard Logo" className="mx-auto mb-4 w-20" />
    <h1 className="text-3xl font-bold mb-2">Welcome to XLMGuard</h1>
    <p className="mb-6 text-sm max-w-xl mx-auto">
      XLMGuard.com is a blockchain-based transaction protection service that helps buyers and sellers verify payments before goods or services are fulfilled. We link contract terms, payment status, shipment data, and dispute flags to ensure secure cross-border commerce with XLM & XRP.
    </p>
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
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input className="block border p-2 w-full my-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="block border p-2 w-full my-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleLogin}>Login</button>
    </div>
  );
};

const RegisterUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), { has_paid: false });
      alert("Account created. Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Register</h2>
      <input className="block border p-2 w-full my-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="block border p-2 w-full my-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button className="bg-green-600 text-white px-4 py-2" onClick={handleRegister}>Register</button>
    </div>
  );
};

const PayGate = ({ user }) => {
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().has_paid) {
        setPaid(true);
        navigate("/register");
      }
    };
    checkPayment();
  }, [user, navigate]);

  const handleConfirmPayment = async () => {
    await updateDoc(doc(db, "users", user.uid), { has_paid: true });
    navigate("/register");
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-2">Complete Your Payment</h2>
      <p className="mb-4">Send your payment in XLM or XRP, then click below to continue.</p>
      <button onClick={handleConfirmPayment} className="bg-blue-600 text-white px-4 py-2">I've Paid – Continue</button>
    </div>
  );
};

const RegisterTransaction = () => {
  const [form, setForm] = useState({ buyer: "", txId: "", amount: "", terms: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const txRef = doc(db, "transactions", form.txId);
    await setDoc(txRef, { ...form, created: serverTimestamp(), verified: false });
    await emailjs.send("service_xyi5n7d", "template_notify_seller", {
      seller_email: form.buyer,
      txid: form.txId,
      link: `https://xlmguard.com/seller/verify?txid=${form.txId}`
    });
    navigate("/confirmation");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Register a Payment Transaction</h2>
      <input className="block border p-2 w-full my-2" placeholder="Seller Wallet or Email" onChange={e => setForm({ ...form, buyer: e.target.value })} />
      <input className="block border p-2 w-full my-2" placeholder="Transaction ID (TXID)" onChange={e => setForm({ ...form, txId: e.target.value })} />
      <input className="block border p-2 w-full my-2" placeholder="Amount" onChange={e => setForm({ ...form, amount: e.target.value })} />
      <textarea className="block border p-2 w-full my-2" placeholder="Contract Terms / Description" onChange={e => setForm({ ...form, terms: e.target.value })}></textarea>
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2">Submit Transaction</button>
    </div>
  );
};

const TransactionConfirmation = () => (
  <div className="p-6 max-w-md mx-auto text-center">
    <h2 className="text-xl font-bold mb-2">Transaction Submitted</h2>
    <p>You'll receive an email once the seller confirms fulfillment.</p>
  </div>
);

const SellerVerify = () => {
  const query = new URLSearchParams(useLocation().search);
  const txId = query.get("txid");

  const handleFulfill = async () => {
    const txRef = doc(db, "transactions", txId);
    const snap = await getDoc(txRef);
    const data = snap.data();
    await updateDoc(txRef, { verified: true });
    await emailjs.send("service_xyi5n7d", "template_notify_buyer", {
      buyer_email: data.buyer,
      txid: txId,
      link: "https://xlmguard.com/transaction/" + txId
    });
    alert("Transaction marked as fulfilled and buyer notified.");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Seller Verification</h2>
      <p className="mb-4">Confirm this transaction ID has been fulfilled:</p>
      <p className="font-mono mb-4">{txId}</p>
      <button onClick={handleFulfill} className="bg-blue-600 text-white px-4 py-2">Confirm Fulfillment</button>
    </div>
  );
};

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































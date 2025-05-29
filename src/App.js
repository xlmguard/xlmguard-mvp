
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)

import React, { useState, useEffect } from "react";
import {
  Routes, Route, useNavigate, useLocation, Link, useSearchParams
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, getDoc, updateDoc, serverTimestamp
} from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged
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
emailjs.init(EMAILJS_PUBLIC_KEY); // Init globally

const Navigation = () => (
  <nav className="bg-gray-100 p-4 flex gap-6 justify-center text-sm">
    <Link to="/">Home</Link>
    <Link to="/register">Register</Link>
    <Link to="/confirmation?txid=test123">Confirmation</Link>
    <Link to="/seller/verify?txid=test123">Seller Verify</Link>
  </nav>
);

const HomePage = () => (
  <div className="p-8 text-center">
    <img src="/logo.png" alt="XLMGuard Logo" className="mx-auto mb-6 w-24 h-24" />
    <h1 className="text-2xl font-bold mb-4">Welcome to XLMGuard</h1>
    <p className="mb-6">Secure your XLM/XRP escrow transactions with seller verification and buyer protection. Fast. Simple. Trusted.</p>
    <p className="mb-2 text-sm italic">🌍 Supports global commerce in multiple languages:</p>
    <ul className="text-xs">
      <li><strong>[English]</strong> Protects global transactions with blockchain trust.</li>
      <li><strong>[Español]</strong> Protege transacciones globales con confianza blockchain.</li>
      <li><strong>[Português]</strong> Protege transações globais com confiança blockchain.</li>
      <li><strong>[Deutsch]</strong> Schützt globale Transaktionen mit Blockchain-Vertrauen.</li>
      <li><strong>[中文]</strong> 利用区块链信任保护全球交易。</li>
    </ul>
    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block">Register Transaction</Link>
  </div>
);

const TransactionConfirmation = () => {
  const [params] = useSearchParams();
  const txId = params.get("txid") || "Unknown";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
    alert("Transaction ID copied to clipboard");
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">✅ Transaction Submitted</h2>
      <p className="mb-4">Your payment transaction has been registered and is currently pending seller confirmation.</p>
      <p className="text-sm text-gray-500">Transaction ID: <code>{txId}</code></p>
      <button onClick={copyToClipboard} className="text-blue-600 underline">Copy TXID</button>
      <br /><br />
      <Link to="/" className="text-blue-600 underline">Return to Dashboard</Link>
    </div>
  );
};

const RegisterTransaction = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    buyer: auth.currentUser?.email || '',
    seller: '',
    txId: '',
    amount: '',
    terms: ''
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, "transactions", form.txId), {
        buyer_id: form.buyer,
        seller_id: form.seller,
        amount: form.amount,
        contract_terms: form.terms,
        payment_status: "pending",
        created_at: new Date().toISOString()
      });

      console.log("📤 Attempting to send seller email via EmailJS");
      await emailjs.send("service_xyi5n7d", "template_pixnkqs", {
        seller_email: form.seller,
        buyer_email: form.buyer,
        txid: form.txId,
        amount: form.amount,
        terms: form.terms,
        link: `https://xlmguard.com/seller/verify?txid=${form.txId}`
      });

      navigate(`/confirmation?txid=${form.txId}`);
    } catch (error) {
      alert("Error saving transaction: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">Register a Payment Transaction</h2>
      <input className="block border p-2 w-full" name="seller" placeholder="Seller Wallet or Email" onChange={handleChange} />
      <input className="block border p-2 w-full" name="txId" placeholder="Transaction ID (TXID)" onChange={handleChange} />
      <input className="block border p-2 w-full" name="amount" placeholder="Amount" onChange={handleChange} />
      <textarea className="block border p-2 w-full" name="terms" placeholder="Contract Terms / Description" onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>Submit Transaction</button>
    </div>
  );
};

const SellerVerify = () => {
  const [params] = useSearchParams();
  const txId = params.get("txid");
  const [status, setStatus] = useState("Loading...");
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const loadTransaction = async () => {
      const docRef = doc(db, "transactions", txId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTransaction(docSnap.data());
        setStatus("Ready");
      } else {
        setStatus("Transaction not found.");
      }
    };
    if (txId) loadTransaction();
  }, [txId]);

  const markFulfilled = async () => {
    try {
      const docRef = doc(db, "transactions", txId);
      const docSnap = await getDoc(docRef);
      const buyerEmail = docSnap.data().buyer_id;

      await updateDoc(docRef, {
        payment_status: "fulfilled",
        fulfilled_at: serverTimestamp()
      });

      console.log("📤 Attempting to send buyer email via EmailJS");
      await emailjs.send("service_xyi5n7d", "template_9ry4lu4", {
        buyer_email: buyerEmail,
        txid: txId,
        link: `https://xlmguard.com/dashboard?txid=${txId}`
      });

      alert("✅ Transaction marked as fulfilled.");
    } catch (err) {
      alert("❌ Error updating transaction: " + err.message);
    }
  };

  if (status !== "Ready") return <p className="text-center p-4">🔄 {status}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Seller Verification</h2>
      <p><strong>Buyer:</strong> {transaction.buyer_id}</p>
      <p><strong>Amount:</strong> {transaction.amount}</p>
      <p><strong>TXID:</strong> {txId}</p>
      <p><strong>Terms:</strong> {transaction.contract_terms}</p>
      <button className="bg-green-600 text-white px-4 py-2" onClick={markFulfilled}>Mark as Fulfilled</button>
    </div>
  );
};

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterTransaction />} />
        <Route path="/confirmation" element={<TransactionConfirmation />} />
        <Route path="/seller/verify" element={<SellerVerify />} />
      </Routes>
    </>
  );
}




























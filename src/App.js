
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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

const TransactionConfirmation = ({ txId }) => {
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

      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: "service_xyi5n7d",
          template_id: "template_pixnkqs",
          user_id: "user_xlmguard123",
          template_params: {
            seller_email: form.seller,
            buyer_email: form.buyer,
            txid: form.txId,
            amount: form.amount,
            terms: form.terms,
            link: `https://xlmguard.com/seller/verify?txid=${form.txId}`
          }
        })
      });

      navigate("/confirmation", { state: { txId: form.txId } });
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

      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: "service_xyi5n7d",
          template_id: "template_notify_buyer",
          user_id: "user_xlmguard123",
          template_params: {
            buyer_email: buyerEmail,
            txid: txId,
            link: `https://xlmguard.com/dashboard?txid=${txId}`
          }
        })
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



















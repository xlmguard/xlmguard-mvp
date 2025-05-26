// src/RegisterForm.js
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
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

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p>🎉 Registration successful! You can now log in.</p>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
setEmail("");
setPassword("");
setIsRegistering(false);
navigate("/");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-center">
      <img src="/logo.png" alt="XLMGuard Logo" className="mx-auto mb-4 w-32" />
      <h2 className="text-xl font-semibold mb-4">{isRegistering ? "Register" : "Login"}</h2>
      <input className="block border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="block border p-2 w-full mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      {isRegistering ? (
        <>
          <button className="bg-green-600 text-white px-4 py-2 w-full" onClick={handleRegister}>Register</button>
          <p className="text-sm mt-2">Already have an account? <button className="text-blue-600 underline" onClick={() => setIsRegistering(false)}>Log In</button></p>
        </>
      ) : (
        <>
          <button className="bg-blue-600 text-white px-4 py-2 w-full" onClick={handleLogin}>Login</button>
          <p className="text-sm mt-2">Need an account? <button className="text-blue-600 underline" onClick={() => setIsRegistering(true)}>Register</button></p>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const auth = getAuth();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">XLMGuard Dashboard</h1>
      <p className="text-sm text-gray-500">Signed in as: {auth.currentUser?.email}</p>
      <ul className="space-y-2">
        <li><button onClick={() => { auth.signOut(); window.location.href = '/'; }} className="text-red-600 underline">Logout</button></li>
        <li><Link to="/register" className="text-blue-600">Register a Transaction (Buyer)</Link></li>
        <li><Link to="/seller/verify" className="text-blue-600">Verify Payment (Seller)</Link></li>
      </ul>
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
      navigate("/confirmation");
    } catch (error) {
      alert("Error saving transaction: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">Register a Payment Transaction</h2>
      <input className="block border p-2 w-full" name="seller" placeholder="Seller Wallet" onChange={handleChange} />
      <input className="block border p-2 w-full" name="txId" placeholder="Transaction ID (TXID)" onChange={handleChange} />
      <input className="block border p-2 w-full" name="amount" placeholder="Amount" onChange={handleChange} />
      <textarea className="block border p-2 w-full" name="terms" placeholder="Contract Terms / Description" onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>Submit Transaction</button>
    </div>
  );
};
const SellerVerify = () => <div className="p-6">[SellerVerify Component Placeholder]</div>;
const SubmitFulfillment = () => <div className="p-6">[SubmitFulfillment Component Placeholder]</div>;
const BuyerFeedback = () => <div className="p-6">[BuyerFeedback Component Placeholder]</div>;

const TransactionConfirmation = () => (
  <div className="p-6 max-w-lg mx-auto text-center">
    <h2 className="text-xl font-bold mb-4">✅ Transaction Submitted</h2>
    <p className="mb-4">Your payment transaction has been registered and is currently pending seller confirmation.</p>
    <Link to="/" className="text-blue-600 underline">Return to Dashboard</Link>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Dashboard /> : <Login />} />
      <Route path="/register" element={user ? <RegisterTransaction /> : <Login />} />
      <Route path="/seller/verify" element={user ? <SellerVerify /> : <Login />} />
      <Route path="/seller/fulfill/:txId" element={user ? <SubmitFulfillment /> : <Login />} />
      <Route path="/buyer/feedback/:txId" element={user ? <BuyerFeedback /> : <Login />} />
      <Route path="/confirmation" element={<TransactionConfirmation />} />
    </Routes>
  );
}








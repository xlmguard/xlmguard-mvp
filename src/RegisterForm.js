// src/RegisterForm.js
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
      alert("Registration successful. You can now log in.");
      setIsRegistering(false);
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
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

const Dashboard = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">XLMGuard Dashboard</h1>
    <ul className="space-y-2">
      <li><Link to="/register" className="text-blue-600">Register a Transaction (Buyer)</Link></li>
      <li><Link to="/seller/verify" className="text-blue-600">Verify Payment (Seller)</Link></li>
    </ul>
  </div>
);

const RegisterTransaction = () => <div className="p-6">[RegisterTransaction Component Placeholder]</div>;
const SellerVerify = () => <div className="p-6">[SellerVerify Component Placeholder]</div>;
const SubmitFulfillment = () => <div className="p-6">[SubmitFulfillment Component Placeholder]</div>;
const BuyerFeedback = () => <div className="p-6">[BuyerFeedback Component Placeholder]</div>;

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/register" element={user ? <RegisterTransaction /> : <Login />} />
        <Route path="/seller/verify" element={user ? <SellerVerify /> : <Login />} />
        <Route path="/seller/fulfill/:txId" element={user ? <SubmitFulfillment /> : <Login />} />
        <Route path="/buyer/feedback/:txId" element={user ? <BuyerFeedback /> : <Login />} />
      </Routes>
    </Router>
  );
}



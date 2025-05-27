
// XLMGuard Buyer & Seller Dashboard (React + Firebase Auth Integration)
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
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6 gap-8">
      <div className="w-full md:w-1/2 text-center md:text-left">
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '240px' }} className="mx-auto md:mx-0" />
        <div style={{ fontFamily: 'sans-serif', fontSize: '14px', lineHeight: '1.5' }}>
  <p style={{ marginBottom: '0.75rem' }}>XLMGuard is a blockchain-based transaction protection service that helps buyers and sellers verify payments before goods or services are fulfilled.</p>
  <p>It ensures transparency and trust by linking contract terms, payment status, shipment data, and dispute flags — making it ideal for global digital commerce using XLM and XRP transactions.</p>
  <hr className="my-4" />
  <p><strong>[English]</strong> Protects global transactions with blockchain trust.</p>
  <p><strong>[한국어 - Korean]</strong> 블록체인 기반의 거래 보호 서비스입니다.</p>
  <p><strong>[日本語 - Japanese]</strong> XLMGuardは信頼性の高い取引保護を提供します。</p>
  <p><strong>[Bahasa Indonesia]</strong> Layanan perlindungan transaksi berbasis blockchain.</p>
  <p><strong>[Português - Brasil]</strong> Serviço de proteção de transações baseado em blockchain.</p>
</div>
      </div>
      <div className="w-full md:w-1/2 max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">{isRegistering ? "Register" : "Login"}</h2>
        <input className="block border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="block border p-2 w-full mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        {isRegistering ? (
          <>
            <button className="bg-green-600 text-white px-4 py-2 w-full" onClick={handleRegister}>Register</button>
            <p className="text-sm mt-2 text-center">Already have an account? <button className="text-blue-600 underline" onClick={() => setIsRegistering(false)}>Log In</button></p>
          </>
        ) : (
          <>
            <button className="bg-blue-600 text-white px-4 py-2 w-full" onClick={handleLogin}>Login</button>
            <p className="text-sm mt-2 text-center">Need an account? <button className="text-blue-600 underline" onClick={() => setIsRegistering(true)}>Register</button></p>
          </>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const auth = getAuth();
  return (
    <div className="p-6 space-y-4 text-center max-w-xl mx-auto">
      <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '240px' }} className="mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-center">XLMGuard Dashboard</h1>
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

const StartProtection = () => {
  const navigate = useNavigate();
  const [txHash, setTxHash] = useState("");

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 text-left">
      <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '240px' }} className="mb-4" />
      <h2 className="text-2xl font-bold">Start Protection</h2>
      <p className="text-sm text-gray-700">Before registering your transaction, please send a flat fee payment to one of the addresses below. After payment, enter your transaction hash and click "I’ve Paid" to continue.</p>
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold">XLM Payment (2.0 XLM flat fee)</h3>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL%3Fmemo%3D1095582935&size=150x150" alt="XLM QR Code" className="my-2" />
        <p><strong>Address:</strong> GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL</p>
        <p><strong>Memo:</strong> 1095582935</p>
      </div>
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold">XRP Payment (1.0 XRP flat fee)</h3>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J%3Fmemo%3D1952896539&size=150x150" alt="XRP QR Code" className="my-2" />
        <p><strong>Address:</strong> rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J</p>
        <p><strong>Memo:</strong> 1952896539</p>
      </div>
      <input
        className="block border p-2 w-full mt-4"
        placeholder="Paste your XLM or XRP Transaction Hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 mt-4"
        onClick={async () => {
  const userRef = doc(db, 'users', auth.currentUser.uid);
  if (!txHash || txHash.length < 10) {
    alert('❌ Please enter a valid transaction hash before continuing.');
    return;
  }
  await setDoc(userRef, { hasPaid: true, txHash }, { merge: true });
  alert('✅ Payment confirmed! You can now register your transaction.');
  window.location.href = '/register';
  navigate('/register');
}}
    >
        I’ve Paid, Continue
      </button>
    </div>
  );
};

const TransactionConfirmation = () => (
  <div className="p-6 max-w-lg mx-auto text-center">
    <h2 className="text-xl font-bold mb-4">✅ Transaction Submitted</h2>
    <p className="mb-4">Your payment transaction has been registered and is currently pending seller confirmation.</p>
    <Link to="/" className="text-blue-600 underline">Return to Dashboard</Link>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);
        setHasPaid(snap.exists() && snap.data().hasPaid === true);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Dashboard /> : <Login />} />
      <Route path="/register" element={user ? (hasPaid ? <RegisterTransaction /> : <StartProtection />) : <Login />} />
      <Route path="/seller/verify" element={user ? <SellerVerify /> : <Login />} />
      <Route path="/seller/fulfill/:txId" element={user ? <SubmitFulfillment /> : <Login />} />
      <Route path="/buyer/feedback/:txId" element={user ? <BuyerFeedback /> : <Login />} />
      <Route path="/confirmation" element={<TransactionConfirmation />} />
      <Route path="/start" element={<StartProtection />} />
    </Routes>
  );
}















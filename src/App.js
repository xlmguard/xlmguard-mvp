// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PaymentPage from './PaymentPage';
import SubmissionForm from './SubmissionForm';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import SellerConfirmationPanel from './SellerConfirmationPanel';

function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const paid = snap.data().hasPaid || false;
          setHasPaid(paid);
        } else {
          await setDoc(userRef, { hasPaid: false });
          setHasPaid(false);
        }

        setUser(currentUser);
      } else {
        setUser(null);
        setHasPaid(false);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div style={{ position: 'fixed', top: 0, left: 0, background: '#000', color: '#0f0', padding: '5px', zIndex: 9999 }}>
        App Version: June 3 - Payment Redirect Fix
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={!user ? <RegisterPage /> : hasPaid ? <Navigate to="/submit" /> : <Navigate to="/payment" />} />
        <Route path="/login" element={!user ? <LoginPage /> : hasPaid ? <Navigate to="/submit" /> : <Navigate to="/payment" />} />
        <Route path="/payment" element={user && !hasPaid ? <PaymentPage /> : hasPaid ? <Navigate to="/submit" /> : <Navigate to="/login" />} />
        <Route path="/submit" element={user && hasPaid ? <SubmissionForm /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/seller-confirm" element={<SellerConfirmationPanel />} />
      </Routes>
    </Router>
  );
}

export default App;




















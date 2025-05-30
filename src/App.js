// Reverting App.js to known-good version from May 30, 2025 (before break)

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PaymentPage from './PaymentPage';
import SubmissionForm from './SubmissionForm';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const paid = snap.exists() && snap.data().hasPaid;
        setHasPaid(paid);
        setUser(currentUser);
      } else {
        setUser(null);
        setHasPaid(false);
      }
      setLoading(false);
    } );

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={hasPaid ? '/submit' : '/payment'} />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={hasPaid ? '/submit' : '/payment'} />} />
        <Route path="/payment" element={user && !hasPaid ? <PaymentPage /> : <Navigate to={user ? '/submit' : '/login'} />} />
        <Route path="/submit" element={user && hasPaid ? <SubmissionForm /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
    );
}

export default App;







// Reconstructed App.js code for XLMGuard.com from May 26, 2025 version

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import SubmissionForm from './pages/SubmissionForm';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        const paid = snap.exists() && snap.data().hasPaid;
        setHasPaid(paid);
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









































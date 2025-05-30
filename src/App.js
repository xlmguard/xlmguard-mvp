// Restored App.js code for XLMGuard.com from May 18, 2025 version (with confirmed logic and corrected import paths)

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const paidStatus = userDoc.data().hasPaid || false;
          console.log("✅ FRESH BUILD CONFIRMATION | hasPaid:", paidStatus);
          setHasPaid(paidStatus);
        } else {
          setHasPaid(false);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setHasPaid(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={user ? <Navigate to={hasPaid ? "/submit" : "/payment"} /> : <RegisterPage />} />
        <Route path="/login" element={user ? <Navigate to={hasPaid ? "/submit" : "/payment"} /> : <LoginPage />} />
        <Route path="/payment" element={user ? (!hasPaid ? <PaymentPage /> : <Navigate to="/submit" />) : <Navigate to="/login" />} />
        <Route path="/submit" element={user && hasPaid ? <SubmissionForm /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;




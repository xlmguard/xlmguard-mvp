// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { Helmet } from 'react-helmet';

import HomePage from './HomePage.js';
import RegisterPage from './RegisterPage.js';
import LoginPage from './LoginPage.js';
import PaymentPage from './PaymentPage.js';
import SubmissionForm from './SubmissionForm.js';
import Dashboard from './Dashboard.js';
import AdminLogin from './AdminLogin.js';
import AdminPanel from './AdminPanel.js';
import SellerConfirmationPanel from './SellerConfirmationPanel.js';
import TransactionLookup from './TransactionLookup.js';
import FAQPage from './FAQPage.js';
import ContactPage from './ContactPage.js';
import InstructionsPage from './InstructionsPage.js';

// Freight page
import FreightForwardersPage from './FreightForwardersPage.jsx';

// New legal pages
import TermsPage from './TermsPage.js';
import PrivacyPolicyPage from './PrivacyPolicyPage.js';

function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [trialCredits, setTrialCredits] = useState(0);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setHasPaid(Boolean(data.hasPaid));
          setTrialCredits(data.trialCredits ?? 0);
          setRole(data.role || null);
        } else {
          await setDoc(userRef, { hasPaid: false, trialCredits: 0 }, { merge: true });
          setHasPaid(false);
          setTrialCredits(0);
          setRole(null);
        }

        setUser(currentUser);
      } else {
        setUser(null);
        setHasPaid(false);
        setTrialCredits(0);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "XLMGuard",
    "url": "https://xlmguard.com",
    "logo": "https://xlmguard.com/logo.png",
    "description": "A global blockchain-based escrow and crypto transaction verification platform for XLM and XRP.",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
      "geoRadius": 20040000
    },
    "serviceType": "Blockchain escrow and crypto transaction verification",
    "location": {
      "@type": "Place",
      "address": { "@type": "PostalAddress", "addressLocality": "Charlotte", "addressRegion": "NC", "addressCountry": "US" }
    },
    "sameAs": ["https://twitter.com/xlmguard", "https://linkedin.com/company/xlmguard"],
    "founder": { "@type": "Person", "name": "Paul Pazzaglini" }
  };

  return (
    <Router>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(orgJsonLd)}
        </script>
      </Helmet>

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/freight-forwarders" element={<FreightForwardersPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

        {/* Auth */}
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} />}
        />

        {/* Buyer payment gate */}
        <Route
          path="/payment"
          element={
            user && role === 'buyer' && !hasPaid
              ? <PaymentPage />
              : user
                ? <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} />
                : <Navigate to="/login" />
          }
        />

        {/* Submit allowed if paid OR has trial credit */}
        <Route
          path="/submit"
          element={
            user
              ? (hasPaid || trialCredits > 0)
                ? <SubmissionForm />
                : <Navigate to="/payment" />
              : <Navigate to="/login" />
          }
        />

        {/* Authenticated utilities */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/seller-confirm" element={<SellerConfirmationPanel />} />
        <Route path="/transaction-lookup" element={<TransactionLookup />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* Info */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;


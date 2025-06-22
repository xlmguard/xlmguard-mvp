// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';

import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import PaymentPage from './PaymentPage';
import SubmissionForm from './SubmissionForm';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import SellerConfirmationPanel from './SellerConfirmationPanel';
import TransactionLookup from './TransactionLookup';
import FAQPage from './FAQPage';
import ContactPage from './ContactPage'; // ✅ NEW import

function App() {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('G-HDR20HZ7Z9');
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setHasPaid(data.hasPaid || false);
          setRole(data.role || null);
        } else {
          await setDoc(userRef, { hasPaid: false });
          setHasPaid(false);
          setRole(null);
        }

        setUser(currentUser);
      } else {
        setUser(null);
        setHasPaid(false);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "XLMGuard",
              "url": "https://xlmguard.com",
              "logo": "https://xlmguard.com/logo.png",
              "description": "A global blockchain-based escrow and payment-verification platform for XLM and XRP.",
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 0,
                  "longitude": 0
                },
                "geoRadius": 20040000
              },
              "serviceType": "Blockchain escrow and crypto transaction verification",
              "location": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Charlotte",
                  "addressRegion": "NC",
                  "addressCountry": "US"
                }
              },
              "sameAs": [
                "https://twitter.com/xlmguard",
                "https://linkedin.com/company/xlmguard"
              ],
              "founder": {
                "@type": "Person",
                "name": "Paul Pazzaglini"
              }
            }
          `}
        </script>
      </Helmet>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} />}
        />
        <Route
          path="/payment"
          element={user && role === 'buyer' && !hasPaid ? <PaymentPage /> : user ? <Navigate to={role === 'seller' ? '/seller-confirm' : '/'} /> : <Navigate to="/login" />}
        />
        <Route
          path="/submit"
          element={user && hasPaid ? <SubmissionForm /> : <Navigate to="/login" />}
        />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/seller-confirm" element={<SellerConfirmationPanel />} />
        <Route path="/transaction-lookup" element={<TransactionLookup />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} /> {/* ✅ NEW route */}
      </Routes>
    </Router>
   );
}

export default App;





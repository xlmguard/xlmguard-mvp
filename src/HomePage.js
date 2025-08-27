// HomePage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

/* --- CryptoTickerBar (unchanged) --- */
function CryptoTickerBar({ /* ...props */ }) {
  // ... leave this exactly as you had it
}

/* ----------------------- end CryptoTickerBar ----------------------- */

function HomePage() {
  const [language, setLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const [xlmPrice, setXlmPrice] = useState(null);
  const [xrpPrice, setXrpPrice] = useState(null);
  const [usdcPrice, setUsdcPrice] = useState(null);

  const [xlmTrades, setXlmTrades] = useState([]);
  const [xrpTrades, setXrpTrades] = useState([]);
  const [usdcTrades, setUsdcTrades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserRole(data.role || 'Unknown');
          setUserName(data.name || user.displayName || user.email);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ... leave your price/trades fetch logic as-is ...

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.hasPaid) {
          navigate('/submit');
        } else {
          navigate('/payment');
        }
      } else {
        navigate('/payment');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      navigate('/payment');
    }
  };

  const descriptions = {
    English:
      'XLMGuard protects your XLM, XRP, and Stablecoin transactions with timestamped transaction verification and secure seller confirmations.',
  };

  // ... leave tickerContent code as-is ...

  return (
    <div
      style={{
        textAlign: 'center',
        backgroundImage: 'url(\"/earthbackgrownd.png\")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
      }}
    >
      <Helmet>
        <title>XLMGuard – Secure XLM, XRP & Stablecoin Transactions</title>
        <meta
          name="description"
          content="Secure your Stellar (XLM), XRP, and Stablecoin transactions with XLMGuard—blockchain-based escrow and payment verification you can trust."
        />
        <link rel="canonical" href="https://xlmguard.com/" />
      </Helmet>

      <nav
        style={{
          background: 'linear-gradient(to right, #0f0f0f, #1a1a1a)',
          borderBottom: '1px solid #333',
          padding: '1rem 1rem 2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
         }}
      >
        <img
          src="/logo.png"
          alt="XLMGuard Logo"
          style={{ height: '140px', filter: 'drop-shadow(0 0 10px #00f2ff)', marginBottom: '0.5rem' }}
        />
        <div
          style={{ position: 'absolute', left: '10px', top: '20px', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
        </div>
        <div
          style={{
            maxHeight: menuOpen ? '400px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0.5rem',
          }}
        >
          <a href="https://escrow.xlmguard.com" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Escrow
          </a>
          {/* 👇 NEW Freight Forwarders menu item */}
          <Link to="/freight-forwarders" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Freight Forwarders
          </Link>
          <Link to="/faq" style={{ margin: '0.25rem 0', color: '#fff' }}>
            FAQ
          </Link>
          <Link to="/contact" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Contact Us
          </Link>
          <Link to="/seller-confirm" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Seller Panel
          </Link>
          <Link to="/instructions" style={{ margin: '0.25rem 0', color: '#fff' }}>
            User Instructions
          </Link>
        </div>
        {currentUser && (
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#007BFF',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
            onClick={handleLogout}
          >
            {userName?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </nav>

      {/* ticker + rest of page unchanged */}
      <CryptoTickerBar ctaHref="/instructions" speedSec={24} />
      {/* ... rest of main + footer as-is ... */}
    </div>
  );
}

export default HomePage;

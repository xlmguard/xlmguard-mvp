// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

function HomePage() {
  const [language, setLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [xlmPrice, setXlmPrice] = useState(null);
  const [xrpPrice, setXrpPrice] = useState(null);
  const [xlmTrades, setXlmTrades] = useState([]);
  const [xrpTrades, setXrpTrades] = useState([]);

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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar,stellar-lumens,ripple&vs_currencies=usd');
        const data = await res.json();
        setXlmPrice(data['stellar-lumens']?.usd || data['stellar']?.usd || 'N/A');
        setXrpPrice(data['ripple']?.usd || 'N/A');
      } catch (err) {
        console.error('Error fetching prices:', err);
        setXlmPrice('N/A');
        setXrpPrice('N/A');
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const resXLM = await fetch('https://api.kraken.com/0/public/Trades?pair=XXLMZUSD');
        const dataXLM = await resXLM.json();
        if (dataXLM.result?.XXLMZUSD) {
          setXlmTrades(dataXLM.result.XXLMZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XLM Buy' })));
        }
        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD');
        const dataXRP = await resXRP.json();
        if (dataXRP.result?.XXRPZUSD) {
          setXrpTrades(dataXRP.result.XXRPZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XRP Buy' })));
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 120000);
    return () => clearInterval(interval);
  }, []);

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
    English: 'XLMGuard protects your XLM and XRP transactions with timestamped transaction verification and secure seller confirmations.'
  };

  const allTrades = [...xlmTrades, ...xrpTrades];
  const tickerContent = allTrades.length > 0
    ? allTrades.map((t, i) => (
        <span key={i} style={{ display: 'inline-block', padding: '0 2rem' }}>
          {t.side}: {t.volume} @ ${t.price}
        </span>
      ))
    : <span style={{ padding: '0 2rem' }}>Loading latest trades...</span>;

  return (
    <div style={{ textAlign: 'center', backgroundImage: 'url("/earthbackgrownd.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', backgroundAttachment: 'fixed' }}>
      <Helmet>
        <title>XLMGuard – Secure Your XLM and XRP Transactions</title>
        <meta name="description" content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." />
        <link rel="canonical" href="https://xlmguard.com/" />
      </Helmet>

      <nav style={{ position: 'relative', backgroundColor: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #ddd', padding: '0.5rem 1rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '200px', marginBottom: '0.5rem' }} />
        <div style={{ position: 'absolute', left: '10px', top: '210px', cursor: 'pointer' }} onClick={() => setMenuOpen(!menuOpen)}>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'black', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'black', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'black', margin: '4px 0' }}></div>
        </div>
        <div style={{
          maxHeight: menuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '0.5rem'
        }}>
          <a href="https://escrow.xlmguard.com" style={{ margin: '0.25rem 0' }}>Escrow</a>
          <Link to="/faq" style={{ margin: '0.25rem 0' }}>FAQ</Link>
          <Link to="/contact" style={{ margin: '0.25rem 0' }}>Contact Us</Link>
          <Link to="/seller-confirm" style={{ margin: '0.25rem 0' }}>Seller Panel</Link>
          <Link to="/instructions" style={{ margin: '0.25rem 0' }}>User Instructions</Link>
        </div>
        {currentUser && (
          <div style={{ position: 'absolute', right: '10px', top: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007BFF', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleLogout}>
            {userName?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </nav>

      <main style={{ paddingTop: '10px' }}>
        <h1 style={{ marginTop: '0', marginBottom: '10px' }}>XLMGuard<sup style={{ fontSize: '0.5em' }}>™</sup></h1>
        <p>{descriptions[language]}</p>
        <p><strong>XLM:</strong> {xlmPrice} | <strong>XRP:</strong> {xrpPrice}</p>

        {/* Ticker Carousel */}
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#000', padding: '10px 0', color: '#0f0' }}>
          <div style={{ display: 'inline-block', animation: 'scroll-left 360s linear infinite' }}>
            {tickerContent}
          </div>
        </div>

        <style>
          {`@keyframes scroll-left {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
          }`}
        </style>

        {!currentUser && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')} style={{ marginLeft: '1rem' }}>Login</button>
          </div>
        )}

        {currentUser && userRole === 'buyer' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/transaction-lookup')}>Buyer Transaction Lookup</button>
            <button onClick={handleSubmitTransaction} style={{ marginLeft: '1rem' }}>Submit Transaction</button>
          </div>
        )}

        {currentUser && userRole === 'seller' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/seller-confirm')}>Seller Shipment Confirmation</button>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '3rem', padding: '1rem 0', fontSize: '0.8rem', color: '#777', backgroundColor: 'rgba(255,255,255,0.9)', borderTop: '1px solid #ddd' }}>
        &copy; {new Date().getFullYear()} XLMGuard.com – All rights reserved. <br />
        <em>Patent Pending</em>
      </footer>
    </div>
   );
}

export default HomePage;




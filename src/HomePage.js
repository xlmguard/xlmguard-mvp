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
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
          setXlmTrades(dataXLM.result.XXLMZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: t[3] === 'b' ? 'Buy' : 'Sell' })));
        }
        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD');
        const dataXRP = await resXRP.json();
        if (dataXRP.result?.XXRPZUSD) {
          setXrpTrades(dataXRP.result.XXRPZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: t[3] === 'b' ? 'Buy' : 'Sell' })));
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

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

  return (
    <div style={{ textAlign: 'center', paddingTop: '60px', backgroundImage: 'url("/earthbackgrownd.png")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Helmet>
        <title>XLMGuard – Secure Your XLM and XRP Transactions</title>
        <meta name="description" content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." />
        <link rel="canonical" href="https://xlmguard.com/" />
      </Helmet>

      <nav style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 2rem', zIndex: 1000 }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '40px' }} />
        <div>
          <a href="https://escrow.xlmguard.com" style={{ margin: '0 1rem' }}>Go to Escrow</a>
          <Link to="/faq" style={{ margin: '0 1rem' }}>FAQ</Link>
          <Link to="/contact" style={{ margin: '0 1rem' }}>Contact Us</Link>
          <Link to="/seller-confirm" style={{ margin: '0 1rem' }}>Seller Panel</Link>
          <button onClick={() => setShowModal(true)}>Escrow Help</button>
        </div>
        {currentUser && (
          <div>
            <button onClick={() => setShowDropdown(!showDropdown)}>{userRole}: {userName}</button>
            {showDropdown && (
              <div style={{ position: 'absolute', top: '60px', right: '2rem', background: '#fff', border: '1px solid #ccc', padding: '1rem' }}>
                <p>{currentUser.email}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <main style={{ marginTop: '100px' }}>
        <h1>Welcome to XLMGuard</h1>
        <p>{descriptions[language]}</p>
        <p><strong>XLM:</strong> {xlmPrice} | <strong>XRP:</strong> {xrpPrice}</p>

        <div style={{ backgroundColor: '#000', color: '#0f0', padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ display: 'inline-block', animation: 'scroll-left 40s linear infinite' }}>
            {xlmTrades.map((t, i) => (
              <span key={i} style={{ marginRight: '50px' }}>XLM {t.side}: {t.volume} @ ${t.price}</span>
            ))}
            {xrpTrades.map((t, i) => (
              <span key={i} style={{ marginRight: '50px' }}>XRP {t.side}: {t.volume} @ ${t.price}</span>
            ))}
          </div>
        </div>

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
        &copy; {new Date().getFullYear()} XLMGuard.com – All rights reserved.
      </footer>
    </div>
   );
}

export default HomePage;









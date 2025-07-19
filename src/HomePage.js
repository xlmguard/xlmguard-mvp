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
          setXlmTrades(dataXLM.result.XXLMZUSD.slice(-10).map(t => ({
            price: t[0],
            volume: t[1],
            side: t[3] === 'b' ? 'Buy' : 'Sell'
          })));
        }

        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD');
        const dataXRP = await resXRP.json();
        if (dataXRP.result?.XXRPZUSD) {
          setXrpTrades(dataXRP.result.XXRPZUSD.slice(-10).map(t => ({
            price: t[0],
            volume: t[1],
            side: t[3] === 'b' ? 'Buy' : 'Sell'
          })));
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
    English: 'XLMGuard protects your XLM and XRP transactions with timestamped transaction verification and secure seller confirmations.',
    French: 'XLMGuard protège vos transactions XLM et XRP avec une vérification horodatée et des confirmations de vendeur sécurisées.',
    Spanish: 'XLMGuard protege sus transacciones XLM y XRP con verificación de transacción con sello de tiempo y confirmaciones seguras del vendedor.',
    German: 'XLMGuard schützt Ihre XLM- und XRP-Transaktionen mit zeitgestempelter Transaktionsverifizierung und sicheren Verkäuferbestätigungen.',
    Chinese: 'XLMGuard 使用时间戳验证和安全的卖家确认来保护您的 XLM 和 XRP 交易。',
    Arabic: 'XLMGuard يحمي معاملات XLM و XRP الخاصة بك من خلال التحقق من المعاملة بختم زمني وتأكيدات البائع الآمنة.',
    Hindi: 'XLMGuard आपकी XLM और XRP लेन-देन को समय-मुद्रित सत्यापन और सुरक्षित विक्रेता पुष्टि के साथ सुरक्षित करता है।'
  };

  const allLanguages = ['English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Hindi'];

  return (
    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Helmet>
        <title>XLMGuard – Secure Your XLM and XRP Transactions</title>
        <meta name="description" content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." />
        <link rel="canonical" href="https://xlmguard.com/" />
      </Helmet>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ width: '120px' }} />
        {currentUser && (
          <div>
            <button onClick={() => setShowDropdown(!showDropdown)}>{userRole}: {userName}</button>
            {showDropdown && (
              <div>
                <p>Email: {currentUser.email}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </header>

      <h1>Welcome to XLMGuard</h1>

      <p>{descriptions[language] || descriptions['English']}</p>
      <p style={{ marginTop: '1rem' }}><strong>XLM:</strong> {xlmPrice} | <strong>XRP:</strong> {xrpPrice}</p>

      <div style={{ marginTop: '2rem' }}>
        {!currentUser && (
          <>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')} style={{ marginLeft: '1rem' }}>Login</button>
          </>
        )}

        {currentUser && userRole === 'buyer' && (
          <>
            <button onClick={() => navigate('/transaction-lookup')}>Buyer Transaction Lookup</button>
            <button onClick={handleSubmitTransaction} style={{ marginLeft: '1rem' }}>Submit Transaction</button>
          </>
        )}

        {currentUser && userRole === 'seller' && (
          <button onClick={() => navigate('/seller-confirm')}>Seller Shipment Confirmation</button>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/faq"><button>FAQ</button></Link>
        <button onClick={() => navigate('/instructions')} style={{ marginLeft: '1rem' }}>Instructions</button>
        <button onClick={() => setShowModal(true)} style={{ marginLeft: '1rem' }}>How to Escrow</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange} style={{ marginLeft: '0.5rem' }}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {showModal && (
        <div style={{ backgroundColor: '#fff', padding: '2rem', marginTop: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
          <h3>How to Set Up an Escrowed TXID</h3>
          <p>Use LOBSTR Vault or XRP Toolkit to create an escrow transaction. Copy the TXID and paste it in XLMGuard after sending.</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}

      <footer style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#777' }}>
        &copy; {new Date().getFullYear()} XLMGuard.com
      </footer>
    </div>
  );
}

export default HomePage;







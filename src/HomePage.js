// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
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

  // Fetch prices
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

  // Fetch recent trades
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // XLM
        const resXLM = await fetch('https://api.kraken.com/0/public/Trades?pair=XXLMZUSD');
        const dataXLM = await resXLM.json();
        if (dataXLM.result && dataXLM.result.XXLMZUSD) {
          const trades = dataXLM.result.XXLMZUSD.slice(-10).map(trade => ({
            price: trade[0],
            volume: trade[1],
            side: trade[3] === 'b' ? 'Buy' : 'Sell'
          }));
          setXlmTrades(trades);
        }

        // XRP
        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD');
        const dataXRP = await resXRP.json();
        if (dataXRP.result && dataXRP.result.XXRPZUSD) {
          const trades = dataXRP.result.XXRPZUSD.slice(-10).map(trade => ({
            price: trade[0],
            volume: trade[1],
            side: trade[3] === 'b' ? 'Buy' : 'Sell'
          }));
          setXrpTrades(trades);
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
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

  const allLanguages = [
    'English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Hindi'
  ];

  return (
    <div
      style={{
        textAlign: 'center',
        paddingTop: '60px',
        backgroundImage: 'url("/earthbackgrownd.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundBlendMode: 'lighten',
        opacity: '0.95',
        minHeight: '100vh'
      }}
    >
      <Helmet>
        <title>XLMGuard – Secure Your XLM and XRP Transactions</title>
        <meta
          name="description"
          content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust. Protect your crypto with confidence."
        />
        <link rel="canonical" href="https://xlmguard.com/" />
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </Helmet>

      {/* Ticker for XLM */}
      <div style={{
        backgroundColor: '#333',
        color: 'yellow',
        padding: '8px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '14px'
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'scroll-left 20s linear infinite'
        }}>
          {xlmTrades.length === 0
            ? 'Loading recent XLM trades...'
            : xlmTrades.map((trade, index) => (
                <span key={index} style={{ marginRight: '50px' }}>
                  XLM {trade.side}: {trade.volume} @ ${trade.price}
                </span>
              ))
          }
        </div>
      </div>

      {/* Ticker for XRP */}
      <div style={{
        backgroundColor: '#333',
        color: 'yellow',
        padding: '8px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '14px'
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'scroll-left 25s linear infinite'
        }}>
          {xrpTrades.length === 0
            ? 'Loading recent XRP trades...'
            : xrpTrades.map((trade, index) => (
                <span key={index} style={{ marginRight: '50px' }}>
                  XRP {trade.side}: {trade.volume} @ ${trade.price}
                </span>
              ))
          }
        </div>
      </div>

      {currentUser && (
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px' }}
          >
            {userRole}: {userName}
          </button>
          {showDropdown && (
            <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '5px' }}>
              <p>Email: {currentUser.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}

      <img
        src="/logo.png"
        alt="XLMGuard Logo"
        style={{
          width: '180px',
          marginTop: '40px',
          marginBottom: '30px'
        }}
      />
      <h1>Welcome to XLMGuard<sup style={{ fontSize: '0.6em', marginLeft: '4px' }}>™</sup></h1>

      {/* Prices */}
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          XLM Price: {xlmPrice !== null ? `$${xlmPrice}` : 'Loading...'}
        </div>
        <div style={{ color: 'red', fontWeight: 'bold', marginTop: '5px' }}>
          XRP Price: {xrpPrice !== null ? `$${xrpPrice}` : 'Loading...'}
        </div>
      </div>

      <p style={{ maxWidth: '800px', margin: '20px auto 0', fontSize: '16px' }}>
        {descriptions[language] || descriptions['English']}
      </p>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#444' }}>
        Service Fee: <strong>100 XLM / 10 XRP</strong> per transaction
      </p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px' }}>Register</button>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>Login</button>
        {currentUser && (
          <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
        )}
        <button onClick={() => navigate('/seller-confirm')} style={{ marginRight: '10px' }}>Seller Shipment Confirmation</button>
        <button onClick={() => navigate('/transaction-lookup')} style={{ marginRight: '10px' }}>Buyer Transaction Lookup</button>
        <button onClick={() => navigate('/submit')} style={{ marginRight: '10px' }}>Buyer Submit Transaction</button>
        <Link to="/faq">
          <button style={{ marginRight: '10px' }}>FAQ</button>
        </Link>
        <button onClick={() => navigate('/instructions')} style={{ marginRight: '10px' }}>Instructions for Use</button>
        <button onClick={() => setShowModal(true)}>How to Escrow</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <footer style={{ marginTop: '60px', fontSize: '12px', color: '#666' }}>
        <div style={{ marginBottom: '10px' }}>
          <Link to="/contact">
            <button style={{ fontSize: '12px', padding: '6px 12px' }}>Contact Us</button>
          </Link>
        </div>
        &copy; {new Date().getFullYear()} XLMGuard.com – All information on this site is protected by U.S. copyright laws.
      </footer>
    </div>
  );
}

export default HomePage;


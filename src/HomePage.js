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
      navigate('/');
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
      if (snap.exists() && snap.data().hasPaid) {
        navigate('/submit');
      } else {
        navigate('/payment');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      navigate('/payment');
    }
  };

  const descriptions = { /* same as before */ };
  const allLanguages = ['English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Hindi'];

  return (
    <div style={{ /* styles omitted for brevity */ }}>
      <Helmet>
        {/* metadata */}
      </Helmet>

      {/* tickers and header code omitted */}

      {/* Modal toggle */}
      <button onClick={() => setShowModal(true)}>How to Escrow</button>

      {showModal && (
        <>
          {/* Modal backdrop */}
          <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)'
          }} onClick={() => setShowModal(false)} />

          {/* Modal content */}
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            zIndex: 1000
          }}>
            <h3>How to Set Up an Escrowed TXID</h3>
            <p>To manually escrow XLM or XRP, use a wallet that supports multisignature or smart contracts...</p>
            <ol>
              <li>Create an escrow or multisig transaction in your wallet.</li>
              <li>Confirm the recipient address, amount, and unlock conditions.</li>
              <li>Copy the transaction ID (TXID) shown after submission.</li>
              <li>Paste that TXID in the "Submit Transaction" form on XLMGuard.</li>
              <li>Once the seller uploads the required documents, return to your wallet and release the escrow.</li>
            </ol>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </>
      )}

      {/* footer code omitted */}

    </div>
  );
}

export default HomePage;





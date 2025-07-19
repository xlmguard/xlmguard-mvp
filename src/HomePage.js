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
  const [xlmPrice, setXlmPrice] = useState(null);
  const [xrpPrice, setXrpPrice] = useState(null);

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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Helmet>
        <title>XLMGuard | Secure Your Crypto Transactions</title>
      </Helmet>

      {/* Header */}
      <header style={{ padding: '1rem', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '40px' }} />
        </div>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white' }}>Home</Link>
          <Link to="/faq" style={{ color: 'white' }}>FAQ</Link>
          <Link to="/instructions" style={{ color: 'white' }}>Instructions</Link>
          <Link to="/contact" style={{ color: 'white' }}>Contact</Link>
          {!currentUser && <Link to="/login" style={{ color: 'white' }}>Login</Link>}
          {currentUser && (
            <button onClick={handleLogout} style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1>Welcome to XLMGuard</h1>
        <p>Blockchain-powered escrow and verification for XLM & XRP transactions.</p>
        <p><strong>XLM:</strong> ${xlmPrice} | <strong>XRP:</strong> ${xrpPrice}</p>
        <div style={{ marginTop: '2rem' }}>
          <button onClick={handleSubmitTransaction} style={{ padding: '10px 20px', marginRight: '10px' }}>
            Submit Escrow
          </button>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px' }}>
            How to Escrow
          </button>
        </div>
      </section>

      {/* Escrow Instructions Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 999
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', padding: '2rem', borderRadius: '10px', zIndex: 1000, width: '90%', maxWidth: '500px'
          }}>
            <h3>How to Set Up an Escrowed TXID</h3>
            <ol>
              <li>Create an escrow or multisig transaction in your wallet.</li>
              <li>Confirm the recipient address, amount, and unlock conditions.</li>
              <li>Copy the transaction ID (TXID) shown after submission.</li>
              <li>Paste the TXID in the "Submit Transaction" form on XLMGuard.</li>
              <li>Once the seller uploads required docs, return and release the escrow.</li>
            </ol>
            <button onClick={() => setShowModal(false)} style={{ marginTop: '1rem' }}>Close</button>
          </div>
        </>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f0f0f0', marginTop: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} XLMGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;






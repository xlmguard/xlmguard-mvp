// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
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
        style={{ width: '210px', marginBottom: '20px' }}
      />
      <h1>Welcome to XLMGuard<sup style={{ fontSize: '0.6em', marginLeft: '4px' }}>™</sup></h1>
      <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '16px' }}>{descriptions[language] || descriptions['English']}</p>

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
        <button onClick={() => navigate('/transaction-lookup')} style={{ marginRight: '10px' }}>Transaction Lookup</button>
        <button onClick={() => navigate('/submit')} style={{ marginRight: '10px' }}>Buyer Submit Transaction</button>
        <Link to="/faq">
          <button style={{ marginRight: '10px' }}>FAQ</button>
        </Link>
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

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '600px' }}>
            <h3>How to Set Up an Escrowed TXID</h3>
            <p>To manually escrow XLM or XRP, use a wallet that supports multisignature or smart contracts, such as <a href="https://lobstr.co/vault" target="_blank" rel="noopener noreferrer">LOBSTR Vault</a> or <a href="https://xrptoolkit.com" target="_blank" rel="noopener noreferrer">XRP Toolkit</a>.</p>
            <ol>
              <li>Create an escrow or multisig transaction in your wallet.</li>
              <li>Confirm the recipient address, amount, and unlock conditions.</li>
              <li>Copy the transaction ID (TXID) shown after submission.</li>
              <li>Paste that TXID in the "Submit Transaction" form on XLMGuard.</li>
              <li>Once the seller uploads the required documents, return to your wallet and release the escrow.</li>
            </ol>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <img src="/escrow-diagram.png" alt="Escrow Diagram" style={{ maxWidth: '100%' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;










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
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserRole(data.role || 'Unknown');
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
    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      {currentUser && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', textAlign: 'left' }}>
          <strong>Logged in as:</strong> {currentUser.email} ({userRole})
        </div>
      )}

      <img
        src="/logo.png"
        alt="XLMGuard Logo"
        style={{ width: '210px', marginBottom: '20px' }}
      />
      <h1>Welcome to XLMGuard</h1>
      <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '16px' }}>{descriptions[language] || descriptions['English']}</p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px' }}>Register</button>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>Login</button>
        <button onClick={() => navigate('/seller-confirm')} style={{ marginRight: '10px' }}>Seller Shipment Confirmation</button>
        <button onClick={() => navigate('/transaction-lookup')} style={{ marginRight: '10px' }}>Transaction Lookup</button>
        <button onClick={() => navigate('/submit')} style={{ marginRight: '10px' }}>Submit Transaction</button>
        <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
        <Link to="/about">
          <button style={{ marginRight: '10px' }}>About XLMGuard</button>
        </Link>
        <Link to="/faq">
          <button>FAQ</button>
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* ✅ Updated Footer */}
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


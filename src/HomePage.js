// HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const HomePage = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsReady(true); // Always show home page regardless of auth status
    });

    return () => unsubscribe();
  }, []);

  if (!isReady) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <img src="/logo192.png" alt="XLMGuard Logo" style={{ width: 132, marginBottom: 20 }} />
      <h1>Welcome to XLMGuard</h1>
      <p>
        Protect your XLM and XRP transactions from fraud with our secure transaction
        verification and protection system. Our service ensures that your payments are verified,
        logged, and can be validated anytime.
      </p>
      <div style={{ margin: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Register
        </button>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px' }}>
          Login
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <label htmlFor="language">Language:</label>
        <select id="language" style={{ marginLeft: '10px' }}>
          <option value="en">English</option>
          <option value="ja">日本語 (Japanese)</option>
          <option value="ko">한국어 (Korean)</option>
          <option value="pt">Português</option>
          <option value="zh">中文 (Chinese)</option>
        </select>
      </div>
    </div>
  );
};

export default HomePage;








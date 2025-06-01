// HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const HomePage = () => {
  const navigate = useNavigate();
  const [userStatusChecked, setUserStatusChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        if (!userData.hasPaid) {
          navigate('/payment');
        } else {
          navigate('/submit');
        }
      } else {
        setIsLoggedIn(false);
        setUserStatusChecked(true);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!userStatusChecked) {
    return <div>Checking status...</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <img src="/logo192.png" alt="XLMGuard Logo" style={{ width: 100, marginBottom: 20 }} />
      <h1>Welcome to XLMGuard</h1>
      <p>
        Protect your XLM and XRP transactions from fraud with our secure transaction
        verification and protection system.
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
          <option value="es">Español</option>
          <option value="fr">Français</option>
          {/* Add more languages as needed */}
        </select>
      </div>
    </div>
  );
};

export default HomePage;






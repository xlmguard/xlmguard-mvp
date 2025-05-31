// HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const HomePage = () => {
  const navigate = useNavigate();

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
        navigate('/register');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to XLMGuard</h1>
      <p>Redirecting based on your payment status...</p>
    </div>
  );
};

export default HomePage;




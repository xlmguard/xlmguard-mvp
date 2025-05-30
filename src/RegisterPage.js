import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add Firestore record
      await setDoc(doc(db, 'users', user.uid), { hasPaid: false });

      // Force sign out
      await signOut(auth);

      // Slight delay before navigation to ensure Firebase resets
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default RegisterPage;



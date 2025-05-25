// src/RegisterForm.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from './firebase'; // assuming 'app' is exported from firebase.js


const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Registered! Now go to payment.");
      // Redirect to payment or login
    } catch (err) {
      setError(err.message);
     }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔥 LIVE VERSION — REGISTER NOW</h1>
      <h2>Register for XLMGuard</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          Register
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
    );  
};

export default RegisterForm;


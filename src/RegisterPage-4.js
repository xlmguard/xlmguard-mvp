// src/RegisterPage.js

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { useNavigate, useLocation } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Detect ?pilot=freight from the Freight Forwarders landing page
  const params = new URLSearchParams(location.search);
  const isFreightPilot = params.get('pilot') === 'freight';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { email, password, name, role } = formData;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Base user doc
      const payload = {
        name,
        email,
        role,
        ...(role === 'buyer' && { hasPaid: false }),
      };

      // Grant one free pilot credit if they came from the freight landing
      if (role === 'buyer' && isFreightPilot) {
        payload.trialCredits = 1;
        payload.plan = 'pilot';           // optional metadata
        payload.pilotSource = 'freight';  // optional metadata
      } else if (role === 'buyer') {
        payload.trialCredits = 0;
      }

      await setDoc(doc(db, 'users', user.uid), payload, { merge: true });

      // Routing after signup
      if (role === 'seller') {
        navigate('/seller-confirm');
      } else {
        // Buyer
        if (isFreightPilot) {
          // They have 1 free credit — let them submit immediately
          navigate('/submit');
        } else {
          navigate('/payment');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Register</h1>

      {/* Small note if they came from the pilot */}
      {isFreightPilot && (
        <div style={{
          margin: '10px 0 16px',
          padding: '10px',
          border: '1px solid #fde68a',
          background: '#fffbeb',
          borderRadius: 8,
          color: '#92400e'
        }}>
          You’re signing up with a <b>Free Pilot</b> — your first shipment can be submitted without payment.
        </div>
      )}

      <form onSubmit={handleRegister}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')}>Return to Home Page</button>
      </div>
    </div>
  );
};

export default RegisterPage;

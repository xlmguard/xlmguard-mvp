import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onRegisterSuccess();
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', width: '100%', marginBottom: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', width: '100%', marginBottom: '8px' }}
        />
        <button
          type="submit"
          style={{ padding: '10px', width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none' }}
        >
          Register
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}

export default RegisterForm;

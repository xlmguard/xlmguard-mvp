import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const SubmissionForm = () => {
  const [currency, setCurrency] = useState('XLM');
  const [txId, setTxId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setMessage('User not authenticated. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('User not authenticated.');
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        currency,
        transactionId: txId,
        amount,
        notes,
        createdAt: Timestamp.now(),
      });

      setMessage('Transaction submitted successfully.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setMessage('Failed to submit transaction. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>
      {user && (
        <p>
          Logged in as: <strong>{user.displayName || user.email}</strong>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="XLM">XLM</option>
            <option value="XRP">XRP</option>
          </select>
        </div>
        <div>
          <label>Transaction ID:</label>
          <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} required />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmissionForm;








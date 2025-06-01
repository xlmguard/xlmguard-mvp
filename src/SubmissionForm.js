// SubmissionForm.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SubmissionForm = ({ user }) => {
  const [formData, setFormData] = useState({
    currency: 'XLM',
    transactionId: '',
    amount: '',
    notes: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        userId: user.uid,
        submittedAt: Timestamp.now(),
      });
      setStatusMessage('Transaction submitted successfully. Redirecting...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatusMessage('Failed to submit transaction. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Currency:</label>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="XLM">XLM</option>
            <option value="XRP">XRP</option>
          </select>
        </div>
        <div>
          <label>Transaction ID:</label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default SubmissionForm;





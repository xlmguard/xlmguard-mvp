// SubmissionForm.js
import React, { useState } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SubmissionForm = () => {
  const [form, setForm] = useState({
    currency: 'XLM',
    transactionHash: '',
    amount: '',
    note: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        ...form,
        uid: user.uid,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  if (submitted) {
    return <div>Transaction submitted successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>
      <div>
        <label>Currency:</label>
        <select name="currency" value={form.currency} onChange={handleChange}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
        </select>
      </div>
      <div>
        <label>Transaction Hash:</label>
        <input
          type="text"
          name="transactionHash"
          value={form.transactionHash}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Note (optional):</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
    </form>
  );
};

export default SubmissionForm;


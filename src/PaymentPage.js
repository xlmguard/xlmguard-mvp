// src/PaymentPage.js
import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  const handleConfirmPayment = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { hasPaid: true });
      setPaid(true);
      navigate('/submit');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Make a Payment</h1>
      <p>Please send your one-time payment to the wallet address below:</p>

      <h3>XLM Wallet:</h3>
      <code>GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL</code>
      <p>Memo: <strong>1095582935</strong></p>

      <h3>XRP Wallet:</h3>
      <code>rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J</code>
      <p>Destination Tag: <strong>1952896539</strong></p>

      <button onClick={handleConfirmPayment} style={{ marginTop: '2rem', padding: '10px 20px' }}>
        I Have Paid
      </button>

      {paid && <p style={{ color: 'green', marginTop: '1rem' }}>Payment confirmed. Redirecting...</p>}
    </div>
  );
}

export default PaymentPage;


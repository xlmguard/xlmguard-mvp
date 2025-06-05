// PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();

  const walletDetails = {
    XLM: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935',
      amount: 4
    },
    XRP: {
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539',
      amount: 2
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleConfirmPayment = async () => {
    if (user && txHash.trim()) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        hasPaid: true,
        paymentHash: txHash,
        paidAt: new Date(),
      });
      setConfirmationMessage('Payment confirmed! Redirecting...');
      setTimeout(() => navigate('/submit'), 1500);
    }
  };

  const { address, tag, amount } = walletDetails[currency];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p>
        Please send <strong>{amount} {currency}</strong> to the wallet below. Then enter your transaction hash.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label>Choose currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
        </select>
      </div>

      <div>
        <strong>Wallet Address:</strong> <code>{address}</code><br />
        <strong>Memo/Tag:</strong> <code>{tag}</code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>Transaction Hash:</label><br />
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter your transaction hash here"
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      <button onClick={handleConfirmPayment} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Confirm Payment
      </button>

      {confirmationMessage && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;







;












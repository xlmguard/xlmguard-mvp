import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';

function PaymentPage() {
  const [txHash, setTxHash] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (!user || !txHash.trim()) return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { hasPaid: true, txHash });
    navigate('/submit');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, background: '#000', color: '#0f0', padding: '5px', zIndex: 9999 }}>
        App Version: May 30 - Post Registration Fix
      </div>

      <h1>Make a Payment</h1>
      <p>Please send your one-time payment to the wallet address below:</p>

      <h2>XLM Wallet:</h2>
      <code style={{ fontSize: '1rem' }}>
        GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL
      </code>
      <p><strong>Memo:</strong> <span style={{ fontWeight: 600 }}>1095582935</span></p>

      <h2>XRP Wallet:</h2>
      <code style={{ fontSize: '1rem' }}>
        rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J
      </code>
      <p><strong>Destination Tag:</strong> <span style={{ fontWeight: 600 }}>1952896539</span></p>

      <div style={{ marginTop: '2rem' }}>
        <label htmlFor="txHash">Enter Transaction Hash / ID:</label>
        <input
          id="txHash"
          type="text"
          value={txHash}
          onChange={e => setTxHash(e.target.value)}
          style={{ display: 'block', width: '100%', maxWidth: '500px', marginTop: '0.5rem', marginBottom: '1rem' }}
        />
        <button onClick={handleConfirm} style={{ padding: '10px 20px' }}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;



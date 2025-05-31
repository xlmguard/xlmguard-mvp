// PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState({ address: '', memo: '', currency: '' });
  const [txHash, setTxHash] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Determine payment type based on email or logic
        const isXRP = currentUser.email.includes('xrp');
        setWalletInfo({
          address: isXRP
            ? 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J'
            : 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
          memo: isXRP ? '1952896539' : '1095582935',
          currency: isXRP ? 'XRP' : 'XLM'
        });
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
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p>
        Please send <strong>25 {walletInfo.currency}</strong> to the wallet below. After payment, enter your transaction hash to confirm.
      </p>
      <div>
        <strong>Wallet Address:</strong> <code>{walletInfo.address}</code><br />
        <strong>Memo/Tag:</strong> <code>{walletInfo.memo}</code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="txHash">Transaction Hash:</label><br />
        <input
          type="text"
          id="txHash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter your transaction hash here"
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      <button onClick={handleConfirmPayment} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentPage;






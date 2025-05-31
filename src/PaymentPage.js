// PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState({ address: '', memo: '' });
  const [txHash, setTxHash] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Hardcoded example wallet values, replace with real ones if dynamic
        setWalletInfo({
          address: currentUser.email.includes('xrp')
            ? 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J'
            : 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
          memo: currentUser.email.includes('xrp')
            ? '1952896539'
            : '1095582935',
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
      navigate('/submit');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p>
        Please send payment to the wallet below. After payment, enter your transaction hash.
      </p>
      <div>
        <strong>Wallet Address:</strong> {walletInfo.address}<br />
        <strong>Memo/Tag:</strong> {walletInfo.memo}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="txHash">Transaction Hash:</label><br />
        <input
          type="text"
          id="txHash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
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





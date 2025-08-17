// PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  addDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { QRCodeCanvas } from 'qrcode.react';

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [reseller, setReseller] = useState(null);

  const navigate = useNavigate();

  const walletDetails = {
    XLM: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935'
    },
    XRP: {
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539'
    },
    USDC: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935'
    }
  };

  const baseFeeRate = 0.0075; // 0.75%
  const minimumFee = 100.0;   // $100 minimum fee

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateCoupon = async () => {
    if (!coupon) return;

    const couponCode = coupon.trim().toLowerCase(); // normalize input
    const q = query(
      collection(db, 'resellerCodes'),
      where('code', '==', couponCode)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0].data();
      if (doc.active) {
        setDiscount(doc.discountRate);
        setReseller({
          id: querySnapshot.docs[0].id,
          ...doc
        });
        setConfirmationMessage(`Coupon applied! ${doc.discountRate * 100}% discount from ${doc.resellerName}`);
      } else {
        setConfirmationMessage('Coupon is not active.');
      }
    } else {
      setConfirmationMessage('Invalid coupon code.');
    }
  };

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);

    const transactionAmount = 50000; // Example transaction amount
    let fee = transactionAmount * baseFeeRate;
    if (fee < minimumFee) fee = minimumFee;

    // Apply discount if coupon is valid
    const discountedFee = fee - (fee * discount);

    try {
      const txRef = await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        currency,
        transactionAmount,
        fee: discountedFee,
        reseller: reseller ? reseller.resellerName : null,
        resellerCode: reseller ? reseller.code : null,
        createdAt: new Date(),
        status: 'pending'
      });

      setConfirmationMessage(
        `Transaction submitted! Pay ${discountedFee.toFixed(2)} USD equivalent in ${currency}.`
      );

      // update reseller stats
      if (reseller) {
        await updateDoc(doc(db, 'resellerCodes', reseller.id), {
          lastUsed: new Date(),
          status: 'assigned'
        });
      }

      setTxHash(txRef.id);
    } catch (error) {
      console.error('Error processing transaction:', error);
      setConfirmationMessage('Payment failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Payment Page</h2>

      <label>Choose Currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="XLM">XLM</option>
        <option value="XRP">XRP</option>
        <option value="USDC">USDC</option>
      </select>

      <div style={{ marginTop: '20px' }}>
        <label>Coupon Code:</label>
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
        />
        <button onClick={validateCoupon}>Apply Coupon</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      {confirmationMessage && (
        <p style={{ marginTop: '20px', color: 'green' }}>{confirmationMessage}</p>
      )}

      {txHash && (
        <div style={{ marginTop: '20px' }}>
          <p>Transaction ID: {txHash}</p>
          <QRCodeCanvas value={txHash} />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

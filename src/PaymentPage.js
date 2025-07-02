// PaymentPage.js
import QRCode from "qrcode.react";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
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



const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const walletDetails = {
    XLM: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935',
      amount: 100
     },
    XRP: {
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539',
      amount: 10
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

  const validateXLMTransaction = async (txid, expectedMemo, expectedAmount, destinationAddress) => {
    try {
      const txRes = await fetch(`https://horizon.stellar.org/transactions/${txid}`);
      if (!txRes.ok) return { success: false, message: "Transaction not found on Stellar network." };

      const txData = await txRes.json();
      if (txData.memo !== expectedMemo) {
        return { success: false, message: "Memo does not match." };
      }

      const opRes = await fetch(txData._links.operations.href);
      const opData = await opRes.json();
      const payment = opData._embedded.records.find(op =>
        op.type === "payment" &&
        op.to === destinationAddress &&
        op.amount === expectedAmount.toString()
      );

      if (!payment) {
        return { success: false, message: "Payment not found or does not match expected amount/address." };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: "Error validating XLM transaction." };
    }
  };

  const validateXRPTransaction = async (txid, expectedTag, expectedAmount, destinationAddress) => {
    try {
      const response = await fetch(`https://api.xrpscan.com/api/v1/tx/${txid}`);
      if (!response.ok) return { success: false, message: "Transaction not found on XRP ledger." };

      const data = await response.json();
      if (
        data.Destination !== destinationAddress ||
        data.DestinationTag?.toString() !== expectedTag.toString() ||
        parseFloat(data.Amount) / 1_000_000 < parseFloat(expectedAmount)
      ) {
        return { success: false, message: "Transaction does not match expected destination, tag, or amount." };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: "Error validating XRP transaction." };
    }
  };

  const isDuplicateTransaction = async (txid) => {
    const q = query(collection(db, 'users'), where('paymentHash', '==', txid));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const logFailedAttempt = async (reason) => {
    await addDoc(collection(db, 'failedPayments'), {
      uid: user?.uid || 'unknown',
      txid: txHash.trim(),
      currency,
      reason,
      timestamp: new Date()
    });
  };

  const handleConfirmPayment = async () => {
    const trimmedTx = txHash.trim();
    if (!user || !trimmedTx) return;

    setLoading(true);
    setConfirmationMessage('');

    const duplicate = await isDuplicateTransaction(trimmedTx);
    if (duplicate) {
      const msg = "This transaction has already been used.";
      setConfirmationMessage(`❌ ${msg}`);
      await logFailedAttempt(msg);
      setLoading(false);
      return;
    }

    let result = { success: true };
    if (currency === "XLM") {
      result = await validateXLMTransaction(
        trimmedTx,
        walletDetails.XLM.tag,
        walletDetails.XLM.amount,
        walletDetails.XLM.address
      );
    } else if (currency === "XRP") {
      result = await validateXRPTransaction(
        trimmedTx,
        walletDetails.XRP.tag,
        walletDetails.XRP.amount,
        walletDetails.XRP.address
      );
    }

    if (!result.success) {
      setConfirmationMessage(`❌ ${result.message}`);
      await logFailedAttempt(result.message);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasPaid: true,
      currency,
      paymentHash: trimmedTx,
      paidAt: new Date(),
    });

    setConfirmationMessage('✅ Payment confirmed! Redirecting...');
    setTimeout(() => navigate('/submit'), 1500);
    setLoading(false);
  };

  const { address, tag, amount } = walletDetails[currency];

 return (
  <div style={{ padding: '20px' }}>
    <h2>Make a Payment</h2>
    <p style={{ color: 'red', fontWeight: 'bold' }}>
      Note: Refresh your browser after payment is made if the page doesn't redirect automatically.
    </p>
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

    {/* QR Code Section */}
    <div style={{ marginTop: '20px' }}>
      <h4>Scan QR Code to Pay:</h4>
      {currency === "XLM" && (
        <QRCode
          value={`web+stellar:pay?destination=${address}&amount=${amount}&memo=${tag}`}
          size={200}
          level="H"
          includeMargin={true}
        />
      )}
      {currency === "XRP" && (
        <QRCode
          value={`ripple:${address}?amount=${amount}&dt=${tag}`}
          size={200}
          level="H"
          includeMargin={true}
        />
      )}
      <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
        Scan this code in your wallet app to auto-fill address, amount, and memo/tag.
      </p>
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

    <button
      onClick={handleConfirmPayment}
      style={{ marginTop: '20px', padding: '10px 20px' }}
      disabled={loading}
    >
      {loading ? 'Validating...' : 'Confirm Payment'}
    </button>

    {confirmationMessage && (
      <div
        style={{
          marginTop: '20px',
          color: confirmationMessage.startsWith('✅') ? 'green' : 'red'
        }}
      >
        {confirmationMessage}
      </div>
    )}

    <div style={{ marginTop: '30px' }}>
      <button onClick={() => navigate('/')}>Return to Home Page</button>
    </div>
    <div style={{ marginTop: '10px' }}>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  </div>
);

};

export default PaymentPage;


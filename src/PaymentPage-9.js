// PaymentPage.js – $100 USD Dynamic Pricing for XLM/XRP/USDC
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(100); // Default fallback
  const baseUSDPrice = 100;

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
      address: 'GCFR6W6HKJGHRNMH3PB45TWD4ASVPJZY3KUUIYUXAKZ6MFNUS5VDJVYW',
      tag: 'stablecoin-payment'
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

  useEffect(() => {
    fetchPrice(currency);
  }, [currency]);

  const fetchPrice = async (cur) => {
    const idMap = {
      XLM: 'stellar',
      XRP: 'ripple',
      USDC: 'usd-coin'
    };

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idMap[cur]}&vs_currencies=usd`);
      const data = await res.json();
      const usdRate = data[idMap[cur]].usd;
      const amount = baseUSDPrice / usdRate;
      setRequiredAmount(amount.toFixed(4));
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

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
        parseFloat(op.amount) >= parseFloat(expectedAmount)
      );
      if (!payment) {
        return { success: false, message: "Payment not found or does not match expected amount/address." };
      }
      return { success: true };
    } catch {
      return { success: false, message: "Error validating Stellar transaction." };
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
    } catch {
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
    if (currency === "XLM" || currency === "USDC") {
      result = await validateXLMTransaction(
        trimmedTx,
        walletDetails[currency].tag,
        requiredAmount,
        walletDetails[currency].address
      );
    } else if (currency === "XRP") {
      result = await validateXRPTransaction(
        trimmedTx,
        walletDetails.XRP.tag,
        requiredAmount,
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
      walletAddress: walletDetails[currency].address,
      walletMemo: walletDetails[currency].tag,
      usdValue: baseUSDPrice,
      cryptoAmount: requiredAmount
    });

    setConfirmationMessage('✅ Payment confirmed! Redirecting...');
    setTimeout(() => navigate('/submit'), 1500);
    setLoading(false);
  };

  const { address, tag } = walletDetails[currency];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p><strong>Service Price: ${baseUSDPrice} USD</strong></p>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        Note: Refresh your browser after payment is made if the page doesn't redirect automatically.
      </p>
      <p>
        Please send <strong>{requiredAmount} {currency}</strong> to the wallet below. Then enter your transaction hash.
      </p>

      <label>Choose currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="XLM">XLM</option>
        <option value="XRP">XRP</option>
        <option value="USDC">USDC</option>
      </select>

      <div>
        <strong>Wallet Address:</strong> <code>{address}</code><br />
        <strong>Memo/Tag:</strong> <code>{tag}</code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Scan QR Code to Pay:</h4>
        <QRCodeCanvas
          value={
            currency === "XLM" || currency === "USDC"
              ? `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${tag}${currency === "USDC" ? '&asset_code=USDC' : ''}`
              : `ripple:${address}?amount=${requiredAmount}&dt=${tag}`
          }
          size={200}
          level="H"
          includeMargin={true}
        />
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
    </div>
  );
};

export default PaymentPage;

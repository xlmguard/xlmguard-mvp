// PaymentPage.js – $100 USD Dynamic Pricing (XLM / XRP / USDC → Coinbase on Stellar)
// Adds auto-capture of the payer's wallet address on successful validation.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc, updateDoc, getDocs, query, where, collection, addDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { QRCodeCanvas } from 'qrcode.react';

// Optional (recommended): enforce USDC issuer on Stellar
// Put in .env and rebuild: REACT_APP_STELLAR_USDC_ISSUER=<USDC issuer G... key>
const USDC_STELLAR_ISSUER = process.env.REACT_APP_STELLAR_USDC_ISSUER || '';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState('100.00');
  const baseUSDPrice = 100;

  // === DESTINATIONS (your receiving wallets) ===
  const walletDetails = {
    XLM: {
      network: 'Stellar',
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935' // Coinbase memo for XLM
    },
    XRP: {
      network: 'XRP Ledger',
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539' // Coinbase destination tag for XRP
    },
    USDC: {
      network: 'Stellar (Coinbase)',
      address: 'GDZHDOITT5W2S35LVJZRLUAUXLU7UEDEAN4R7O4VA5FFGKG7RHC4NPSC', // Coinbase USDC (Stellar) address
      tag: '350349871' // Coinbase USDC memo (required)
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate('/login');
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    fetchPrice(currency);
  }, [currency]);

  const fetchPrice = async (cur) => {
    const idMap = { XLM: 'stellar', XRP: 'ripple', USDC: 'usd-coin' };
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${idMap[cur]}&vs_currencies=usd`
      );
      const data = await res.json();
      const usdRate = data[idMap[cur]]?.usd || 1;
      const amt = baseUSDPrice / usdRate;
      const decimals = cur === 'USDC' ? 2 : 4;
      setRequiredAmount(amt.toFixed(decimals));
    } catch {
      setRequiredAmount(cur === 'USDC' ? '100.00' : '100.0000');
    }
  };

  // —— Validators ————————————————————————————————
  // Stellar validator for native XLM and assets (USDC on Stellar).
  // Returns { success, payer? } where payer is the sender address (G...)
  const validateStellarTx = async ({
    txid,
    expectedMemo,
    minAmount,
    destination,
    assetCode = null,
    assetIssuer = null
  }) => {
    try {
      const txRes = await fetch(`https://horizon.stellar.org/transactions/${txid}`);
      if (!txRes.ok) return { success: false, message: 'Transaction not found on Stellar.' };
      const tx = await txRes.json();

      if ((tx.memo || '') !== (expectedMemo || '')) {
        return { success: false, message: 'Memo does not match.' };
      }

      const opsRes = await fetch(tx._links.operations.href);
      const opsJson = await opsRes.json();
      const recs = opsJson?._embedded?.records || [];

      const match = recs.find((op) => {
        const typeOk = ['payment', 'path_payment_strict_send', 'path_payment_strict_receive'].includes(op.type);
        if (!typeOk) return false;
        const toOk = op.to === destination;
        const amtOk = parseFloat(op.amount) >= parseFloat(minAmount);

        if (assetCode) {
          const codeOk = op.asset_code === assetCode;
          const issuerOk = assetIssuer ? op.asset_issuer === assetIssuer : true;
          return toOk && amtOk && codeOk && issuerOk;
        } else {
          return toOk && amtOk && op.asset_type === 'native'; // XLM
        }
      });

      if (!match) {
        return { success: false, message: 'Payment not found or asset/address/amount mismatch.' };
      }
      const payer = match.from || tx.source_account || null; // sender on Stellar
      return { success: true, payer };
    } catch {
      return { success: false, message: 'Error validating Stellar transaction.' };
    }
  };

  // XRP validator. Returns { success, payer? } where payer is the sender r-address.
  const validateXRPTransaction = async (txid, expectedTag, expectedAmount, destinationAddress) => {
    try {
      const response = await fetch(`https://api.xrpscan.com/api/v1/tx/${txid}`);
      if (!response.ok) return { success: false, message: 'Transaction not found on XRP ledger.' };
      const data = await response.json();

      const toOk = data.Destination === destinationAddress;
      const tagOk = (data.DestinationTag?.toString() || '') === expectedTag.toString();
      const amtOk = parseFloat(data.Amount) / 1_000_000 >= parseFloat(requiredAmount);

      if (!toOk || !tagOk || !amtOk) {
        return { success: false, message: 'Destination, tag, or amount mismatch.' };
      }
      return { success: true, payer: data.Account };
    } catch {
      return { success: false, message: 'Error validating XRP transaction.' };
    }
  };

  // —— Helpers ——————————————————————————————————————
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

  // —— Confirm ———————————————————————————————————————
  const handleConfirmPayment = async () => {
    const trimmedTx = txHash.trim();
    if (!user || !trimmedTx) return;

    setLoading(true);
    setConfirmationMessage('');

    const duplicate = await isDuplicateTransaction(trimmedTx);
    if (duplicate) {
      const msg = 'This transaction has already been used.';
      setConfirmationMessage(`❌ ${msg}`);
      await logFailedAttempt(msg);
      setLoading(false);
      return;
    }

    let result = { success: false, message: 'Unsupported currency.' };
    let payerAddress = null;

    if (currency === 'XLM') {
      result = await validateStellarTx({
        txid: trimmedTx,
        expectedMemo: walletDetails.XLM.tag,
        minAmount: requiredAmount,
        destination: walletDetails.XLM.address
      });
    } else if (currency === 'USDC') {
      result = await validateStellarTx({
        txid: trimmedTx,
        expectedMemo: walletDetails.USDC.tag, // Coinbase memo
        minAmount: requiredAmount,
        destination: walletDetails.USDC.address, // Coinbase Stellar address
        assetCode: 'USDC',
        assetIssuer: USDC_STELLAR_ISSUER || undefined
       });
    } else if (currency === 'XRP') {
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
    payerAddress = result.payer || null;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasPaid: true,
      currency,
      paymentHash: trimmedTx,
      paidAt: new Date(),
      walletAddress: walletDetails[currency].address, // your receiving address
      walletMemo: walletDetails[currency].tag || null, // your memo/tag
      buyerWalletAddress: payerAddress,                // <-- auto-captured payer address
      buyerWalletCurrency: currency,                   // <-- for clarity
      usdValue: baseUSDPrice,
      cryptoAmount: requiredAmount
    });

    setConfirmationMessage(
      `✅ Payment confirmed!${payerAddress ? ' Payer: ' + payerAddress : ''} Redirecting...`
    );
    setTimeout(() => navigate('/submit'), 1500);
    setLoading(false);
  };

  const { address, tag, network } = walletDetails[currency];
  const currencyLabel = currency === 'USDC' ? 'USDC (Stellar → Coinbase)' : currency;

  const qrValue =
    currency === 'XRP'
      ? `ripple:${address}?amount=${requiredAmount}&dt=${tag}`
      : currency === 'USDC'
      ? `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${encodeURIComponent(tag)}&asset_code=USDC${
          USDC_STELLAR_ISSUER ? `&asset_issuer=${USDC_STELLAR_ISSUER}` : ''
        }`
      : // XLM native
        `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${encodeURIComponent(tag)}`;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p><strong>Service Price: ${baseUSDPrice} USD</strong></p>

      <p style={{ color: 'red', fontWeight: 'bold' }}>
        Note: Refresh your browser after payment is made if the page doesn't redirect automatically.
      </p>

      <p>
        Please send <strong>{requiredAmount} {currencyLabel}</strong> to the wallet below, then enter your transaction hash.
      </p>

      <label>Choose currency:&nbsp;</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="XLM">XLM</option>
        <option value="XRP">XRP</option>
        <option value="USDC">USDC</option>
      </select>

      <div style={{ marginTop: 10 }}>
        <div><strong>Network:</strong> {network}</div>
        <div><strong>Wallet Address:</strong> <code>{address}</code></div>
        <div><strong>Memo/Tag:</strong> <code>{tag || 'None'}</code></div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Scan QR Code to Pay:</h4>
        <QRCodeCanvas value={qrValue} size={200} level="H" includeMargin />
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

// PaymentPage.js – 0.75% Service Fee with $100 Minimum (XLM / XRP / USDC → Coinbase on Stellar)
// Validates on-chain payment and auto-captures payer wallet address.
// Handles saving fee to a transaction doc by doc ID OR by `transactionId` field.

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  addDoc,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { QRCodeCanvas } from 'qrcode.react';

// Optional (recommended): enforce USDC issuer on Stellar
// Put in .env and rebuild: REACT_APP_STELLAR_USDC_ISSUER=<USDC issuer G... key>
const USDC_STELLAR_ISSUER = process.env.REACT_APP_STELLAR_USDC_ISSUER || '';

const FEE_RATE = 0.0075;       // 0.75%
const MIN_FEE_USD = 100.0;     // $100 minimum

const PaymentPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [currency, setCurrency] = useState('XLM');
  const [txHash, setTxHash] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [amountUSD, setAmountUSD] = useState('');         // underlying trade amount (USD)
  const [feeUSD, setFeeUSD] = useState(0);                // service fee USD
  const [requiredAmount, setRequiredAmount] = useState('0'); // crypto to send for the fee
  const [prices, setPrices] = useState(null);

  // Optional: link fee to a specific transaction doc. Accepts EITHER:
  //  - Firestore doc ID, OR
  //  - The value of the `transactionId` field (we'll detect and handle both).
  const [txDocId, setTxDocId] = useState('');

  // === DESTINATIONS (your receiving wallets) ===
  const walletDetails = {
    XLM: {
      network: 'Stellar',
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935', // Coinbase memo for XLM
    },
    XRP: {
      network: 'XRP Ledger',
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539', // Coinbase destination tag for XRP
    },
    USDC: {
      network: 'Stellar (Coinbase)',
      address:
        'GDZHDOITT5W2S35LVJZRLUAUXLU7UEDEAN4R7O4VA5FFGKG7RHC4NPSC', // Coinbase USDC (Stellar) address
      tag: '350349871', // Coinbase USDC memo (required)
    },
  };

  // Auth gate
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate('/login');
    });
    return () => unsub();
  }, [navigate]);

  // Fetch prices on load & when currency changes
  useEffect(() => {
    fetchPrices();
  }, [currency]);

  const fetchPrices = async () => {
    const idMap = { XLM: 'stellar-lumens', XRP: 'ripple', USDC: 'usd-coin' };
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${idMap.XLM},${idMap.XRP},${idMap.USDC}&vs_currencies=usd`
      );
      const data = await res.json();
      setPrices({
        xlmUsd: data[idMap.XLM]?.usd ?? null,
        xrpUsd: data[idMap.XRP]?.usd ?? null,
        usdcUsd: data[idMap.USDC]?.usd ?? 1.0,
      });
    } catch {
      setPrices({ xlmUsd: null, xrpUsd: null, usdcUsd: 1.0 });
    }
  };

  // Parse amount
  const parsedAmount = useMemo(() => {
    const n = parseFloat(String(amountUSD).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [amountUSD]);

  // Compute feeUSD (0.75% with $100 minimum)
  useEffect(() => {
    const pct = parsedAmount * FEE_RATE;
    const fee = Math.max(pct, MIN_FEE_USD);
    setFeeUSD(Number.isFinite(fee) ? fee : 0);
  }, [parsedAmount]);

  // Convert feeUSD to selected asset amount
  useEffect(() => {
    if (!prices) return;
    const { xlmUsd, xrpUsd, usdcUsd } = prices;
    let amt = 0;
    if (currency === 'XLM' && xlmUsd) amt = feeUSD / xlmUsd;
    if (currency === 'XRP' && xrpUsd) amt = feeUSD / xrpUsd;
    if (currency === 'USDC' && usdcUsd) amt = feeUSD / usdcUsd; // ~1:1
    const decimals = currency === 'USDC' ? 2 : 4;
    setRequiredAmount(
      amt > 0 ? amt.toFixed(decimals) : currency === 'USDC' ? '0.00' : '0.0000'
    );
  }, [feeUSD, prices, currency]);

  // —— Validators ————————————————————————————————
  // Stellar validator for native XLM and assets (USDC on Stellar).
  // Returns { success, payer? } where payer is the sender address (G...)
  const validateStellarTx = async ({
    txid,
    expectedMemo,
    minAmount,
    destination,
    assetCode = null,
    assetIssuer = null,
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
  const validateXRPTransaction = async (
    txid,
    expectedTag,
    expectedAmount,
    destinationAddress
  ) => {
    try {
      const response = await fetch(`https://api.xrpscan.com/api/v1/tx/${txid}`);
      if (!response.ok) return { success: false, message: 'Transaction not found on XRP ledger.' };
      const data = await response.json();

      const toOk = data.Destination === destinationAddress;
      const tagOk = (data.DestinationTag?.toString() || '') === expectedTag.toString();
      const amtOk = parseFloat(data.Amount) / 1_000_000 >= parseFloat(expectedAmount);

      if (!toOk || !tagOk || !amtOk) {
        return { success: false, message: 'Destination, tag, or amount mismatch.' };
      }
      return { success: true, payer: data.Account };
    } catch {
      return { success: false, message: 'Error validating XRP transaction.' };
    }
  };

  // —— Helpers ——————————————————————————————————————
  const isDuplicateTransaction = async (hash) => {
    const qy = query(collection(db, 'users'), where('paymentHash', '==', hash));
    const snapshot = await getDocs(qy);
    return !snapshot.empty;
  };

  const logFailedAttempt = async (reason) => {
    await addDoc(collection(db, 'failedPayments'), {
      uid: user?.uid || 'unknown',
      txid: txHash.trim(),
      currency,
      reason,
      timestamp: new Date(),
    });
  };

  // —— Confirm ———————————————————————————————————————
  const handleConfirmPayment = async () => {
    const trimmedTx = txHash.trim();
    if (!user || !trimmedTx) return;

    // basic guard
    if (!(parsedAmount > 0) || !(feeUSD > 0)) {
      setConfirmationMessage('❌ Enter a valid USD transaction amount first.');
      return;
    }

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
        destination: walletDetails.XLM.address,
      });
    } else if (currency === 'USDC') {
      result = await validateStellarTx({
        txid: trimmedTx,
        expectedMemo: walletDetails.USDC.tag,
        minAmount: requiredAmount,
        destination: walletDetails.USDC.address,
        assetCode: 'USDC',
        assetIssuer: USDC_STELLAR_ISSUER || undefined,
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

    // Save fee payment status onto the user
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasPaid: true,
      currency,
      paymentHash: trimmedTx,
      paidAt: new Date(),
      walletAddress: walletDetails[currency].address, // your receiving address
      walletMemo: walletDetails[currency].tag || null, // your memo/tag
      buyerWalletAddress: payerAddress,                // auto-captured payer
      buyerWalletCurrency: currency,
      usdValue: round2(feeUSD),                        // actual USD fee paid
      cryptoAmount: requiredAmount,                    // amount of crypto they sent for the fee
    });

    // Optionally also store fee details into a specific transaction doc (by doc ID OR by `transactionId` field)
    if (txDocId.trim().length > 0) {
      const key = txDocId.trim();
      let docRefToUpdate = null;

      // Try by document ID first
      const byIdRef = doc(db, 'transactions', key);
      const byIdSnap = await getDoc(byIdRef);
      if (byIdSnap.exists()) {
        docRefToUpdate = byIdRef;
      } else {
        // Fallback: try by transactionId field (this is your schema)
        const qy = query(
          collection(db, 'transactions'),
          where('transactionId', '==', key)
        );
        const qSnap = await getDocs(qy);
        if (!qSnap.empty) {
          docRefToUpdate = qSnap.docs[0].ref;
        }
      }

      if (docRefToUpdate) {
        await updateDoc(docRefToUpdate, {
          serviceFeeUSD: round2(feeUSD),
          serviceFeeAsset: currency,
          serviceFeeCrypto:
            currency === 'USDC'
              ? roundN(parseFloat(requiredAmount), 2)
              : roundN(parseFloat(requiredAmount), 6),
          feeRate: FEE_RATE,
          feeMinUSD: MIN_FEE_USD,
          transactionAmountUSD: round2(parsedAmount),
          pricingCapturedAt: new Date().toISOString(),
          feePaymentHash: trimmedTx,
          feePayerAddress: payerAddress || null,
        });
      }
    }

    setConfirmationMessage(
      `✅ Payment confirmed! Fee: $${round2(feeUSD)}${
        payerAddress ? ' • Payer: ' + payerAddress : ''
      } Redirecting...`
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
      ? `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${encodeURIComponent(
          tag
        )}&asset_code=USDC${
          USDC_STELLAR_ISSUER ? `&asset_issuer=${USDC_STELLAR_ISSUER}` : ''
        }`
      : // XLM native
        `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${encodeURIComponent(
          tag
        )}`;

  const fmt = (n, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '—');
  const round2 = (n) => Math.round(n * 100) / 100;
  const roundN = (n, d) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Make a Payment</h2>
      <p>
        XLMGuard service fee is <strong>{(FEE_RATE * 100).toFixed(2)}%</strong> of your
        transaction amount, with a <strong>${MIN_FEE_USD.toFixed(2)}</strong> minimum.
      </p>

      <div style={{ marginTop: 10, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <label style={{ fontWeight: 600 }}>Transaction Amount (USD)</label>
        <br />
        <input
          type="number"
          min="0"
          step="0.01"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
          placeholder="e.g., 2000.00"
          style={{ width: 240, padding: 8, marginTop: 6 }}
        />
        <div style={{ marginTop: 8 }}>
          <div>
            <strong>Calculated Service Fee (USD):</strong> ${fmt(feeUSD, 2)}{' '}
            <span style={{ color: '#6b7280' }}>(greater of 0.75% or $100)</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Pay Fee With:&nbsp;</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <div>
          <strong>Network:</strong> {network}
        </div>
        <div>
          <strong>Wallet Address:</strong> <code>{address}</code>
        </div>
        <div>
          <strong>Memo/Tag:</strong> <code>{tag || 'None'}</code>
        </div>
        <div style={{ marginTop: 8 }}>
          <strong>Send:</strong> {requiredAmount} {currencyLabel}{' '}
          <span style={{ color: '#6b7280' }}>(≈ ${fmt(feeUSD, 2)} at current rates)</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Scan QR Code to Pay:</h4>
        <QRCodeCanvas value={qrValue} size={200} level="H" includeMargin />
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>Transaction Hash:</label>
        <br />
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter your transaction hash here"
          style={{ width: '320px', padding: '8px' }}
        />
      </div>

      <div style={{ marginTop: 12, padding: 12, border: '1px dashed #e5e7eb', borderRadius: 8 }}>
        <label>Attach this fee to a Transaction record (optional):</label>
        <br />
        <input
          type="text"
          value={txDocId}
          onChange={(e) => setTxDocId(e.target.value)}
          placeholder="Enter *either* Firestore doc ID or the transactionId field value"
          style={{ width: '420px', padding: '8px' }}
        />
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
          We’ll try updating by document ID first; if not found, we’ll search by the{' '}
          <code>transactionId</code> field.
        </div>
      </div>

      <button
        onClick={handleConfirmPayment}
        style={{ marginTop: '20px', padding: '10px 20px' }}
        disabled={loading || !(parsedAmount > 0) || !(feeUSD > 0)}
      >
        {loading ? 'Validating...' : 'Confirm Payment'}
      </button>

      {confirmationMessage && (
        <div
          style={{
            marginTop: '20px',
            color: confirmationMessage.startsWith('✅') ? 'green' : 'red',
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

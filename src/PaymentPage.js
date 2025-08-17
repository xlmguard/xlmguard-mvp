// PaymentPage.js – 0.75% fee (min $100) + resilient coupon lookup + reseller basis
// - Normalizes coupon to UPPERCASE for display
// - Looks up coupon by documentId *or* code field (upper & lower)
// - Valid coupon: { active: true, status: 'assigned' }

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  addDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { QRCodeCanvas } from 'qrcode.react';

const USDC_STELLAR_ISSUER = process.env.REACT_APP_STELLAR_USDC_ISSUER || '';

const FEE_RATE = 0.0075;       // 0.75%
const MIN_FEE_USD = 100.0;     // $100 minimum
const DEFAULT_DISCOUNT = 0.05; // 5% if coupon valid
const DEFAULT_PAYOUT = 0.10;   // default 10% reseller basis (stored)

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => (u ? setUser(u) : navigate('/login')));
    return () => unsub();
  }, [navigate]);

  // Pricing
  const [amountUSD, setAmountUSD] = useState('');
  const [feeGrossUSD, setFeeGrossUSD] = useState(0);
  const [feeNetUSD, setFeeNetUSD] = useState(0);
  const [feeDiscountUSD, setFeeDiscountUSD] = useState(0);

  // FX
  const [currency, setCurrency] = useState('XLM');
  const [prices, setPrices] = useState(null);
  const [requiredAmount, setRequiredAmount] = useState('0');

  // TX hash / status
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponMeta, setCouponMeta] = useState(null); // {resellerId, resellerName, discountRate, payoutRate}
  const [couponStatus, setCouponStatus] = useState('');

  // Prefill coupon from ?ref= and localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = (params.get('ref') || '').trim().toUpperCase();
    const stored = (localStorage.getItem('xlmguard_ref') || '').toUpperCase();
    const chosen = ref || stored;
    if (chosen) {
      setCouponCode(chosen);
      localStorage.setItem('xlmguard_ref', chosen);
    }
  }, [location.search]);

  // Resilient coupon lookup
  useEffect(() => {
    const run = async () => {
      setCouponMeta(null);
      setCouponStatus('');
      const raw = (couponCode || '').trim();
      if (!raw) return;

      const CODE_UP = raw.toUpperCase();
      const CODE_LO = raw.toLowerCase();

      try {
        // 1) Try by document ID (preferred if you later rename docs to code)
        let snap = await getDoc(doc(db, 'resellerCodes', CODE_UP));
        let data = snap.exists() ? snap.data() : null;

        // 2) Fallback by 'code' field (UPPER then lower)
        if (!data) {
          let q1 = query(collection(db, 'resellerCodes'), where('code', '==', CODE_UP));
          let s1 = await getDocs(q1);
          if (!s1.empty) data = s1.docs[0].data();
        }
        if (!data) {
          let q2 = query(collection(db, 'resellerCodes'), where('code', '==', CODE_LO));
          let s2 = await getDocs(q2);
          if (!s2.empty) data = s2.docs[0].data();
        }

        if (!data) {
          setCouponStatus('Lookup error — no discount applied');
          return;
        }

        // Valid when active + assigned
        if (data.active === true && data.status === 'assigned') {
          const discountRate =
            typeof data.discountRate === 'number' ? data.discountRate : DEFAULT_DISCOUNT;
          const payoutRate =
            typeof data.payoutRate === 'number' ? data.payoutRate : DEFAULT_PAYOUT;

          setCouponMeta({
            resellerId: data.resellerId || null,
            resellerName: data.resellerName || null,
            discountRate,
            payoutRate,
          });
          setCouponStatus('✓ Coupon applied');
        } else {
          setCouponStatus('Inactive or unassigned — no discount applied');
        }
      } catch (e) {
        setCouponStatus('Lookup error — no discount applied');
      }
    };
    run();
  }, [couponCode]);

  // Fetch FX
  useEffect(() => {
    const fetchPrices = async () => {
      // 'stellar' works; 'stellar-lumens' also fine for CoinGecko. Keeping 'stellar'.
      const idMap = { XLM: 'stellar', XRP: 'ripple', USDC: 'usd-coin' };
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idMap.XLM},${idMap.XRP},${idMap.USDC}&vs_currencies=usd`
        );
        const data = await res.json();
        setPrices({
          xlmUsd: data[idMap.XLM]?.usd ?? null,
          xrpUsd: data[idMap.XRP]?.usd ?? null,
          usdcUsd: data[idMap.USDC]?.usd ?? 1,
        });
      } catch {
        setPrices({ xlmUsd: null, xrpUsd: null, usdcUsd: 1 });
      }
    };
    fetchPrices();
  }, [currency]);

  // Parse USD amount
  const parsedAmount = useMemo(() => {
    const n = parseFloat(String(amountUSD).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [amountUSD]);

  // Fee math (gross → discount → net; min after discount)
  useEffect(() => {
    const gross = parsedAmount * FEE_RATE;
    const rate = couponMeta ? couponMeta.discountRate : 0;
    const discounted = gross * (1 - rate);
    const net = Math.max(discounted, MIN_FEE_USD);

    setFeeGrossUSD(round2(gross));
    setFeeNetUSD(round2(net));
    setFeeDiscountUSD(round2(Math.max(0, gross - net)));
  }, [parsedAmount, couponMeta]);

  // Convert net fee to selected asset
  useEffect(() => {
    if (!prices) return;
    const { xlmUsd, xrpUsd, usdcUsd } = prices;
    let amt = 0;
    if (currency === 'XLM' && xlmUsd) amt = feeNetUSD / xlmUsd;
    if (currency === 'XRP' && xrpUsd) amt = feeNetUSD / xrpUsd;
    if (currency === 'USDC' && usdcUsd) amt = feeNetUSD / usdcUsd;
    const decimals = currency === 'USDC' ? 2 : 4;
    setRequiredAmount(amt > 0 ? amt.toFixed(decimals) : decimals === 2 ? '0.00' : '0.0000');
  }, [feeNetUSD, prices, currency]);

  // Wallets
  const walletDetails = {
    XLM: {
      network: 'Stellar',
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      tag: '1095582935',
    },
    XRP: {
      network: 'XRP Ledger',
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      tag: '1952896539',
    },
    USDC: {
      network: 'Stellar (Coinbase)',
      address: 'GDZHDOITT5W2S35LVJZRLUAUXLU7UEDEAN4R7O4VA5FFGKG7RHC4NPSC',
      tag: '350349871',
    },
  };

  // Validators
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
      const ops = (await opsRes.json())._embedded?.records || [];

      const match = ops.find((op) => {
        const typeOk = ['payment', 'path_payment_strict_send', 'path_payment_strict_receive'].includes(op.type);
        if (!typeOk) return false;
        const toOk = op.to === destination;
        const amtOk = parseFloat(op.amount) >= parseFloat(minAmount);

        if (assetCode) {
          const codeOk = op.asset_code === assetCode;
          const issuerOk = assetIssuer ? op.asset_issuer === assetIssuer : true;
          return toOk && amtOk && codeOk && issuerOk;
        } else {
          return toOk && amtOk && op.asset_type === 'native';
        }
      });

      if (!match) return { success: false, message: 'Payment not found or mismatch.' };
      return { success: true, payer: match.from || tx.source_account || null };
    } catch {
      return { success: false, message: 'Error validating Stellar transaction.' };
    }
  };

  const validateXRPTransaction = async (txid, expectedTag, expectedAmount, destinationAddress) => {
    try {
      const response = await fetch(`https://api.xrpscan.com/api/v1/tx/${txid}`);
      if (!response.ok) return { success: false, message: 'Transaction not found on XRP ledger.' };
      const data = await response.json();

      const toOk = data.Destination === destinationAddress;
      const tagOk = (data.DestinationTag?.toString() || '') === expectedTag.toString();
      const amtOk = parseFloat(data.Amount) / 1_000_000 >= parseFloat(expectedAmount);

      if (!toOk || !tagOk || !amtOk) return { success: false, message: 'Destination/tag/amount mismatch.' };
      return { success: true, payer: data.Account };
    } catch {
      return { success: false, message: 'Error validating XRP transaction.' };
    }
  };

  // Helpers
  const isDuplicateTransaction = async (hash) => {
    const qy = query(collection(db, 'users'), where('paymentHash', '==', hash));
    const s = await getDocs(qy);
    return !s.empty;
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

  // Confirm
  const handleConfirmPayment = async () => {
    const trimmedTx = txHash.trim();
    if (!user || !trimmedTx) return;
    if (!(parsedAmount > 0) || !(feeNetUSD > 0)) {
      setConfirmationMessage('❌ Enter a valid USD transaction amount first.');
      return;
    }

    setLoading(true);
    setConfirmationMessage('');

    if (await isDuplicateTransaction(trimmedTx)) {
      const msg = 'This transaction has already been used.';
      setConfirmationMessage(`❌ ${msg}`);
      await logFailedAttempt(msg);
      setLoading(false);
      return;
    }

    let result = { success: false, message: 'Unsupported currency.' };
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

    const payerAddress = result.payer || null;
    const payoutRate = couponMeta?.payoutRate ?? DEFAULT_PAYOUT;
    const commissionUSD = round2(feeNetUSD * payoutRate);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasPaid: true,
      currency,
      paymentHash: trimmedTx,
      paidAt: new Date(),

      walletAddress: walletDetails[currency].address,
      walletMemo: walletDetails[currency].tag || null,
      buyerWalletAddress: payerAddress,
      buyerWalletCurrency: currency,

      feeGrossUSD: round2(feeGrossUSD),
      feeDiscountUSD: round2(feeDiscountUSD),
      feeNetUSD: round2(feeNetUSD),
      usdValue: round2(feeNetUSD),
      cryptoAmount: requiredAmount,

      coupon: {
        code: (couponCode || '').trim().toUpperCase() || null,
        valid: !!couponMeta,
        resellerId: couponMeta?.resellerId || null,
        resellerName: couponMeta?.resellerName || null,
        payoutRate,
        discountRate: couponMeta?.discountRate ?? 0,
        commissionUSD,
        statusText: couponStatus || null,
        trackedAt: new Date(),
      },
    });

    setConfirmationMessage(
      `✅ Payment confirmed! Fee: $${feeNetUSD.toFixed(2)}${
        couponMeta ? ` • Reseller basis: $${commissionUSD.toFixed(2)}` : ''
      }${payerAddress ? ' • Payer: ' + payerAddress : ''} Redirecting...`
    );
    setTimeout(() => navigate('/submit'), 1500);
    setLoading(false);
  };

  const { network, address, tag } = walletDetails[currency];
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
      : // XLM
        `web+stellar:pay?destination=${address}&amount=${requiredAmount}&memo=${encodeURIComponent(
          tag
        )}`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Make a Payment</h2>
      <p>
        XLMGuard service fee is <strong>{(FEE_RATE * 100).toFixed(2)}%</strong> of your
        transaction amount, with a <strong>${MIN_FEE_USD.toFixed(2)}</strong> minimum.
      </p>

      {/* USD amount */}
      <div style={{ marginTop: 10, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <label style={{ fontWeight: 600 }}>Transaction Amount (USD)</label>
        <br />
        <input
          type="number"
          min="0"
          step="0.01"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
          placeholder="e.g., 200000.00"
          style={{ width: 260, padding: 8, marginTop: 6 }}
        />
        <div style={{ marginTop: 8, lineHeight: 1.6 }}>
          <div><strong>Gross Fee (0.75%):</strong> ${feeGrossUSD.toFixed(2)}</div>
          <div><strong>Discount:</strong> ${feeDiscountUSD.toFixed(2)}</div>
          <div><strong>Net Fee (min $100):</strong> ${feeNetUSD.toFixed(2)}</div>
          {couponCode ? (
            <div style={{ fontSize: 13, color: couponMeta ? 'green' : '#6b7280' }}>
              {couponMeta
                ? `✓ ${couponStatus}${couponMeta.resellerName ? ` (${couponMeta.resellerName})` : ''} — discount ${(couponMeta.discountRate * 100).toFixed(0)}%`
                : couponStatus || 'No discount applied'}
            </div>
          ) : null}
        </div>
      </div>

      {/* Coupon */}
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <label style={{ fontWeight: 600 }}>Coupon Code (optional)</label>
        <br />
        <input
          type="text"
          value={couponCode}
          onChange={(e) => {
            const raw = (e.target.value || '').trim();
            const upper = raw.toUpperCase();
            setCouponCode(upper);
            localStorage.setItem('xlmguard_ref', upper);
          }}
          placeholder="Enter coupon code or use ?ref=CODE"
          style={{ width: 260, padding: 8, marginTop: 6, textTransform: 'uppercase' }}
        />
        {!couponMeta && couponStatus && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>{couponStatus}</div>
        )}
      </div>

      {/* Currency */}
      <div style={{ marginTop: 12 }}>
        <label>Pay Fee With:&nbsp;</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      {/* Payment instructions */}
      <div style={{ marginTop: 10 }}>
        <div><strong>Network:</strong> {network}</div>
        <div><strong>Wallet Address:</strong> <code>{address}</code></div>
        <div><strong>Memo/Tag:</strong> <code>{tag || 'None'}</code></div>
        <div style={{ marginTop: 8 }}>
          <strong>Send:</strong> {requiredAmount} {currencyLabel}{' '}
          <span style={{ color: '#6b7280' }}>(≈ ${feeNetUSD.toFixed(2)} at current rates)</span>
        </div>
      </div>

      {/* QR */}
      <div style={{ marginTop: 20 }}>
        <h4>Scan QR Code to Pay:</h4>
        <QRCodeCanvas value={qrValue} size={200} level="H" includeMargin />
      </div>

      {/* TX hash */}
      <div style={{ marginTop: 20 }}>
        <label>Transaction Hash:</label>
        <br />
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter your transaction hash here"
          style={{ width: 320, padding: 8 }}
        />
      </div>

      {/* Confirm */}
      <button
        onClick={handleConfirmPayment}
        style={{ marginTop: 20, padding: '10px 20px' }}
        disabled={loading || !(parsedAmount > 0) || !(feeNetUSD > 0)}
      >
        {loading ? 'Validating...' : 'Confirm Payment'}
      </button>

      {confirmationMessage && (
        <div style={{ marginTop: 20, color: confirmationMessage.startsWith('✅') ? 'green' : 'red' }}>
          {confirmationMessage}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <button onClick={() => navigate('/')}>Return to Home Page</button>
      </div>
    </div>
  );
}

// utils
function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}



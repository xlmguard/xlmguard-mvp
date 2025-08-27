// SubmissionForm.js  (adds buyer wallet capture + save + consume trial credit + inline destination setup)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from './firebase.js';
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';

const styles = {
  page: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    maxWidth: 700, margin: '0 auto 16px auto'
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  btnRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  primaryBtn: {
    padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8,
    cursor: 'pointer', background: '#fff'
  },
  dangerBtn: {
    padding: '10px 14px', border: '1px solid #c00', borderRadius: 8,
    cursor: 'pointer', background: '#f33', color: '#fff'
  },
  form: {
    display: 'grid', gridTemplateColumns: '1fr', gap: 12,
    maxWidth: 700, margin: '0 auto'
  },
  label: { fontWeight: 600 },
  input: {
    width: '100%', padding: '10px', borderRadius: 8,
    border: '1px solid #ccc', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '10px', borderRadius: 8,
    border: '1px solid #ccc', minHeight: 80, boxSizing: 'border-box', resize: 'vertical'
  },
  radioGroup: { display: 'grid', gridTemplateColumns: '1fr', gap: 8 },
  submitBtn: {
    padding: '12px 16px', border: 'none', borderRadius: 10,
    cursor: 'pointer', background: '#0b74ff', color: '#fff', fontWeight: 700
  },
  message: { maxWidth: 700, margin: '12px auto 0 auto' },
  bottomRow: { display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 700, margin: '24px auto 0 auto' },
  setupBox: {
    maxWidth: 700, margin: '0 auto 16px auto', padding: 16,
    border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 10
  },
  setupTitle: { marginTop: 0, marginBottom: 8, fontWeight: 800, color: '#92400e' },
  help: { color: '#6b7280', fontSize: 13 },
};

// ----- Helpers -----

const XLM_BUFFER = 1.0;

const isValidWallet = (addr, cur) => {
  if (!addr) return false;
  if (cur === 'XLM' || cur === 'USDC') return /^G[A-Z2-7]{55}$/.test(addr.trim()); // Stellar pubkey
  if (cur === 'XRP') return /^r[1-9A-HJ-NP-Za-km-z]{25,35}$/.test(addr.trim());   // XRP classic address
  return false;
};

async function fetchXlmNativeBalance(accountId) {
  const url = `https://horizon.stellar.org/accounts/${accountId}`;
  const { data } = await axios.get(url);
  const balances = data?.balances || [];
  const native = balances.find(b => b.asset_type === 'native');
  return native ? parseFloat(native.balance) : 0;
}

async function hasSufficientBalance({ currency, walletAddress, amountNumber }) {
  // NOTE: left as-is (checks receiver address). You can disable this if not needed.
  if (currency !== 'XLM') return { ok: true, reason: '' };
  try {
    const bal = await fetchXlmNativeBalance(walletAddress);
    const needed = amountNumber + XLM_BUFFER;
    if (isNaN(bal)) return { ok: false, reason: 'Could not read XLM balance from Horizon.' };
    if (bal >= needed) return { ok: true, reason: '' };
    return { ok: false, reason: `Insufficient XLM: balance ${bal.toFixed(4)} < required ${needed.toFixed(4)}.` };
  } catch (e) {
    console.error('Balance check failed:', e);
    return { ok: false, reason: 'Failed to query Horizon for XLM balance.' };
  }
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const SubmissionForm = () => {
  const [currency, setCurrency] = useState('XLM');
  const [submissionMode, setSubmissionMode] = useState('auto');
  const [txId, setTxId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null);

  // buyer wallet fields
  const [buyerWalletAddress, setBuyerWalletAddress] = useState('');
  const [buyerMemoTag, setBuyerMemoTag] = useState('');

  // NEW: destination setup fields (your receiving address/memo)
  const [needDestination, setNeedDestination] = useState(false);
  const [destAddress, setDestAddress] = useState('');
  const [destMemo, setDestMemo] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          if (snap.exists()) {
            const d = snap.data();
            if (d.currency) setCurrency(d.currency);
            if (d.buyerWalletAddress && !buyerWalletAddress) setBuyerWalletAddress(d.buyerWalletAddress);
            if (d.buyerMemoTag && !buyerMemoTag) setBuyerMemoTag(d.buyerMemoTag);

            // If destination missing (common on Free Pilot), show setup box
            if (!d.walletAddress) {
              setNeedDestination(true);
              // prefill memo with a unique token so you can match deposits easily
              setDestMemo(d.walletMemo || `PILOT-${currentUser.uid.substring(0,8)}`);
            } else {
              setDestAddress(d.walletAddress);
              setDestMemo(d.walletMemo || '');
            }
          } else {
            setNeedDestination(true);
            setDestMemo(`PILOT-${currentUser.uid.substring(0,8)}`);
          }
        } catch (e) {
          console.warn('Prefill failed:', e);
        }
      } else {
        setUser(null);
        setMessage('User not authenticated. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    });
    return () => unsubscribe();
  }, [navigate]); // eslint-disable-line

  const handleFileChange = (e) => setContractFile(e.target.files[0]);

  const saveDestination = async () => {
    if (!user) return;
    const addr = destAddress.trim();
    const memo = destMemo.trim();

    if (!addr) {
      setMessage('Please enter your destination (receiving) wallet address.');
      return;
    }
    // validate by current currency choice for now (most pilots use XLM/USDC on Stellar)
    if (!isValidWallet(addr, currency)) {
      setMessage(`Destination address doesn’t look like a valid ${currency} address.`);
      return;
    }
    if (!memo) {
      setMessage('Please provide a Memo/Tag for matching transactions.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), { walletAddress: addr, walletMemo: memo });
      setNeedDestination(false);
      setMessage('Destination saved. You can submit your transaction now.');
    } catch (e) {
      console.error('Failed to save destination:', e);
      setMessage('Failed to save destination wallet. Please try again.');
    }
  };

  // Detect a matching tx on YOUR receiving Stellar address by memo
  const fetchRealTxHash = async (walletAddress, walletMemo) => {
    try {
      const response = await axios.get(
        `https://api.stellar.expert/explorer/public/account/${walletAddress}/transactions?limit=40&order=desc`
      );
      const records = response.data?._embedded?.records || [];
      const match = records.find((tx) => tx.memo === walletMemo);
      return match ? match.hash : null;
    } catch (err) {
      console.error('Error fetching Stellar TX:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage('User not authenticated.');

    if (needDestination) {
      setMessage('Please enter and save your destination wallet first.');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return setMessage('Please enter a valid Amount.');
    }
    if (submissionMode === 'manual' && txId.trim() === '') {
      return setMessage('Please enter a TXID.');
    }

    // Validate buyer wallet if provided (optional fallback to what Payment page captured)
    let buyerAddr = buyerWalletAddress?.trim() || '';
    let buyerTag = buyerMemoTag?.trim() || '';

    // Pull receiver wallet from local state (now guaranteed)
    const receiverAddress = destAddress;
    const receiverMemo = destMemo;

    if (!receiverAddress) {
      return setMessage('No destination wallet found on your profile. Please set it above.');
    }

    // If Payment page already captured buyer address and user didn’t type one, use it
    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      if (!buyerAddr && userData.buyerWalletAddress) buyerAddr = userData.buyerWalletAddress;
      if (!buyerTag && userData.buyerMemoTag) buyerTag = userData.buyerMemoTag;
    } catch {}

    if (buyerAddr && !isValidWallet(buyerAddr, currency)) {
      return setMessage(`Please enter a valid ${currency} wallet address.`);
    }

    try {
      setChecking(true);

      // Optional receiver-balance check
      const pre = await hasSufficientBalance({ currency, walletAddress: receiverAddress, amountNumber });
      if (!pre.ok) {
        setChecking(false);
        return setMessage(`Cannot submit: ${pre.reason}`);
      }

      // Upload contract file (optional)
      let contractURL = '';
      if (contractFile) {
        const safeName = contractFile.name.replace(/\s+/g, '_');
        const storageRef = ref(storage, `contracts/${user.uid}_${Date.now()}_${safeName}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      // Determine TXID
      let finalTxId = txId.trim();
      let validated = false;

      if (submissionMode === 'auto' && (currency === 'XLM' || currency === 'USDC')) {
        const realTxHash = await fetchRealTxHash(receiverAddress, receiverMemo);
        if (realTxHash) {
          finalTxId = realTxHash;
          validated = true;
        } else {
          finalTxId = `auto_${user.uid}_${Date.now()}`;
        }
      }

      // Save transaction
      const txRef = await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        amount,
        notes,
        contractURL,
        transactionId: finalTxId,
        txValidated: validated,
        // receiver (your) wallet
        walletAddress: receiverAddress,
        walletMemo: receiverMemo,
        // buyer wallet (from Payment page auto-capture or from this form)
        buyerWalletAddress: buyerAddr || null,
        buyerMemoTag: buyerTag || null,
        buyerWalletCurrency: currency,
        createdAt: Timestamp.now()
      });

      // Persist buyer wallet on the user doc if newly provided
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const updates = {};
          if (buyerAddr && buyerAddr !== data.buyerWalletAddress) updates.buyerWalletAddress = buyerAddr;
          if (buyerTag && buyerTag !== data.buyerMemoTag) updates.buyerMemoTag = buyerTag;
          if (Object.keys(updates).length) await updateDoc(userRef, updates);
        }
      } catch (e) {
        console.warn('Optional buyer wallet persist failed:', e);
      }

      // Consume one trial credit if available
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const credits = data.trialCredits ?? 0;
          if (credits > 0) {
            await updateDoc(userRef, { trialCredits: increment(-1) });
          }
        }
      } catch (creditErr) {
        console.warn('Failed to decrement trialCredits (non-fatal):', creditErr);
      }

      setMessage(`Transaction submitted ${validated ? 'and verified' : '(awaiting chain match)'}.`);
      setChecking(false);

      // Lightweight poll to upgrade to verified (XLM/USDC)
      if (!validated && submissionMode === 'auto' && (currency === 'XLM' || currency === 'USDC') && receiverAddress && receiverMemo) {
        for (let i = 0; i < 10; i++) {
          await sleep(7000);
          const real = await fetchRealTxHash(receiverAddress, receiverMemo);
        if (real) {
            await updateDoc(txRef, { transactionId: real, txValidated: true, verifiedAt: Timestamp.now() });
            setMessage('Transaction submitted and verified.');
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setChecking(false);
      setMessage('Failed to submit transaction.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const addressPlaceholder = currency === 'XRP' ? 'r...' : 'G...';
  const memoHint =
    currency === 'XRP'
      ? 'Destination Tag (required for many exchanges)'
      : 'Memo (we’ll use this to match your payment)';

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <h2 style={styles.title}>Submit Transaction</h2>
        <div style={styles.btnRow}>
          <button onClick={() => navigate('/')} style={styles.primaryBtn}>
            Return to Home Page
          </button>
          <button onClick={handleLogout} style={styles.dangerBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Inline Destination Setup (only when missing) */}
      {needDestination && (
        <div style={styles.setupBox}>
          <h3 style={styles.setupTitle}>Set Your Destination Wallet (for this transaction)</h3>
          <p className="help" style={styles.help}>
            This is the <b>receiving wallet</b> that XLMGuard monitors for your payment. Add your business
            address and a memo/tag so we can automatically match your transfer.
          </p>
          <div style={{display:'grid', gap:10}}>
            <label style={styles.label} htmlFor="destAddr">Destination Wallet Address</label>
            <input
              id="destAddr"
              type="text"
              value={destAddress}
              onChange={(e) => setDestAddress(e.target.value)}
              style={styles.input}
              placeholder={addressPlaceholder}
            />
            <label style={styles.label} htmlFor="destMemo">Memo / Destination Tag</label>
            <input
              id="destMemo"
              type="text"
              value={destMemo}
              onChange={(e) => setDestMemo(e.target.value)}
              style={styles.input}
              placeholder={memoHint}
            />
            <div>
              <button onClick={saveDestination} type="button" className="btn" style={styles.submitBtn}>
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label} htmlFor="currency">Currency</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={styles.input}
        >
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
          <option value="USDC">USDC</option>
        </select>

        {/* Buyer wallet fields (optional if auto-captured) */}
        <label style={styles.label} htmlFor="buyerWallet">Your Wallet Address (the one you paid from)</label>
        <input
          id="buyerWallet"
          type="text"
          value={buyerWalletAddress}
          onChange={(e) => setBuyerWalletAddress(e.target.value)}
          style={styles.input}
          placeholder={addressPlaceholder}
        />
        <label style={styles.label} htmlFor="buyerMemo">Your Memo/Tag (optional)</label>
        <input
          id="buyerMemo"
          type="text"
          value={buyerMemoTag}
          onChange={(e) => setBuyerMemoTag(e.target.value)}
          style={styles.input}
          placeholder={memoHint}
        />

        <label style={styles.label}>Transaction Type</label>
        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="auto"
              checked={submissionMode === 'auto'}
              onChange={() => setSubmissionMode('auto')}
            />{' '}
            Auto: Detect from Lobstr/Vault or Explorer (XLM/USDC on Stellar)
          </label>
          <label>
            <input
              type="radio"
              value="manual"
              checked={submissionMode === 'manual'}
              onChange={() => setSubmissionMode('manual')}
            />{' '}
            Manual: Enter your TXID
          </label>
        </div>

        {submissionMode === 'manual' && (
          <>
            <label style={styles.label} htmlFor="txid">Transaction ID</label>
            <input
              id="txid"
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              style={styles.input}
              placeholder="Enter your TXID"
            />
          </>
        )}

        <label style={styles.label} htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          required
          placeholder="Amount paid"
        />

        <label style={styles.label} htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
          placeholder="Optional notes"
        />

        <label style={styles.label} htmlFor="contractFile">
          Upload Contract (PDF/DOC/TXT)
        </label>
        <input
          id="contractFile"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          style={styles.input}
        />

        <button type="submit" style={styles.submitBtn} disabled={checking}>
          {checking ? 'Checking…' : 'Submit'}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.bottomRow}>
        <button onClick={() => navigate('/')} style={styles.primaryBtn}>
          Return to Home Page
        </button>
        <button onClick={handleLogout} style={styles.dangerBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SubmissionForm;


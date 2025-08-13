// SubmissionForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from './firebase.js';
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc
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
  bottomRow: { display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 700, margin: '24px auto 0 auto' }
};

// ----- Helpers -----

// Conservative buffer to cover fees/reserve wiggle room
const XLM_BUFFER = 1.0; // XLM

async function fetchXlmNativeBalance(accountId) {
  // Horizon public network
  const url = `https://horizon.stellar.org/accounts/${accountId}`;
  const { data } = await axios.get(url);
  const balances = data?.balances || [];
  const native = balances.find(b => b.asset_type === 'native');
  return native ? parseFloat(native.balance) : 0;
}

async function hasSufficientBalance({ currency, walletAddress, amountNumber }) {
  if (currency !== 'XLM') {
    // TODO: Add XRP/USDC checks if/when needed
    return { ok: true, reason: '' };
  }
  try {
    const bal = await fetchXlmNativeBalance(walletAddress);
    const needed = amountNumber + XLM_BUFFER;
    if (isNaN(bal)) return { ok: false, reason: 'Could not read XLM balance from Horizon.' };
    if (bal >= needed) return { ok: true, reason: '' };
    return {
      ok: false,
      reason: `Insufficient XLM: balance ${bal.toFixed(4)} < required ${needed.toFixed(4)} (amount + buffer).`
    };
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
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setMessage('User not authenticated. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e) => {
    setContractFile(e.target.files[0]);
  };

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

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return setMessage('Please enter a valid Amount.');
    }
    if (submissionMode === 'manual' && txId.trim() === '') {
      return setMessage('Please enter a TXID.');
    }

    try {
      setChecking(true);

      // Pull wallet info from user doc
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const walletAddress = userData.walletAddress || '';
      const walletMemo = userData.walletMemo || '';

      if (!walletAddress) {
        setChecking(false);
        return setMessage('No walletAddress found on your profile.');
      }

      // -------- Pre-check funding (XLM) --------
      const pre = await hasSufficientBalance({ currency, walletAddress, amountNumber });
      if (!pre.ok) {
        setChecking(false);
        return setMessage(`Cannot submit: ${pre.reason}`);
      }

      // -------- Upload contract file (optional) --------
      let contractURL = '';
      if (contractFile) {
        const safeName = contractFile.name.replace(/\s+/g, '_');
        const storageRef = ref(storage, `contracts/${user.uid}_${Date.now()}_${safeName}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      // -------- Determine TXID --------
      let finalTxId = txId.trim();
      let validated = false;

      if (submissionMode === 'auto') {
        const realTxHash = await fetchRealTxHash(walletAddress, walletMemo);
        if (realTxHash) {
          finalTxId = realTxHash;
          validated = true;
        } else {
          finalTxId = `auto_${user.uid}_${Date.now()}`;
        }
      }

      // -------- Save transaction --------
      const docRef = await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        amount,
        notes,
        contractURL,
        transactionId: finalTxId,
        txValidated: validated,
        walletAddress,
        walletMemo,
        createdAt: Timestamp.now()
      });

      setMessage(`Transaction submitted ${validated ? 'and verified' : '(awaiting chain match)'}.`);
      setChecking(false);

      // Optional: lightweight poll to upgrade to verified
      if (!validated && submissionMode === 'auto' && walletAddress && walletMemo) {
        for (let i = 0; i < 10; i++) {
          await sleep(7000);
          const real = await fetchRealTxHash(walletAddress, walletMemo);
          if (real) {
            await updateDoc(docRef, { transactionId: real, txValidated: true, verifiedAt: Timestamp.now() });
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

  return (
    <div style={styles.page}>
      {/* Top bar with Return to Home Page */}
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

        <label style={styles.label}>Transaction Type</label>
        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="auto"
              checked={submissionMode === 'auto'}
              onChange={() => setSubmissionMode('auto')}
            />{' '}
            Auto: Detect from Lobstr/Vault or Explorer
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

        {/* Amount — everything else is under this */}
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
          {checking ? 'Checking balance…' : 'Submit'}
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


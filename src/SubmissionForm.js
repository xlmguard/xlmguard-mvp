// SubmissionForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from './firebase.js';
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';

const styles = {
  page: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 700,
    margin: '0 auto 16px auto'
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  btnRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  primaryBtn: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#fff'
  },
  dangerBtn: {
    padding: '10px 14px',
    border: '1px solid #c00',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#f33',
    color: '#fff'
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr', // force single column
    gap: 12,
    maxWidth: 700,
    margin: '0 auto'
  },
  label: { fontWeight: 600 },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: 8,
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: 8,
    border: '1px solid #ccc',
    minHeight: 80,
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  radioGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 8
  },
  submitBtn: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    background: '#0b74ff',
    color: '#fff',
    fontWeight: 700
  },
  message: { maxWidth: 700, margin: '12px auto 0 auto' },
  bottomRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    maxWidth: 700,
    margin: '24px auto 0 auto'
  }
};

const SubmissionForm = () => {
  const [currency, setCurrency] = useState('XLM');
  const [submissionMode, setSubmissionMode] = useState('auto');
  const [txId, setTxId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [message, setMessage] = useState('');
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
        `https://api.stellar.expert/explorer/public/account/${walletAddress}/transactions?limit=20`
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

    if (submissionMode === 'manual' && txId.trim() === '') {
      return setMessage('Please enter a TXID.');
    }

    try {
      // Get wallet info
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const walletAddress = userData.walletAddress || '';
      const walletMemo = userData.walletMemo || '';

      // Upload contract file
      let contractURL = '';
      if (contractFile) {
        const safeName = contractFile.name.replace(/\s+/g, '_');
        const storageRef = ref(
          storage,
          `contracts/${user.uid}_${Date.now()}_${safeName}`
        );
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

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

      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        amount,
        notes,
        contractURL,
        transactionId: finalTxId,
        txValidated: validated,
        createdAt: Timestamp.now()
      });

      setMessage(
        `Transaction submitted ${validated ? 'and verified' : '(awaiting chain match)'}.`
      );
      // Keep user on page so they can use Return to Home Page explicitly
      // setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting transaction:', error);
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
      {/* Top bar with Return to Home Page restored */}
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
        {/* Currency */}
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

        {/* Transaction Type */}
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

        {/* Transaction ID (manual only) */}
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

        {/* Amount — everything else is *under* this */}
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

        {/* Notes */}
        <label style={styles.label} htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
          placeholder="Optional notes"
        />

        {/* Contract upload */}
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

        <button type="submit" style={styles.submitBtn}>Submit</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      {/* Bottom buttons — Return to Home Page restored here too */}
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

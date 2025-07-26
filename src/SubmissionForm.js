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

const SubmissionForm = () => {
  const [currency, setCurrency] = useState('XLM');
  const [submissionMode, setSubmissionMode] = useState('auto');
  const [txId, setTxId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [message, setMessage] = useState('');
  const [escrowTxId, setEscrowTxId] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setMessage('User not authenticated. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e) => {
    setContractFile(e.target.files[0]);
  };

  const fetchLatestStellarTxID = async (walletAddress) => {
    try {
      const res = await fetch(`https://api.steexp.com/account/${walletAddress}/operations?limit=1`);
      const data = await res.json();
      return data._embedded?.records?.[0]?.transaction_hash || '';
    } catch (err) {
      console.error('Failed to fetch TXID from Stellar Expert:', err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage('User not authenticated.');

    if (submissionMode === 'manual' && txId.trim() === '') {
      return setMessage('Please enter a TXID.');
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const walletAddress = userDoc.exists() ? userDoc.data().walletAddress : null;
      const walletMemo = userDoc.exists() ? userDoc.data().walletMemo : null;

      if (!walletAddress && submissionMode === 'auto') {
        return setMessage('Wallet address not found in user profile.');
      }

      let contractURL = '';
      if (contractFile) {
        const storageRef = ref(storage, `contracts/${user.uid}_${Date.now()}_${contractFile.name}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      const newTxId = submissionMode === 'manual'
        ? txId
        : `auto_${user.uid}_${Date.now()}`;

      // Step 1: Add Firestore transaction entry
      const txDocRef = await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        transactionId: newTxId,
        amount,
        notes,
        contractURL,
        createdAt: Timestamp.now(),
        walletAddress,
        walletMemo,
      });

      // Step 2: Fetch real escrow TXID from Stellar
      const realTxId = submissionMode === 'auto' ? await fetchLatestStellarTxID(walletAddress) : txId;

      if (realTxId) {
        await updateDoc(txDocRef, { escrowTxId: realTxId });
        setEscrowTxId(realTxId);
      }

      setMessage('Transaction submitted successfully.');
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Failed to submit transaction.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>Currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
        </select>

        <div style={{ marginTop: '10px' }}>
          <label>
            <input type="radio" value="auto" checked={submissionMode === 'auto'} onChange={() => setSubmissionMode('auto')} />
            Lobstr/Vault (Auto-generate TXID)
          </label>
          <br />
          <label>
            <input type="radio" value="manual" checked={submissionMode === 'manual'} onChange={() => setSubmissionMode('manual')} />
            Manually enter TXID
          </label>
        </div>

        {submissionMode === 'manual' && (
          <>
            <label>Transaction ID:</label>
            <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} />
          </>
        )}

        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

        <label>Upload Contract:</label>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      {escrowTxId && (
        <div style={{ marginTop: '20px', padding: '12px', border: '1px solid #ccc' }}>
          <h4>Escrow TXID from Stellar:</h4>
          <code style={{ wordWrap: 'break-word' }}>{escrowTxId}</code>
          <p><strong>Copy and paste this TXID and send it to the Seller for order confirmation.</strong></p>
          <p>This TXID is also available under the <strong>Escrow</strong> menu in Transaction Lookup.</p>
        </div>
      )}

      <hr />
      <button onClick={() => navigate('/')}>Return to Home Page</button>
      <br />
      <button onClick={handleLogout} style={{ marginTop: '10px', backgroundColor: '#f00', color: '#fff' }}>
        Logout
      </button>
    </div>
  );
};

export default SubmissionForm;

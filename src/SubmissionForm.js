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
  const [user, setUser] = useState(null);
  const [showTxBlock, setShowTxBlock] = useState(false);
  const [realTxId, setRealTxId] = useState(null);
  const [loadingTxId, setLoadingTxId] = useState(false);
  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    setContractFile(e.target.files[0]);
  };

  const fetchRecentTxId = async (walletAddress) => {
    try {
      const res = await fetch(`https://api.steexp.com/account/${walletAddress}/payments?limit=1`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].hash) {
        return data[0].hash;
      }
    } catch (err) {
      console.error('Error fetching TXID:', err);
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!user) {
      setMessage('User not authenticated.');
      return;
    }

    if (submissionMode === 'manual' && txId.trim() === '') {
      setMessage('Please enter a TXID.');
      return;
    }

    try {
      let contractURL = '';
      if (contractFile) {
        const storageRef = ref(storage, `contracts/${user.uid}_${Date.now()}_${contractFile.name}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      const newTxId = submissionMode === 'auto' ? `auto_${user.uid}_${Date.now()}` : txId;

      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        transactionId: newTxId,
        amount,
        notes,
        contractURL,
        createdAt: Timestamp.now()
      });

      setMessage('Transaction submitted successfully.');

      if (submissionMode === 'auto') {
        setLoadingTxId(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const walletAddress = userSnap.exists() ? userSnap.data().walletAddress : null;

        if (walletAddress) {
          const realTx = await fetchRecentTxId(walletAddress);
          setRealTxId(realTx);
          setShowTxBlock(true);
          await updateDoc(userRef, { escrowTxId: realTx });
        } else {
          setMessage('⚠️ Wallet address not found in user profile.');
        }

        setLoadingTxId(false);
      }
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setMessage('❌ Submission failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const copyToClipboard = () => {
    if (realTxId) {
      navigator.clipboard.writeText(realTxId);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>

      <div>
        <label>Currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>
          <input type="radio" value="auto" checked={submissionMode === 'auto'} onChange={() => setSubmissionMode('auto')} />
          Lobstr/Vault (Auto TXID)
        </label>
        <br />
        <label>
          <input type="radio" value="manual" checked={submissionMode === 'manual'} onChange={() => setSubmissionMode('manual')} />
          Manual Entry
        </label>
      </div>

      {submissionMode === 'manual' && (
        <div>
          <label>Transaction ID:</label>
          <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} />
        </div>
      )}

      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div>
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div>
        <label>Upload Contract (PDF, DOCX, etc.):</label>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit Transaction</button>

      {message && <p>{message}</p>}
      {loadingTxId && <p>🔄 Fetching escrow TXID from Stellar...</p>}

      {showTxBlock && realTxId && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid gray' }}>
          <h4>Escrow TXID</h4>
          <p>{realTxId}</p>
          <button onClick={copyToClipboard}>📋 Copy to Clipboard</button>
          <p>This TXID will also appear on the Escrow Lookup page.</p>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Return to Homepage</button>
      <hr />
      <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
    </div>
  );
};

export default SubmissionForm;










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
        setTimeout(() => navigate('/login'), 2000);
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
      const records = response.data._embedded.records;
      const match = records.find(
        (tx) => tx.memo === walletMemo
      );
      return match ? match.hash : null;
    } catch (err) {
      console.error("Error fetching Stellar TX:", err);
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
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const { walletAddress, walletMemo } = userDoc.data();

      // Upload contract file
      let contractURL = '';
      if (contractFile) {
        const storageRef = ref(storage, `contracts/${user.uid}_${Date.now()}_${contractFile.name}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      let finalTxId = txId;
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

      setMessage(`Transaction submitted ${validated ? 'and verified' : '(awaiting chain match)'}.`);
      setTimeout(() => navigate('/'), 2000);
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Submit Transaction</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <label style={{ marginTop: '10px' }}>Currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="XLM">XLM</option>
          <option value="XRP">XRP</option>
          <option value="USDC">USDC</option>
        </select>

        <label style={{ marginTop: '10px' }}>Transaction Type:</label>
        <label>
          <input
            type="radio"
            value="auto"
            checked={submissionMode === 'auto'}
            onChange={() => setSubmissionMode('auto')}
          /> Auto: Detect from Lobstr/Vault or Explorer
        </label>
        <label>
          <input
            type="radio"
            value="manual"
            checked={submissionMode === 'manual'}
            onChange={() => setSubmissionMode('manual')}
          /> Manual: Enter your TXID
        </label>

        {submissionMode === 'manual' && (
          <>
            <label style={{ marginTop: '10px' }}>Transaction ID:</label>
            <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} />
          </>
        )}

        <label style={{ marginTop: '10px' }}>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <label style={{ marginTop: '10px' }}>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ height: '60px' }} />

        <label style={{ marginTop: '10px' }}>Upload Contract (PDF/DOC):</label>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

        <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => navigate('/')} style={{ marginRight: '10px' }}>
          Return to Home Page
        </button>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#f00', color: '#fff' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SubmissionForm;



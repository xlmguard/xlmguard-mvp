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
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setMessage('User not authenticated.');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e) => {
    setContractFile(e.target.files[0]);
  };

  const fetchLatestTxIdFromStellar = async (walletAddress) => {
    try {
      const res = await fetch(
        `https://api.steexp.com/account/${walletAddress}/operations?limit=1`
      );
      const data = await res.json();
      return data._embedded?.records?.[0]?.transaction_hash || '';
    } catch (err) {
      console.error('Failed to fetch TXID from Stellar:', err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('User not authenticated.');
      return;
    }

    if (submissionMode === 'manual' && txId.trim() === '') {
      setMessage('Please enter a TXID.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const walletAddress = userDoc.exists() ? userDoc.data().walletAddress : '';
      const walletMemo = userDoc.exists() ? userDoc.data().walletMemo : '';

      if (submissionMode === 'auto' && !walletAddress) {
        throw new Error('Wallet address not found for TXID lookup.');
      }

      let contractURL = '';
      if (contractFile) {
        const storageRef = ref(
          storage,
          `contracts/${user.uid}_${Date.now()}_${contractFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      const internalTxId =
        submissionMode === 'manual' ? txId : `auto_${user.uid}_${Date.now()}`;

      const txRef = await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        transactionId: internalTxId,
        amount,
        notes,
        contractURL,
        createdAt: Timestamp.now(),
        walletAddress,
        walletMemo,
      });

      let finalTxId = internalTxId;

      if (submissionMode === 'auto') {
        const fetchedTxId = await fetchLatestTxIdFromStellar(walletAddress);
        if (fetchedTxId) {
          await updateDoc(txRef, { escrowTxId: fetchedTxId });
          finalTxId = fetchedTxId;
        }
      }

      setEscrowTxId(finalTxId);
      setShowResult(true);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (escrowTxId) {
      navigator.clipboard.writeText(escrowTxId);
      alert('TXID copied to clipboard!');
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
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>

      {!showResult ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Currency:</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="XLM">XLM</option>
              <option value="XRP">XRP</option>
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>
              <input
                type="radio"
                value="auto"
                checked={submissionMode === 'auto'}
                onChange={() => setSubmissionMode('auto')}
              />
              Lobstr/Vault (Auto-generate TXID)
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="manual"
                checked={submissionMode === 'manual'}
                onChange={() => setSubmissionMode('manual')}
              />
              Manually enter TXID
            </label>
          </div>

          {submissionMode === 'manual' && (
            <div>
              <label>Transaction ID:</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Notes:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div>
            <label>Upload Contract:</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button type="submit">Submit</button>
          {isLoading && <p>⏳ Submitting and retrieving TXID...</p>}
        </form>
      ) : (
        <div>
          <h3>✅ Transaction Submitted</h3>
          <p><strong>Escrow TXID:</strong> {escrowTxId}</p>
          <button onClick={handleCopy}>Copy to Clipboard</button>
          <p style={{ marginTop: '10px' }}>
            Copy and paste this TXID and send it to the Seller for order confirmation.
            A copy of this Escrow TXID is available under the Escrow menu on transaction lookup.
          </p>
          <button onClick={() => navigate('/')}>Return to Home Page</button>
        </div>
      )}

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <hr />
      <button
        onClick={handleLogout}
        style={{ marginTop: '20px', backgroundColor: '#f00', color: '#fff' }}
      >
        Logout
      </button>
    </div>
  );
};

export default SubmissionForm;




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

  const fetchRecentTxId = async (walletAddress) => {
    try {
      const res = await fetch(
        `https://api.steexp.com/account/${walletAddress}/payments?limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].hash) {
        return data[0].hash;
      }
    } catch (err) {
      console.error('Error fetching TXID:', err);
    }
    return null;
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
      let contractURL = '';
      if (contractFile) {
        const storageRef = ref(
          storage,
          `contracts/${user.uid}_${Date.now()}_${contractFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, contractFile);
        contractURL = await getDownloadURL(snapshot.ref);
      }

      const newTxId = submissionMode === 'auto'
        ? `auto_${user.uid}_${Date.now()}`
        : txId;

      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        transactionId: newTxId,
        amount,
        notes,
        contractURL,
        createdAt: Timestamp.now(),
      });

      setMessage('Transaction submitted successfully.');

      if (submissionMode === 'auto') {
        setLoadingTxId(true);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          const walletAddress = userSnap.exists() ? userSnap.data().walletAddress : null;

          if (walletAddress) {
            const realTx = await fetchRecentTxId(walletAddress);
            setRealTxId(realTx);
            setShowTxBlock(true);

            // ✅ Store it in Firestore
            if (realTx) {
              await updateDoc(userRef, { escrowTxId: realTx });
            }
          } else {
            setMessage('⚠️ Wallet address not found in user profile.');
          }
        } catch (err) {
          console.error('Error retrieving wallet address or storing TXID:', err);
          setMessage('⚠️ Could not retrieve wallet address or store TXID.');
        }
        setLoadingTxId(false);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setMessage('Failed to submit transaction. Please try again.');
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

  const copyToClipboard = () => {
    if (realTxId) {
      navigator.clipboard.writeText(realTxId);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Transaction</h2>

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
            /> Lobstr/Vault (Auto-generate TXID)
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="manual"
              checked={submissionMode === 'manual'}
              onChange={() => setSubmissionMode('manual')}
            /> Manually enter TXID
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
          <label>Upload Contract (PDF, DOCX, etc.):</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      {loadingTxId && <p>Fetching TXID from Stellar... ⏳</p>}

      {showTxBlock && realTxId && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h4>Escrow TXID</h4>
          <p>{realTxId}</p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
          <p>Copy and Paste this TXID and send it to the Seller for order confirmation.</p>
          <p>A copy of this Escrow TXID is available under the Escrow menu on transaction lookup.</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')}>Return to Home Page</button>
      </div>

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







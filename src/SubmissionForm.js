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
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [showResult, setShowResult] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(escrowTxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage('User not authenticated.');

    if (submissionMode === 'manual' && txId.trim() === '') {
      return setMessage('Please enter a TXID.');
    }

    try {
      setIsLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const walletAddress = userDoc.exists() ? userDoc.data().walletAddress : null;
      const walletMemo = userDoc.exists() ? userDoc.data().walletMemo : null;

      if (!walletAddress && submissionMode === 'auto') {
        setIsLoading(false);
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

      const realTxId = submissionMode === 'auto' ? await fetchLatestStellarTxID(walletAddress) : txId;

      if (realTxId) {
        await updateDoc(txDocRef, { escrowTxId: realTxId });
        setEscrowTxId(realTxId);
      }

      setShowResult(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Failed to submit transaction.');
      setIsLoading(false);
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
      {!showResult ? (
        <>
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

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          {message && <p>{message}</p>}
        </>
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
          <h3>Transaction Submitted!</h3>
          {isLoading ? (
            <p>⏳ Fetching escrow TXID...</p>
          ) : escrowTxId ? (
            <>
              <p><strong>Escrow TXID:</strong></p>
              <code style={{ wordBreak: 'break-word', display: 'block', margin: '10px 0' }}>{escrowTxId}</code>
              <button onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <p style={{ marginTop: '10px' }}>
                <strong>Copy and paste this TXID and send it to the Seller for order confirmation.</strong>
              </p>
              <p>This TXID is also available under the <strong>Escrow</strong> menu in Transaction Lookup.</p>
              <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                Return to Home Page
              </button>
            </>
          ) : (
            <p>⚠️ No TXID retrieved. Please check back in the Escrow menu.</p>
          )}
        </div>
      )}

      <hr />
      <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#f00', color: '#fff' }}>
        Logout
      </button>
    </div>
  );
};

export default SubmissionForm;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from './firebase.js';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
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
  const [escrowTxid, setEscrowTxid] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

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

      const txIdentifier = submissionMode === 'auto'
        ? `auto_${user.uid}_${Date.now()}`
        : txId;

      const txRef = await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        currency,
        transactionId: txIdentifier,
        amount,
        notes,
        contractURL,
        createdAt: Timestamp.now(),
      });

      setMessage('Transaction submitted successfully. Fetching escrow TXID...');
      setIsFetching(true);

      // Fetch wallet address from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const walletAddress = userDoc.exists() ? userDoc.data().walletAddress : null;

      if (!walletAddress) {
        setMessage('Wallet address not found. Please ensure your profile includes your Stellar address.');
        setIsFetching(false);
        return;
      }

      // Query Stellar Expert API for latest TX
      const response = await fetch(`https://api.stellar.expert/explorer/public/account/${walletAddress}/transactions?limit=1`);
      const data = await response.json();
      const realTxid = data._embedded?.records?.[0]?.hash || null;

      setEscrowTxid(realTxid);
      setIsFetching(false);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Submission failed. Try again.');
      setIsFetching(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleCopy = () => {
    if (escrowTxid) {
      navigator.clipboard.writeText(escrowTxid);
      alert('TXID copied to clipboard!');
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
            <input type="radio" value="auto" checked={submissionMode === 'auto'} onChange={() => setSubmissionMode('auto')} /> Lobstr/Vault (Auto-generate TXID)
          </label><br />
          <label>
            <input type="radio" value="manual" checked={submissionMode === 'manual'} onChange={() => setSubmissionMode('manual')} /> Manually enter TXID
          </label>
        </div>

        {submissionMode === 'manual' && (
          <div>
            <label>TXID:</label>
            <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} required />
          </div>
        )}

        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div>
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div>
          <label>Upload Contract (PDF, DOCX):</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
      {isFetching && <p>🔄 Looking up real TXID...</p>}

      {escrowTxid && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Escrow TXID:</strong></p>
          <p style={{ fontFamily: 'monospace' }}>{escrowTxid}</p>
          <p>📋 Copy and paste this TXID and send it to the Seller for order confirmation.<br />
          A copy is available under the Escrow menu (Transaction Lookup).</p>
          <button onClick={handleCopy}>Copy to Clipboard</button>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => navigate('/')}>Return to Main Menu</button>
          </div>
        </div>
      )}

      <hr />
      <button onClick={handleLogout} style={{ backgroundColor: '#f00', color: '#fff', marginTop: '20px' }}>Logout</button>
    </div>
  );
};

export default SubmissionForm;





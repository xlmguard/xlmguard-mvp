// TransactionLookup.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore';

const TransactionLookup = () => {
  const [txid, setTxid] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('Pending');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.role === 'buyer' && !data.hasPaid) {
            setAccessDenied(true);
            return;
          }
          setIsAuthenticated(true);
        }
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTransaction(null);
    setError('');

    try {
      const txQuery = query(collection(db, 'transactions'), where('transactionId', '==', txid));
      const snapshot = await getDocs(txQuery);

      if (!snapshot.empty) {
        const txDoc = snapshot.docs[0];
        setTransaction({ ...txDoc.data(), docRef: txDoc.ref });
        setApprovalStatus(txDoc.data().documentApprovalStatus || 'Pending');
      } else {
        setError('Transaction not found in Firebase.');
      }
    } catch (err) {
      console.error(err);
      setError('Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalUpdate = async () => {
    if (!transaction?.docRef) return;

    try {
      await updateDoc(transaction.docRef, { documentApprovalStatus: approvalStatus });
      setUpdateMessage('Approval status updated.');
    } catch (err) {
      console.error(err);
      setUpdateMessage('Failed to update approval.');
    }
  };

  const documentLabels = {
    CommercialInvoice: 'Commercial Invoice',
    PackingList: 'Packing List',
    BillOfLading: 'Bill of Lading',
    InsuranceCertificate: 'Insurance Certificate',
    CertificateOfOrigin: 'Certificate of Origin',
    InspectionCertificate: 'Inspection Certificate'
  };

  if (accessDenied) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>You must complete payment to access this page.</p>
        <button onClick={() => navigate('/payment')}>Go to Payment</button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please log in to continue.</p>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Transaction Lookup</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          placeholder="Enter TXID"
          style={{ width: 300, padding: 10 }}
          required
        />
        <button type="submit" style={{ marginLeft: 10, padding: 10 }}>Lookup</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transaction && (
        <div style={{ marginTop: 30 }}>
          <h3>Transaction Details</h3>
          <p><strong>Amount:</strong> {transaction.amount}</p>
          <p><strong>Currency:</strong> {transaction.currency}</p>
          <p><strong>Notes:</strong> {transaction.notes}</p>

          <h4>Documents</h4>
          <ul>
            {Object.entries(documentLabels).map(([key, label]) => (
              <li key={key}>
                {label}:{' '}
                {transaction.documentURLs?.[key] ? (
                  <>
                    <a href={transaction.documentURLs[key]} target="_blank" rel="noreferrer">View</a> |{' '}
                    <a href={transaction.documentURLs[key]} download>Download</a>
                  </>
                ) : (
                  <span style={{ color: 'red' }}>Missing</span>
                )}
              </li>
            ))}
          </ul>

          {transaction.contractURL && (
            <div>
              <h4>Contract</h4>
              <a href={transaction.contractURL} target="_blank" rel="noreferrer">View</a> |{' '}
              <a href={transaction.contractURL} download>Download</a>
            </div>
          )}

          <h4>Approval Status</h4>
          <p><strong>Current:</strong> {transaction.documentApprovalStatus || 'Pending'}</p>
          <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleApprovalUpdate} style={{ marginLeft: 10 }}>Update</button>
          {updateMessage && <p>{updateMessage}</p>}

          <div style={{ marginTop: 20 }}>
            <h4>Shipment Images</h4>
            {transaction.shipmentImages?.length ? (
              transaction.shipmentImages.map((url, i) => (
                <img key={i} src={url} alt={`Shipment ${i + 1}`} style={{ maxWidth: '100%', marginBottom: 10 }} />
              ))
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionLookup;



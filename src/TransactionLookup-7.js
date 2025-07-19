// TransactionLookup.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

function TransactionLookup() {
  const [txid, setTxid] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
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
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          // If buyer and hasPaid is false, deny access
          if (data.role === 'buyer' && data.hasPaid === false) {
            setAccessDenied(true);
            return;
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTransaction(null);
    setError(null);

    try {
      const q = query(collection(db, 'transactions'), where('transactionId', '==', txid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setTransaction({ ...doc.data(), docRef: doc.ref });
        setApprovalStatus(doc.data().documentApprovalStatus || 'Pending');
      } else {
        setError('Transaction not found.');
      }
    } catch (err) {
      setError('Error retrieving transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalUpdate = async () => {
    try {
      if (transaction && transaction.docRef) {
        await updateDoc(transaction.docRef, { documentApprovalStatus: approvalStatus });
        setUpdateMessage('Approval status updated successfully.');
      }
    } catch (err) {
      console.error(err);
      setUpdateMessage('Error updating approval status.');
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>You must complete payment to access this feature.</p>
        <button onClick={() => navigate('/payment')}>Go to Payment</button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be logged in to view this page.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Transaction Lookup</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>Lookup</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transaction && (
        <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <h3>Transaction Details</h3>
          <p><strong>Amount:</strong> {transaction.amount}</p>
          <p><strong>Currency:</strong> {transaction.currency}</p>
          <p><strong>Notes:</strong> {transaction.notes}</p>

          {transaction.documentURLs && (
            <div>
              <h4>Uploaded Documents</h4>
              <ul>
                {Object.entries(documentLabels).map(([key, label]) => (
                  <li key={key}>
                    <strong>{label}:</strong>{' '}
                    {transaction.documentURLs[key] ? (
                      <>
                        <a href={transaction.documentURLs[key]} target="_blank" rel="noopener noreferrer">View</a>{' | '}
                        <a href={transaction.documentURLs[key]} download>Download</a>
                      </>
                    ) : (
                      <span style={{ color: 'red' }}> Missing</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transaction.contractURL && (
            <div style={{ marginTop: '20px' }}>
              <h4>Uploaded Contract</h4>
              <a href={transaction.contractURL} target="_blank" rel="noopener noreferrer">View Contract</a>{' | '}
              <a href={transaction.contractURL} download>Download Contract</a>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <strong>Document Approval Status:</strong> {transaction.documentApprovalStatus || 'Pending'}
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="approvalStatus">Update Approval Status: </label>
            <select id="approvalStatus" value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button onClick={handleApprovalUpdate} style={{ marginLeft: '10px' }}>Update</button>
            {updateMessage && <p>{updateMessage}</p>}
          </div>

          <div>
            <strong>Shipment Images:</strong>
            {transaction.shipmentImages && transaction.shipmentImages.length > 0 ? (
              transaction.shipmentImages.map((url, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <img src={url} alt={`Shipment ${index + 1}`} style={{ maxWidth: '100%' }} />
                </div>
              ))
            ) : (
              <p>No shipment images available.</p>
            )}
          </div>
          <p><strong>Status:</strong> {transaction.sellerConfirmed ? 'Confirmed by seller' : 'Pending'}</p>
          <p><strong>Timestamps:</strong> {transaction.confirmedAt || 'Not available'}</p>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ marginTop: '30px' }}>Return to Home</button>
    </div>
  );
}

export default TransactionLookup;

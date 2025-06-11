// TransactionLookup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function TransactionLookup() {
  const [txid, setTxid] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setTransaction(doc.data());
      } else {
        setError('Transaction not found.');
      }
    } catch (err) {
      setError('Error retrieving transaction.');
    } finally {
      setLoading(false);
    }
  };

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
          {transaction.billOfLadingURL && (
            <p><strong>Bill of Lading:</strong> <a href={transaction.billOfLadingURL} target="_blank" rel="noopener noreferrer">View</a></p>
          )}
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


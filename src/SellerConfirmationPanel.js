// SellerConfirmationPanel.js
import React, { useState } from 'react';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, where, getDocs, collection, updateDoc } from 'firebase/firestore';

const SellerConfirmationPanel = () => {
  const [transactionId, setTransactionId] = useState('');
  const [billOfLading, setBillOfLading] = useState(null);
  const [shipmentImages, setShipmentImages] = useState([]);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      setStatus('');

      const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('Transaction not found.');
        return;
       }

      const transactionDoc = querySnapshot.docs[0];
      const docRef = transactionDoc.ref;
      const uploadPromises = [];

      let billURL = null;
      const imageURLs = [];

      if (billOfLading) {
        const billRef = ref(storage, `confirmations/${transactionId}_bill_${billOfLading.name}`);
        uploadPromises.push(
          uploadBytes(billRef, billOfLading).then(() => getDownloadURL(billRef).then(url => (billURL = url)))
        );
      }

      for (const image of shipmentImages) {
        const imageRef = ref(storage, `confirmations/${transactionId}_image_${image.name}`);
        uploadPromises.push(
          uploadBytes(imageRef, image).then(() => getDownloadURL(imageRef).then(url => imageURLs.push(url)))
        );
      }

      await Promise.all(uploadPromises);

      await updateDoc(docRef, {
        sellerConfirmed: true,
        billOfLadingURL: billURL || null,
        shipmentImages: imageURLs,
        confirmedAt: new Date().toISOString(),
      });

      setStatus('Shipment confirmation uploaded successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Error uploading confirmation.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Seller Shipment Confirmation</h2>

      <input
        type="text"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        placeholder="Enter Transaction ID"
        style={{ marginBottom: '10px', width: '300px' }}
      />

      <div>
        <label>Upload Bill of Lading:</label>
        <input type="file" onChange={(e) => setBillOfLading(e.target.files[0])} />
      </div>

      <div>
        <label>Upload Shipment Images:</label>
        <input type="file" multiple onChange={(e) => setShipmentImages([...e.target.files])} />
      </div>

      <button onClick={handleSubmit}>Submit Confirmation</button>

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}
    </div>
  );
};

export default SellerConfirmationPanel;



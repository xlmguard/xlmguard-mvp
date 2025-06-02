// SellerConfirmationPanel.js
import React, { useState } from 'react';
import { db, storage } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SellerConfirmationPanel = () => {
  const [txid, setTxid] = useState('');
  const [billOfLading, setBillOfLading] = useState(null);
  const [images, setImages] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const handleUpload = async () => {
    if (!txid || !billOfLading || images.length === 0) {
      setStatusMessage('Please fill all fields and upload files.');
      return;
    }

    try {
      const userDocRef = doc(db, 'transactions', txid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        setStatusMessage('Transaction not found.');
        return;
      }

      const uploads = [];

      const billRef = ref(storage, `confirmations/${txid}/billOfLading`);
      uploads.push(uploadBytes(billRef, billOfLading).then(() => getDownloadURL(billRef)));

      const imageUrls = await Promise.all(
        images.map((file, idx) => {
          const imgRef = ref(storage, `confirmations/${txid}/image_${idx}`);
          return uploadBytes(imgRef, file).then(() => getDownloadURL(imgRef));
        })
      );

      const [billUrl] = await Promise.all(uploads);

      await setDoc(userDocRef, {
        shipmentConfirmed: true,
        billOfLadingUrl: billUrl,
        imageUrls: imageUrls,
      }, { merge: true });

      setStatusMessage('Shipment confirmation uploaded successfully.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error uploading confirmation.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Seller Shipment Confirmation</h2>
      <input
        type="text"
        placeholder="Transaction ID"
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '300px' }}
      />
      <label>Upload Bill of Lading:</label>
      <input
        type="file"
        onChange={(e) => setBillOfLading(e.target.files[0])}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <label>Upload Shipment Images:</label>
      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <button onClick={handleUpload}>Submit Confirmation</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default SellerConfirmationPanel;

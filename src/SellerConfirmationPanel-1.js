// SellerConfirmationPanel.js
import React, { useState } from 'react';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, where, getDocs, collection, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const SellerConfirmationPanel = () => {
  const [transactionId, setTransactionId] = useState('');
  const [billOfLading, setBillOfLading] = useState(null);
  const [shipmentImages, setShipmentImages] = useState([]);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    console.log('✅ handleSubmit triggered with TXID:', transactionId);

    try {
      setStatus('');

      const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId));
      const querySnapshot = await getDocs(q);

      console.log('📦 Firebase query complete. Found docs:', querySnapshot.size);

      if (querySnapshot.empty) {
        console.warn('⚠️ Transaction not found.');
        setStatus('Transaction not found.');
        return;
      }

      const transactionDoc = querySnapshot.docs[0];
      const docRef = transactionDoc.ref;
      const txData = transactionDoc.data();

      console.log('📋 Transaction data:', txData);

      let billURL = null;
      const imageURLs = [];
      const uploadPromises = [];

      // Upload Bill of Lading
      if (billOfLading) {
        const billRef = ref(storage, `confirmations/${transactionId}_bill_${billOfLading.name}`);
        uploadPromises.push(
          uploadBytes(billRef, billOfLading)
            .then(() => getDownloadURL(billRef))
            .then((url) => {
              billURL = url;
              console.log('📄 Bill of Lading uploaded:', billURL);
            })
        );
      }

      // Upload Shipment Images
      for (const image of shipmentImages) {
        const imageRef = ref(storage, `confirmations/${transactionId}_image_${image.name}`);
        uploadPromises.push(
          uploadBytes(imageRef, image)
            .then(() => getDownloadURL(imageRef))
            .then((url) => {
              imageURLs.push(url);
              console.log('🖼️ Shipment image uploaded:', url);
            })
        );
      }

      await Promise.all(uploadPromises);
      console.log('📤 All files uploaded');

      await updateDoc(docRef, {
        sellerConfirmed: true,
        billOfLadingURL: billURL || null,
        shipmentImages: imageURLs,
        confirmedAt: new Date().toISOString(),
      });

      console.log('✅ Firestore document updated');

      // Prepare EmailJS
      const serviceID = 'service_xyj5n7d';
      const sellerTemplateID = 'template_pixnkqs';
      const buyerTemplateID = 'template_9ry4lu4';
      const publicKey = 'tcS3_a_kZH9ieBNBV';

      const sellerEmail = txData.seller_email;
      let buyerEmail = txData.buyer_email;
      const confirmationLink = `https://xlmguard.com/dashboard?txid=${transactionId}`;

      // Fallback lookup for buyer_email
      if (!buyerEmail) {
        const buyerQuery = query(collection(db, 'users'), where('paymentHash', '==', transactionId));
        const buyerSnap = await getDocs(buyerQuery);
        if (!buyerSnap.empty) {
          buyerEmail = buyerSnap.docs[0].data().email;
          console.log('📨 Buyer email resolved from users collection:', buyerEmail);
        } else {
          console.warn('⚠️ Buyer email not found in users.');
        }
      }

      // Notify Seller
      if (sellerEmail) {
        console.log('📧 Sending email to seller...');
        emailjs.send(serviceID, sellerTemplateID, {
          seller_email: sellerEmail,
          buyer_email: buyerEmail || 'n/a',
          amount: txData.amount || 'N/A',
          terms: txData.terms || 'N/A',
          txid: transactionId,
          link: confirmationLink,
        }, publicKey).then(() => {
          console.log('✅ Email sent to seller');
        }).catch((err) => {
          console.error('❌ Error sending seller email:', err);
        });
      }

      // Notify Buyer
      if (buyerEmail) {
        console.log('📧 Sending email to buyer...');
        emailjs.send(serviceID, buyerTemplateID, {
          buyer_email: buyerEmail,
          txid: transactionId,
          link: confirmationLink,
        }, publicKey).then(() => {
          console.log('✅ Email sent to buyer');
        }).catch((err) => {
          console.error('❌ Error sending buyer email:', err);
        });
      } else {
        console.warn('⚠️ No buyer email available; email not sent.');
      }

      setStatus('Shipment confirmation uploaded successfully.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err) {
      console.error('❌ handleSubmit error:', err);
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

      <button
        onClick={() => {
          alert('Submit clicked');
          handleSubmit();
        }}
      >
        Submit Confirmation
      </button>

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}
    </div>
  );
};

export default SellerConfirmationPanel;



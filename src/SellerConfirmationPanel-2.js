// SellerConfirmationPanel.js
import React, { useState } from 'react';
import { db, storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, where, getDocs, collection, updateDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const SellerConfirmationPanel = () => {
  const [transactionId, setTransactionId] = useState('');
  const [documents, setDocuments] = useState({});
  const [shipmentImages, setShipmentImages] = useState([]);
  const [status, setStatus] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const documentTypes = [
    'CommercialInvoice',
    'PackingList',
    'BillOfLading',
    'InsuranceCertificate',
    'CertificateOfOrigin',
    'InspectionCertificate'
  ];

  const handleDocumentUpload = (type, file) => {
    setDocuments((prevDocs) => ({ ...prevDocs, [type]: file }));
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      setStatus('Transaction ID is required.');
      return;
    }
    if (!captchaChecked) {
      setStatus('Please verify the CAPTCHA.');
      return;
    }

    try {
      setStatus('');
      console.log('Submit clicked with TXID:', transactionId);

      const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('Transaction not found.');
        return;
      }

      const transactionDoc = querySnapshot.docs[0];
      const docRef = transactionDoc.ref;
      const txData = transactionDoc.data();

      const docURLs = {};
      const imageURLs = [];
      const uploadPromises = [];

      for (const type of documentTypes) {
        const file = documents[type];
        if (file) {
          const fileRef = ref(storage, `confirmations/${transactionId}_${type}_${file.name}`);
          uploadPromises.push(
            uploadBytes(fileRef, file)
              .then(() => getDownloadURL(fileRef))
              .then((url) => {
                docURLs[type] = url;
              })
          );
        }
      }

      for (const image of shipmentImages) {
        const imageRef = ref(storage, `confirmations/${transactionId}_image_${image.name}`);
        uploadPromises.push(
          uploadBytes(imageRef, image)
            .then(() => getDownloadURL(imageRef))
            .then((url) => {
              imageURLs.push(url);
            })
        );
      }

      await Promise.all(uploadPromises);

      await updateDoc(docRef, {
        sellerConfirmed: true,
        documentURLs: docURLs,
        shipmentImages: imageURLs,
        confirmedAt: new Date().toISOString(),
      });

      const serviceID = 'service_xyj5n7d';
      const sellerTemplateID = 'template_pixnkqs';
      const buyerTemplateID = 'template_9ry4lu4';
      const publicKey = 'tcS3_a_kZH9ieBNBV';

      const sellerEmail = txData.seller_email;
      let buyerEmail = txData.buyer_email;
      const confirmationLink = `https://xlmguard.com/dashboard?txid=${transactionId}`;

      if (!buyerEmail) {
        const buyerQuery = query(collection(db, 'users'), where('paymentHash', '==', transactionId));
        const buyerSnap = await getDocs(buyerQuery);
        if (!buyerSnap.empty) {
          buyerEmail = buyerSnap.docs[0].data().email;
          console.log('Buyer email resolved from users:', buyerEmail);
        } else {
          console.warn('Buyer email not found in users.');
        }
      }

      if (sellerEmail) {
        emailjs.send(serviceID, sellerTemplateID, {
          seller_email: sellerEmail,
          buyer_email: buyerEmail || 'n/a',
          amount: txData.amount || 'N/A',
          terms: txData.terms || 'N/A',
          txid: transactionId,
          link: confirmationLink,
        }, publicKey).then(() => {
          console.log('Email sent to seller.');
        }).catch((err) => {
          console.error('Error sending seller email:', err);
        });
      }

      if (buyerEmail) {
        emailjs.send(serviceID, buyerTemplateID, {
          buyer_email: buyerEmail,
          txid: transactionId,
          link: confirmationLink,
        }, publicKey).then(() => {
          console.log('Email sent to buyer.');
        }).catch((err) => {
          console.error('Error sending buyer email:', err);
        });
      } else {
        console.warn('No buyer email available; buyer email not sent.');
      }

      setRedirect(true);
    } catch (err) {
      console.error(err);
      setStatus('Error uploading confirmation.');
    }
  };

  if (redirect) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Confirmation Received</h2>
        <p>Thank you. Your documents have been submitted successfully.</p>
        <a href="/">Return to Home</a>
        <br /><br />
        <button onClick={() => window.location.href = '/'}>Return to Home Page</button>
      </div>
    );
  }

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

      {documentTypes.map((type) => (
        <div key={type}>
          <label>Upload {type.replace(/([A-Z])/g, ' $1').trim()}:</label>
          <input type="file" onChange={(e) => handleDocumentUpload(type, e.target.files[0])} />
        </div>
      ))}

      <div>
        <label>Upload Shipment Images:</label>
        <input type="file" multiple onChange={(e) => setShipmentImages([...e.target.files])} />
      </div>

      <div style={{ margin: '10px 0' }}>
        <input
          type="checkbox"
          id="captcha"
          checked={captchaChecked}
          onChange={(e) => setCaptchaChecked(e.target.checked)}
        />
        <label htmlFor="captcha"> I'm not a robot</label>
      </div>

      <button onClick={handleSubmit}>Submit Confirmation</button>

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/'}>Return to Home Page</button>
      </div>
    </div>
  );
};

export default SellerConfirmationPanel;


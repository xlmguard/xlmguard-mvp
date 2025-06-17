// SellerConfirmationPanel.js
import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, where, getDocs, collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const SellerConfirmationPanel = () => {
  const [transactionId, setTransactionId] = useState('');
  const [documents, setDocuments] = useState({});
  const [shipmentImages, setShipmentImages] = useState([]);
  const [status, setStatus] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [contractUrl, setContractUrl] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [transactionDocRef, setTransactionDocRef] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const role = snap.exists() ? snap.data().role : null;
        setIsSeller(role === 'seller');
      } else {
        setIsSeller(false);
      }
      setAuthChecked(true);
    } );
  }, []);

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

  const loadTransaction = async () => {
    console.log('Looking up TXID:', transactionId.trim());
    if (!/^[a-fA-F0-9]{64}$/.test(transactionId)) {
      setStatus('Escrow TXID must be a valid 64-character hash.');
      return;
    }
    try {
      setStatus('');
      const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('Transaction not found.');
        return;
      }

      const docSnap = querySnapshot.docs[0];
      setTransactionDocRef(docSnap.ref);
      const txData = docSnap.data();
      if (txData.contractUrl) setContractUrl(txData.contractUrl);
      setStatus('Transaction loaded.');
    } catch (err) {
      console.error(err);
      setStatus('Error loading transaction.');
    }
  };

  const handleSubmit = async () => {
    if (!transactionDocRef) {
      setStatus('Please load a valid transaction first.');
      return;
    }
    if (!captchaChecked) {
      setStatus('Please verify the CAPTCHA.');
      return;
    }
    if (!acceptTerms) {
      setStatus('You must accept the contract terms to continue.');
      return;
    }
    if (!auth.currentUser) {
      setStatus('Upload blocked: user not authenticated.');
      return;
    }

    try {
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

      await updateDoc(transactionDocRef, {
        sellerConfirmed: true,
        shippingDocs: docURLs,
        shipmentImages: imageURLs,
        sellerAcceptedContract: true,
        shipmentConfirmedAt: new Date().toISOString()
      });

      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setStatus('Error uploading confirmation.');
    }
  };

  if (!authChecked) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Checking access...</div>;
  }

  if (!isSeller) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be logged in as a seller to view this page.</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

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
      <button onClick={loadTransaction}>Load Transaction</button>

      {contractUrl ? (
        <div style={{ marginTop: '20px' }}>
          <strong>Contract Document:</strong><br />
          <a href={contractUrl} target="_blank" rel="noopener noreferrer">🔍 View Contract</a><br />
          <a href={contractUrl} target="_blank" rel="noopener noreferrer" download>⬇ Download Contract</a>
        </div>
      ) : (
        <div style={{ marginTop: '20px', color: 'gray' }}>
          No contract has been uploaded for this transaction.
        </div>
      )}

      {transactionDocRef && (
        <>
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

          <div style={{ marginTop: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />{' '}
              I have reviewed the contract and accept the terms.
            </label>
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
        </>
      )}

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/'}>Return to Home Page</button>
      </div>
    </div>
   );
};

export default SellerConfirmationPanel;
















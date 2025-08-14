// src/SellerConfirmationPanel.js

import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { query, where, getDocs, collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import emailjs from '@emailjs/browser';

const SellerConfirmationPanel = () => {
  const [transactionId, setTransactionId] = useState('');
  const [documents, setDocuments] = useState({});
  const [existingDocuments, setExistingDocuments] = useState({});
  const [shipmentImages, setShipmentImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [status, setStatus] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [contractURL, setContractURL] = useState(null);
  const [amount, setAmount] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [documentApprovalStatus, setDocumentApprovalStatus] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletMemo, setWalletMemo] = useState('');

  const auth = getAuth();

  // IMPORTANT: Place blank form templates in /public/forms/
  // Adjust filenames/paths below to match your repo.
  const formTemplates = [
    {
      key: 'CommercialInvoice',
      label: 'Commercial Invoice',
      description: 'Standard invoice with HS codes, value, currency, and terms.',
      templateUrl: '/forms/international-commercial-invoice-template.pdf',
      accept: '.pdf'
    },
    {
      key: 'PackingList',
      label: 'Packing List',
      description: 'Detailed packing list for quantities, weights, and package counts.',
      templateUrl: '/forms/packing-list.pdf',
      accept: '.pdf'
    },
    {
      key: 'BillOfLading',
      label: 'Straight Bill of Lading (BOL)',
      description: 'Non-negotiable BOL for ground/sea shipments.',
      templateUrl: '/forms/straight-bol.pdf',
      accept: '.pdf'
    },
    {
      key: 'InsuranceCertificate',
      label: 'Certificate of Insurance (ACORD 25 sample)',
      description: 'Proof of liability coverage. Upload your carrier-issued COI.',
      templateUrl: '/forms/acord_cert_of_ins_sample.pdf',
      accept: '.pdf'
    },
    {
      key: 'CertificateOfOrigin',
      label: 'Certificate of Origin (NAFTA/USMCA example)',
      description: 'Country of origin certification (use the correct program for your lane).',
      templateUrl: '/forms/NAFTA_ENGLISH_Certificate_of_Origin.pdf',
      accept: '.pdf'
    },
    {
      key: 'InspectionCertificate',
      label: 'Inspection Report/Certificate',
      description: '3rd-party or internal inspection report as required by contract.',
      templateUrl: '/forms/inspection-report.docx',
      accept: '.pdf,.doc,.docx'
    }
  ];

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
    });
  }, []);

  // Existing document type keys used throughout your app — do not change.
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

  const deleteDocument = async (type) => {
    if (!existingDocuments[type]) return;
    const fileRef = ref(
      storage,
      existingDocuments[type].split('/o/')[1].split('?')[0].replace('%2F', '/')
    );
    await deleteObject(fileRef);
    setExistingDocuments((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  const fetchContractURL = async () => {
    if (!transactionId.trim()) return;
    const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const txData = snapshot.docs[0].data();
      if (txData.contractURL) setContractURL(txData.contractURL);
      if (txData.documentURLs) setExistingDocuments(txData.documentURLs);
      if (txData.shipmentImages) setExistingImages(txData.shipmentImages);
      if (txData.amount) setAmount(txData.amount);
      if (txData.currency) setCurrency(txData.currency);
      if (txData.documentApprovalStatus) setDocumentApprovalStatus(txData.documentApprovalStatus);
      else setDocumentApprovalStatus('Pending');
    } else {
      setContractURL(null);
      setExistingDocuments({});
      setExistingImages([]);
      setAmount(null);
      setCurrency(null);
      setDocumentApprovalStatus(null);
    }
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) return setStatus('Transaction ID is required.');
    if (!captchaChecked) return setStatus('Please verify the CAPTCHA.');
    if (!acceptTerms) return setStatus('You must accept the contract terms.');
    if (!walletAddress.trim()) return setStatus('Please enter your wallet address.');
    if (!auth.currentUser) return setStatus('Upload blocked: user not authenticated.');

    try {
      setStatus('');

      const q = query(collection(db, 'transactions'), where('transactionId', '==', transactionId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return setStatus('Transaction not found.');

      const transactionDoc = querySnapshot.docs[0];
      const docRef = transactionDoc.ref;
      const txData = transactionDoc.data();

      const docURLs = { ...existingDocuments };
      const imageURLs = [...existingImages];
      const uploadPromises = [];

      for (const type of documentTypes) {
        const file = documents[type];
        if (file) {
          const safeName = file.name.replace(/\s+/g, '_');
          const fileRef = ref(storage, `confirmations/${transactionId}_${type}_${safeName}`);
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
        const safeName = image.name.replace(/\s+/g, '_');
        const imageRef = ref(storage, `confirmations/${transactionId}_image_${safeName}`);
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
        walletAddress,
        walletMemo
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
        if (!buyerSnap.empty) buyerEmail = buyerSnap.docs[0].data().email;
      }

      if (sellerEmail) {
        emailjs.send(
          serviceID,
          sellerTemplateID,
          {
            seller_email: sellerEmail,
            buyer_email: buyerEmail || 'n/a',
            amount: txData.amount || 'N/A',
            terms: txData.terms || 'N/A',
            txid: transactionId,
            link: confirmationLink
          },
          publicKey
        );
      }

      if (buyerEmail) {
        emailjs.send(
          serviceID,
          buyerTemplateID,
          {
            buyer_email: buyerEmail,
            txid: transactionId,
            link: confirmationLink
          },
          publicKey
        );
      }

      setRedirect(true);
    } catch (err) {
      console.error(err);
      setStatus('Error uploading confirmation.');
    }
  };

  if (!authChecked)
    return <div style={{ padding: '40px', textAlign: 'center' }}>Checking access...</div>;

  if (!isSeller)
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be logged in as a seller to view this page.</p>
        <button onClick={() => (window.location.href = '/')}>Return to Home</button>
      </div>
    );

  if (redirect)
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Confirmation Received</h2>
        <p>Thank you. Your documents have been submitted successfully.</p>
        <a href="/">Return to Home</a>
        <br />
        <br />
        <button onClick={() => (window.location.href = '/')}>Return to Home Page</button>
      </div>
    );

  const InfoTag = ({ children }) => (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        background: '#eef2ff',
        color: '#3730a3',
        padding: '2px 8px',
        borderRadius: 12,
        marginLeft: 8
      }}
    >
      {children}
    </span>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Seller Shipment Confirmation</h2>

      {amount && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Escrowed Value: {amount} {currency || ''}
          </div>
          {documentApprovalStatus && (
            <div style={{ marginTop: '5px', fontSize: '16px', color: '#333' }}>
              Document Approval Status: {documentApprovalStatus}
            </div>
          )}
        </div>
      )}

      <input
        type="text"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        onBlur={fetchContractURL}
        placeholder="Enter Transaction ID"
        style={{ marginBottom: '10px', width: '300px' }}
      />

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter your wallet address"
        style={{ marginBottom: '10px', width: '300px', marginLeft: 10 }}
      />
      <input
        type="text"
        value={walletMemo}
        onChange={(e) => setWalletMemo(e.target.value)}
        placeholder="Enter your wallet memo (if any)"
        style={{ marginBottom: '20px', width: '300px', marginLeft: 10 }}
      />

      {contractURL && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Contract Document</h4>
          <a href={contractURL} target="_blank" rel="noopener noreferrer">
            View Contract
          </a>{' '}
          | <a href={contractURL} download>Download Contract</a>
        </div>
      )}

      {/* New: Guided Forms panel (optional) */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: 16,
          margin: '20px 0',
          background: '#fafafa'
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Guided Forms <InfoTag>Download blank → Upload completed</InfoTag>
        </h3>
        <p style={{ marginTop: 4, color: '#444' }}>
          Use these templates (or your own). Upload the completed file to attach it to this shipment.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 1fr', gap: 12 }}>
          <div style={{ fontWeight: 'bold' }}>Form</div>
          <div style={{ fontWeight: 'bold' }}>Template</div>
          <div style={{ fontWeight: 'bold' }}>Upload Completed</div>

          {formTemplates.map((f) => (
            <React.Fragment key={f.key}>
              <div>
                {f.label}
                <div style={{ fontSize: 12, color: '#555' }}>{f.description}</div>
              </div>
              <div>
                <a href={f.templateUrl} target="_blank" rel="noopener noreferrer">
                  Open Blank
                </a>{' '}
                | <a href={f.templateUrl} download>Download</a>
              </div>
              <div>
                <input
                  type="file"
                  accept={f.accept}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) handleDocumentUpload(f.key, file);
                  }}
                />
                {existingDocuments[f.key] && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 10 }}>
                    <a
                      href={existingDocuments[f.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Existing
                    </a>
                    <button onClick={() => deleteDocument(f.key)}>Delete</button>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 10 }}>
          Tip: If a chamber, insurer, or carrier issues the final document (e.g., COI, BOL), just upload
          the issued PDF here.
        </div>
      </div>

      {/* Original generic uploaders preserved (backward compatible) */}
      <h4>Manual Uploads (existing)</h4>
      {documentTypes.map((type) => (
        <div key={type} style={{ marginBottom: '10px' }}>
          <label>Upload {type.replace(/([A-Z])/g, ' $1').trim()}:</label>{' '}
          <input
            type="file"
            onChange={(e) => handleDocumentUpload(type, e.target.files[0])}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
          {existingDocuments[type] && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '5px'
              }}
            >
              <a
                href={existingDocuments[type]}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Existing
              </a>
              <button onClick={() => deleteDocument(type)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <label>Upload Shipment Images:</label>{' '}
        <input
          type="file"
          multiple
          onChange={(e) => setShipmentImages([...e.target.files])}
          accept=".pdf,.png,.jpg,.jpeg"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />{' '}
        I have reviewed the contract and accept the terms.
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px'
        }}
      >
        <button onClick={handleSubmit}>Submit Confirmation</button>
        <button onClick={() => (window.location.href = '/')}>Return to Home Page</button>
      </div>

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}
    </div>
  );
};

export default SellerConfirmationPanel;

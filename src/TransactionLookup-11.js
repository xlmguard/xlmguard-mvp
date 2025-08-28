// src/TransactionLookup.js
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase.js';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

const HORIZON = 'https://horizon.stellar.org';

function TransactionLookup() {
  const [txid, setTxid] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [approvalStatus, setApprovalStatus] = useState('Pending');
  const [updateMessage, setUpdateMessage] = useState('');
  const [fetchMsg, setFetchMsg] = useState('');

  // auth + access
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isOnTrial, setIsOnTrial] = useState(false); // banner only
  const navigate = useNavigate();

  // ---------- auth gate with FREE TRIAL ----------
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setAccessDenied(false);
        setIsOnTrial(false);
        return;
      }

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        setIsAuthenticated(false);
        setAccessDenied(false);
        setIsOnTrial(false);
        return;
      }

      const u = snap.data();
      const role = u.role || 'buyer';
      const hasPaid = !!u.hasPaid;
      const trialCredits = Number(u.trialCredits ?? 0);
      const plan = (u.plan || '').toLowerCase(); // e.g., 'pilot'

      const freeTrialAllowed = trialCredits > 0 || plan === 'pilot';

      if (role === 'buyer') {
        if (hasPaid || freeTrialAllowed) {
          setIsAuthenticated(true);
          setAccessDenied(false);
          setIsOnTrial(!hasPaid && freeTrialAllowed);
        } else {
          setIsAuthenticated(true); // logged in
          setAccessDenied(true);   // but not allowed
          setIsOnTrial(false);
        }
      } else {
        // non-buyer roles: let through (unchanged behavior)
        setIsAuthenticated(true);
        setAccessDenied(false);
        setIsOnTrial(false);
      }
    });
  }, []);

  // ---------- helpers: seller payout ----------
  const getSellerPayoutInfo = (tx) => {
    if (!tx) return { address: null, memo: null };
    const addrCandidates = [
      tx.walletAddress, // your current schema
      tx.sellerWalletAddress,
      tx.sellerWallet,
      tx.payoutAddress,
      tx.destinationAddress,
      tx.coinbaseAddress,
      tx.seller?.walletAddress,
      tx.seller?.payoutAddress,
    ];
    const memoCandidates = [
      tx.walletMemo, // your current schema
      tx.sellerWalletMemo,
      tx.sellerMemo,
      tx.payoutMemo,
      tx.destinationMemo,
      tx.destinationTag,
      tx.coinbaseMemo,
      tx.seller?.walletMemo,
      tx.seller?.payoutMemo,
    ];
    const address =
      addrCandidates.find((v) => typeof v === 'string' && v.trim()) || null;
    const memoVal =
      memoCandidates.find(
        (v) =>
          (typeof v === 'string' || typeof v === 'number') &&
          String(v).trim().length > 0
      ) ?? null;

    return { address, memo: memoVal === null ? null : String(memoVal) };
  };

  const { address: sellerAddress, memo: sellerMemo } = useMemo(
    () => getSellerPayoutInfo(transaction),
    [transaction]
  );

  // ---------- lookup by transactionId ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTransaction(null);
    setError(null);
    setUpdateMessage('');
    setFetchMsg('');

    try {
      const q = query(
        collection(db, 'transactions'),
        where('transactionId', '==', txid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setTransaction({ ...docSnap.data(), docRef: docSnap.ref });
        setApprovalStatus(docSnap.data().documentApprovalStatus || 'Pending');
      } else {
        setError('Transaction not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Error retrieving transaction.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- update approval ----------
  const handleApprovalUpdate = async () => {
    try {
      if (!txid) {
        setUpdateMessage('Transaction ID missing.');
        return;
      }
      setUpdateMessage('Updating...');

      const q = query(
        collection(db, 'transactions'),
        where('transactionId', '==', txid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setUpdateMessage('Transaction not found.');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { documentApprovalStatus: approvalStatus });
      setUpdateMessage('Approval status updated successfully.');
    } catch (err) {
      console.error(err);
      setUpdateMessage('Error updating approval status.');
    }
  };

  // ---------- copy helper ----------
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Copied to clipboard');
    }
  };

  // ---------- UI atoms ----------
  const Field = ({ label, children }) => (
    <p style={{ margin: '6px 0' }}>
      <strong>{label}:</strong> {children}
    </p>
  );

  const Monospace = ({ text }) => (
    <span
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        wordBreak: 'break-all',
      }}
    >
      {text}
    </span>
  );

  const Box = ({ title, children }) => (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: 14,
        marginTop: 14,
        background: '#fafafa',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );

  const documentLabels = {
    CommercialInvoice: 'Commercial Invoice',
    PackingList: 'Packing List',
    BillOfLading: 'Bill of Lading',
    InsuranceCertificate: 'Insurance Certificate',
    CertificateOfOrigin: 'Certificate of Origin',
    InspectionCertificate: 'Inspection Certificate',
  };

  // ---------- fetch & save real TXID from Horizon ----------
  const amountsEqual = (a, b) =>
    Math.abs(parseFloat(a) - parseFloat(b)) < 1e-7;

  const fetchAndSaveRealTxid = async () => {
    try {
      if (!transaction) {
        setFetchMsg('Load a transaction first.');
        return;
      }
      if (!sellerAddress || !sellerMemo) {
        setFetchMsg('Missing seller wallet or memo on this record.');
        return;
      }
      if (!transaction.amount || !transaction.currency) {
        setFetchMsg('Missing amount/currency on this record.');
        return;
      }
      if (transaction.currency !== 'XLM') {
        setFetchMsg('Auto-fetch is implemented for XLM only.');
        return;
      }

      setFetchMsg('Searching Horizon for matching payment...');

      // 1) List most recent payments to the seller's address
      const url = `${HORIZON}/accounts/${sellerAddress}/payments?limit=200&order=desc`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Horizon query failed');
      const data = await resp.json();
      const records = data?._embedded?.records || [];

      // 2) Find candidates that match the destination + amount (memo is on the transaction)
      const candidates = records.filter(
        (r) =>
          r.type === 'payment' &&
          r.to === sellerAddress &&
          r.asset_type === 'native' && // XLM
          amountsEqual(r.amount, transaction.amount)
      );

      // 3) Check each candidate's transaction for memo match
      let found = null;
      for (const r of candidates) {
        const txHash = r.transaction_hash;
        if (!txHash) continue;

        const txResp = await fetch(`${HORIZON}/transactions/${txHash}`);
        if (!txResp.ok) continue;
        const tx = await txResp.json();

        // Horizon returns 'memo' string (or null)
        if (String(tx.memo || '').trim() === String(sellerMemo).trim()) {
          found = {
            realTxId: tx.hash, // the transaction hash
            created_at: tx.created_at,
          };
          break;
        }
      }

      if (!found) {
        setFetchMsg(
          'No matching on-chain payment found yet. Try again later after the buyer sends funds.'
        );
        return;
      }

      // 4) Save to Firestore
      await updateDoc(transaction.docRef, {
        realTxId: found.realTxId,
        paidAt: found.created_at,
        txValidated: true,
      });

      // 5) Reflect in UI
      setTransaction((prev) =>
        prev
          ? {
              ...prev,
              realTxId: found.realTxId,
              paidAt: found.created_at,
              txValidated: true,
            }
          : prev
      );
      setFetchMsg('TXID saved to Firestore successfully.');
    } catch (err) {
      console.error(err);
      setFetchMsg('Error fetching/saving TXID.');
    }
  };

  // ---------- guards ----------
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

  // ---------- render ----------
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Transaction Lookup</h2>

      {isOnTrial && (
        <div
          style={{
            margin: '12px auto 16px',
            padding: '10px 12px',
            maxWidth: 720,
            border: '1px solid #fde68a',
            background: '#fffbeb',
            color: '#92400e',
            borderRadius: 8,
            textAlign: 'left',
          }}
        >
          You’re on a <b>Free Pilot</b>. Lookup is enabled so you can validate documents for your first shipment.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Lookup
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transaction && (
        <div style={{ textAlign: 'left', maxWidth: '720px', margin: '0 auto' }}>
          <h3>Transaction Details</h3>

          <Field label="Amount">{transaction.amount}</Field>
          <Field label="Currency">{transaction.currency}</Field>
          {transaction.notes && <Field label="Notes">{transaction.notes}</Field>}

          {/* Seller payout info */}
          <Box title="Seller Payout (for Buyer to Pay)">
            <Field label="Wallet Address">
              {sellerAddress ? (
                <>
                  <Monospace text={sellerAddress} />{' '}
                  <button onClick={() => copyToClipboard(sellerAddress)} style={{ marginLeft: 8 }}>
                    Copy
                  </button>
                </>
              ) : (
                <span style={{ color: '#b00020' }}>Missing</span>
              )}
            </Field>

            <Field label="Memo / Destination Tag">
              {sellerMemo ? (
                <>
                  <Monospace text={sellerMemo} />{' '}
                  <button onClick={() => copyToClipboard(sellerMemo)} style={{ marginLeft: 8 }}>
                    Copy
                  </button>
                </>
              ) : (
                <span style={{ color: '#b00020' }}>Missing</span>
              )}
            </Field>

            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              Tip: For Coinbase/XLM and many custodial wallets, the <em>Memo/Tag</em> is required.
            </div>
          </Box>

          {/* Payment Verification */}
          <Box title="Payment Verification">
            <Field label="Real TXID (on-chain)">
              {transaction.realTxId ? (
                <Monospace text={transaction.realTxId} />
              ) : (
                <span style={{ color: '#b00020' }}>Not captured yet</span>
              )}
            </Field>
            {transaction.paidAt && (
              <Field label="Paid At">
                <Monospace text={transaction.paidAt} />
              </Field>
            )}
            <div style={{ marginTop: 8 }}>
              <button onClick={fetchAndSaveRealTxid}>Fetch &amp; Save Real TXID</button>
              {fetchMsg && <p style={{ marginTop: 8 }}>{fetchMsg}</p>}
            </div>
          </Box>

          {/* Documents */}
          {transaction.documentURLs && (
            <Box title="Uploaded Documents">
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {Object.entries({
                  CommercialInvoice: 'Commercial Invoice',
                  PackingList: 'Packing List',
                  BillOfLading: 'Bill of Lading',
                  InsuranceCertificate: 'Insurance Certificate',
                  CertificateOfOrigin: 'Certificate of Origin',
                  InspectionCertificate: 'Inspection Certificate',
                }).map(([key, label]) => (
                  <li key={key} style={{ marginBottom: 6 }}>
                    <strong>{label}:</strong>{' '}
                    {transaction.documentURLs[key] ? (
                      <>
                        <a
                          href={transaction.documentURLs[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                        {' | '}
                        <a href={transaction.documentURLs[key]} download>
                          Download
                        </a>
                      </>
                    ) : (
                      <span style={{ color: 'red' }}> Missing</span>
                    )}
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Contract */}
          {transaction.contractURL && (
            <Box title="Uploaded Contract">
              <a href={transaction.contractURL} target="_blank" rel="noopener noreferrer">
                View Contract
              </a>
              {' | '}
              <a href={transaction.contractURL} download>
                Download Contract
              </a>
            </Box>
          )}

          {/* Shipment images */}
          <Box title="Shipment Images">
            {transaction.shipmentImages && transaction.shipmentImages.length > 0 ? (
              transaction.shipmentImages.map((url, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <img
                    src={url}
                    alt={`Shipment ${index + 1}`}
                    style={{ maxWidth: '100%', borderRadius: 8 }}
                  />
                </div>
              ))
            ) : (
              <p>No shipment images available.</p>
            )}
          </Box>

          {/* Status + Approval */}
          <Box title="Status & Approvals">
            <Field label="Document Approval Status">
              {transaction.documentApprovalStatus || 'Pending'}
            </Field>

            <div style={{ marginTop: 6 }}>
              <label htmlFor="approvalStatus">Update Approval Status: </label>
              <select
                id="approvalStatus"
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button onClick={handleApprovalUpdate} style={{ marginLeft: 10 }}>
                Update
              </button>
              {updateMessage && <p style={{ marginTop: 6 }}>{updateMessage}</p>}
            </div>

            <Field label="Seller Confirmation">
              {transaction.sellerConfirmed ? 'Confirmed by seller' : 'Pending'}
            </Field>
            <Field label="Confirmed / Updated At">
              {transaction.confirmedAt || transaction.updatedAt || 'Not available'}
            </Field>
          </Box>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ marginTop: '30px' }}>
        Return to Home
      </button>
    </div>
  );
}

export default TransactionLookup;









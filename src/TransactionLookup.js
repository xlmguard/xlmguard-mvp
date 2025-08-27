// src/TransactionLookup.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc, getDoc, collection, query, where, getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const styles = {
  page: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '0 auto' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  h1: { margin: 0, fontSize: 24, fontWeight: 800 },
  btn: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  danger: { padding: '8px 12px', borderRadius: 8, border: '1px solid #c00', background: '#f33', color: '#fff', cursor: 'pointer' },
  card: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, background: '#fff' },
  grid: { display: 'grid', gap: 12 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 14 },
  th: { textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e5e7eb', color: '#475569' },
  td: { padding: '10px 8px', borderBottom: '1px solid #f1f5f9' },
  badgeOk: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#ecfdf5', color:'#047857', border:'1px solid #34d399', fontSize:12 },
  badgeWait: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#fff7ed', color:'#9a3412', border:'1px solid #fbbf24', fontSize:12 },
  pilot: { margin:'8px 0 12px', padding:10, border:'1px solid #fde68a', background:'#fffbeb', borderRadius:10, color:'#92400e' },
  center: { textAlign: 'center', marginTop: 80 },
  error: { margin:'12px 0', padding:10, border:'1px solid #fecaca', background:'#fef2f2', color:'#991b1b', borderRadius:10, whiteSpace:'pre-wrap' },
};

export default function TransactionLookup() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [trialCredits, setTrialCredits] = useState(0);
  const [rows, setRows] = useState([]);
  const [errText, setErrText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate('/login');
        return;
      }
      setUser(u);

      try {
        // 1) Load user flags
        const ref = doc(db, 'users', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setHasPaid(!!d.hasPaid);
          setTrialCredits(d.trialCredits ?? 0);
        }

        // 2) Load this user's transactions (no orderBy to avoid index requirement)
        const q = query(
          collection(db, 'transactions'),
          where('uid', '==', u.uid)
        );
        const qs = await getDocs(q);
        const list = qs.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

        // Sort client-side by createdAt desc if present
        list.sort((a, b) => {
          const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tb - ta;
        });

        setRows(list);
      } catch (e) {
        console.error('Lookup failed:', e);
        setErrText(e?.message || 'Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const allowAccess = hasPaid || trialCredits > 0;

  if (loading) return <div style={styles.center}>Loading…</div>;

  if (!allowAccess) {
    return (
      <div style={styles.center}>
        <h2>Access Restricted</h2>
        <p>You must complete payment to access this feature.</p>
        <button style={styles.btn} onClick={() => navigate('/payment')}>Go to Payment</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        <h1 style={styles.h1}>Buyer Transaction Lookup</h1>
        <div style={{display:'flex', gap:8}}>
          <button style={styles.btn} onClick={() => navigate('/')}>Return Home</button>
          <button style={styles.danger} onClick={logout}>Logout</button>
        </div>
      </div>

      {trialCredits > 0 && !hasPaid && (
        <div style={styles.pilot}>
          You’re on a <b>Free Pilot</b>. Lookup is enabled so you can validate documents for your first shipment.
        </div>
      )}

      {errText && <div style={styles.error}>{errText}</div>}

      <div style={styles.card}>
        {rows.length === 0 ? (
          <div>No transactions found yet.</div>
        ) : (
          <div style={styles.grid}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Currency</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Docs</th>
                  <th style={styles.th}>Verified</th>
                  <th style={styles.th}>TXID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>
                      {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''}
                    </td>
                    <td style={styles.td}>{r.currency || '-'}</td>
                    <td style={styles.td}>{r.amount || '-'}</td>
                    <td style={styles.td}>
                      {r.contractURL ? (
                        <a href={r.contractURL} target="_blank" rel="noreferrer">View</a>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>
                      {r.txValidated
                        ? <span style={styles.badgeOk}>Verified</span>
                        : <span style={styles.badgeWait}>Pending</span>}
                    </td>
                    <td style={{...styles.td, maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {r.transactionId || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



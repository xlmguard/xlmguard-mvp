// src/TransactionLookup.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const styles = {
  page: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 1000, margin: '0 auto' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  h1: { margin: 0, fontSize: 28, fontWeight: 800 },
  actions: { display: 'flex', gap: 8 },
  btn: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  primary: { padding: '8px 12px', borderRadius: 8, border: '1px solid #0b74ff', background: '#0b74ff', color: '#fff', cursor: 'pointer' },
  danger: { padding: '8px 12px', borderRadius: 8, border: '1px solid #c00', background: '#f33', color: '#fff', cursor: 'pointer' },
  pilot: { margin:'8px 0 12px', padding:10, border:'1px solid #fde68a', background:'#fffbeb', borderRadius:10, color:'#92400e' },
  error: { margin:'12px 0', padding:10, border:'1px solid #fecaca', background:'#fef2f2', color:'#991b1b', borderRadius:10, whiteSpace:'pre-wrap' },
  card: { border: '1px solid #e5e7eb', borderRadius: 12, background:'#fff' },
  tableWrap: { overflowX:'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#475569', whiteSpace:'nowrap' },
  td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', verticalAlign:'top' },
  badgeOk: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#ecfdf5', color:'#047857', border:'1px solid #34d399', fontSize:12 },
  badgeWait: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#fff7ed', color:'#9a3412', border:'1px solid #fbbf24', fontSize:12 },
  link: { color:'#6d28d9', textDecoration:'underline', cursor:'pointer' },
  details: { background:'#f8fafc' },
  k: { color:'#64748b' },
  mono: { fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
};

function shorten(s, head=8, tail=6) {
  if (!s) return '—';
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export default function TransactionLookup() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [trialCredits, setTrialCredits] = useState(0);
  const [plan, setPlan] = useState('');
  const [rows, setRows] = useState([]);
  const [errText, setErrText] = useState('');
  const [polling, setPolling] = useState(true);
  const polls = useRef(0);

  const navigate = useNavigate();

  const loadData = async (u) => {
    try {
      // user flags
      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setHasPaid(!!d.hasPaid);
        setTrialCredits(d.trialCredits ?? 0);
        setPlan(d.plan || '');
      }
      // user txs (no orderBy; sort client-side)
      const q = query(collection(db, 'transactions'), where('uid', '==', u.uid));
      const qs = await getDocs(q);
      const list = qs.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
      setRows(list);
      setErrText('');
    } catch (e) {
      console.error('Lookup load failed:', e);
      setErrText(e?.message || 'Failed to load transactions.');
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/login'); return; }
      setUser(u);
      await loadData(u);
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  // light auto-refresh (15s x 8 = 2 minutes)
  useEffect(() => {
    if (!user || !polling) return;
    const t = setInterval(async () => {
      polls.current += 1;
      await loadData(user);
      if (polls.current >= 8) setPolling(false);
    }, 15000);
    return () => clearInterval(t);
  }, [user, polling]);

  const logout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const allowAccess = hasPaid || trialCredits > 0 || plan === 'pilot';

  if (loading) return <div style={{ textAlign:'center', marginTop:80 }}>Loading…</div>;

  if (!allowAccess) {
    return (
      <div style={{ textAlign:'center', marginTop:80 }}>
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
        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate('/')}>Return Home</button>
          <button style={styles.btn} onClick={() => loadData(user)}>Refresh</button>
          <button style={styles.danger} onClick={logout}>Logout</button>
        </div>
      </div>

      {!hasPaid && (trialCredits > 0 || plan === 'pilot') && (
        <div style={styles.pilot}>
          You’re on a <b>Free Pilot</b>. Lookup is enabled so you can validate documents for your shipment.
        </div>
      )}

      {errText && <div style={styles.error}>{errText}</div>}

      <div style={styles.card}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Currency</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Docs</th>
                <th style={styles.th}>Verified</th>
                <th style={styles.th}>TXID</th>
                <th style={styles.th}>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td style={styles.td} colSpan={7}>No transactions found yet.</td></tr>
              ) : rows.map((r, i) => <TxRow key={r.id} r={r} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TxRow({ r }) {
  const [open, setOpen] = useState(false);
  const dateStr = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : '';

  return (
    <>
      <tr>
        <td style={styles.td}>{dateStr}</td>
        <td style={styles.td}>{r.currency || '—'}</td>
        <td style={styles.td}>{r.amount || '—'}</td>
        <td style={styles.td}>
          {r.contractURL ? <a href={r.contractURL} target="_blank" rel="noreferrer" style={styles.link}>View</a> : '—'}
        </td>
        <td style={styles.td}>
          {r.txValidated ? <span style={styles.badgeOk}>Verified</span> : <span style={styles.badgeWait}>Pending</span>}
        </td>
        <td style={{...styles.td, maxWidth:260, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          <span title={r.transactionId || ''} style={styles.mono}>{r.transactionId || '—'}</span>
        </td>
        <td style={styles.td}>
          <button style={styles.btn} onClick={() => setOpen(v => !v)}>{open ? 'Hide' : 'Show'}</button>
        </td>
      </tr>
      {open && (
        <tr className="details">
          <td style={{...styles.td, ...styles.details}} colSpan={7}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <div><span style={styles.k}>Receiver Wallet:</span> <span style={styles.mono} title={r.walletAddress}>{shorten(r.walletAddress)}</span></div>
                <div><span style={styles.k}>Receiver Memo/Tag:</span> <span className="mono">{r.walletMemo || '—'}</span></div>
                <div><span style={styles.k}>Buyer Wallet:</span> <span style={styles.mono} title={r.buyerWalletAddress}>{shorten(r.buyerWalletAddress)}</span></div>
                <div><span style={styles.k}>Buyer Memo/Tag:</span> <span className="mono">{r.buyerMemoTag || '—'}</span></div>
              </div>
              <div>
                <div><span style={styles.k}>Notes:</span> {r.notes || '—'}</div>
                <div><span style={styles.k}>TXID:</span> <span style={styles.mono}>{r.transactionId || '—'}</span></div>
                <div><span style={styles.k}>Verified:</span> {r.txValidated ? 'Yes' : 'No'}</div>
                <div><span style={styles.k}>Verified At:</span> {r.verifiedAt?.toDate ? r.verifiedAt.toDate().toLocaleString() : '—'}</div>
                {r.contractURL && (
                  <div><span style={styles.k}>Document:</span> <a href={r.contractURL} target="_blank" rel="noreferrer" style={styles.link}>Open</a></div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}





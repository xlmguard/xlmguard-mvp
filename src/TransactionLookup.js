// src/TransactionLookup.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const styles = {
  page: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 1100, margin: '0 auto' },
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
  // details panel
  detailsCell: { background:'#f8fafc', borderTop:'1px dashed #e5e7eb' },
  block: { border:'1px solid #e5e7eb', background:'#fff', borderRadius:8, padding:12, marginBottom:10 },
  subtitle: { margin:'0 0 8px', fontWeight:800, fontSize:13, color:'#334155' },
  line: { margin:'4px 0' },
  k: { color:'#64748b' },
  mono: { fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
  docList: { margin:0, paddingLeft:18 },
  imgGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:10 },
  img: { width:'100%', height:140, objectFit:'cover', border:'1px solid #e5e7eb', borderRadius:6, background:'#fff' },
};

function shorten(s, head=10, tail=8) {
  if (!s) return '—';
  const str = String(s);
  if (str.length <= head + tail + 3) return str;
  return `${str.slice(0, head)}…${str.slice(-tail)}`;
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
      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const d = userSnap.data();
        setHasPaid(!!d.hasPaid);
        setTrialCredits(d.trialCredits ?? 0);
        setPlan(d.plan || '');
      }
      const q = query(collection(db, 'transactions'), where('uid', '==', u.uid));
      const qs = await getDocs(q);
      const list = qs.docs.map((s) => ({ id: s.id, ...s.data() }));
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

  // light auto-refresh (15s x 8 ≈ 2 min)
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
              ) : rows.map((r) => <TxRow key={r.id} r={r} />)}
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
  const docCount = countKnownDocs(r);

  return (
    <>
      <tr>
        <td style={styles.td}>{dateStr}</td>
        <td style={styles.td}>{r.currency || '—'}</td>
        <td style={styles.td}>{r.amount || '—'}</td>
        <td style={styles.td}>
          {docCount > 0 ? `${docCount} file${docCount>1?'s':''}` : (r.contractURL ? '1 file' : '—')}
        </td>
        <td style={styles.td}>
          {r.txValidated ? <span style={styles.badgeOk}>Verified</span> : <span style={styles.badgeWait}>Pending</span>}
        </td>
        <td style={{...styles.td, maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          <span title={r.transactionId || ''} style={styles.mono}>{r.transactionId || '—'}</span>
        </td>
        <td style={styles.td}>
          <button style={styles.btn} onClick={() => setOpen(v => !v)}>{open ? 'Hide' : 'Show'}</button>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={7} style={styles.detailsCell}>
            {/* Transaction Details */}
            <div style={styles.block}>
              <h4 style={styles.subtitle}>Transaction Details</h4>
              <div style={styles.line}><span style={styles.k}>Amount:</span> {r.amount || '—'}</div>
              <div style={styles.line}><span style={styles.k}>Currency:</span> {r.currency || '—'}</div>
              <div style={styles.line}><span style={styles.k}>Notes:</span> {r.notes || '—'}</div>
            </div>

            {/* Wallets */}
            <div style={styles.block}>
              <h4 style={styles.subtitle}>Safe Payment (Seller/Your Receiving)</h4>
              <div style={styles.line}><span style={styles.k}>Wallet Address:</span> <span className="mono" style={styles.mono} title={r.walletAddress}>{shorten(r.walletAddress)}</span></div>
              <div style={styles.line}><span style={styles.k}>Memo / Destination Tag:</span> <span className="mono" style={styles.mono}>{r.walletMemo || '—'}</span></div>
            </div>

            <div style={styles.block}>
              <h4 style={styles.subtitle}>Buyer Payment (Customer Pays)</h4>
              <div style={styles.line}><span style={styles.k}>Buyer Wallet:</span> <span className="mono" style={styles.mono} title={r.buyerWalletAddress}>{shorten(r.buyerWalletAddress)}</span></div>
              <div style={styles.line}><span style={styles.k}>Buyer Memo / Tag:</span> <span className="mono" style={styles.mono}>{r.buyerMemoTag || '—'}</span></div>
            </div>

            {/* Payment Verification */}
            <div style={styles.block}>
              <h4 style={styles.subtitle}>Payment Verification</h4>
              <div style={styles.line}><span style={styles.k}>Status:</span> {r.txValidated ? 'On-chain match (verified)' : 'Pending (awaiting on-chain match)'}</div>
              <div style={styles.line}><span style={styles.k}>TXID:</span> <span className="mono" style={styles.mono}>{r.transactionId || '—'}</span></div>
              <div style={styles.line}><span style={styles.k}>Verified At:</span> {r.verifiedAt?.toDate ? r.verifiedAt.toDate().toLocaleString() : '—'}</div>
            </div>

            {/* Uploaded Documents (auto-detect URL fields) */}
            {renderUploadedDocuments(r)}

            {/* Uploaded Contract */}
            {r.contractURL && (
              <div style={styles.block}>
                <h4 style={styles.subtitle}>Uploaded Contract</h4>
                <div><a href={r.contractURL} target="_blank" rel="noreferrer" style={styles.link}>View Contract / Download</a></div>
              </div>
            )}

            {/* Shipment Image(s) */}
            {renderShipmentImages(r)}
          </td>
        </tr>
      )}
    </>
  );
}

/** Try to mimic your old "Uploaded Documents" list:
 * We scan the transaction doc for any keys that look like URLs and match common freight-doc names.
 */
function renderUploadedDocuments(r) {
  const candid = Object.entries(r || {})
    .filter(([k,v]) => typeof v === 'string' && isUrl(v))
    .filter(([k]) => {
      const lk = k.toLowerCase();
      return (
        lk.includes('commercialinvoice') || lk.includes('invoice') ||
        lk.includes('packing') ||
        lk.includes('billoflading') || lk.includes('bol') ||
        lk.includes('insurance') ||
        lk.includes('certificateoforigin') || lk.includes('coo') ||
        lk.includes('inspection')
      );
    });

  if (candid.length === 0) return null;

  const nice = (k) => {
    const map = [
      ['commercialinvoice','Commercial Invoice'],
      ['invoice','Commercial Invoice'],
      ['packing','Packing List'],
      ['billoflading','Bill of Lading'],
      ['bol','Bill of Lading'],
      ['insurance','Insurance Certificate'],
      ['certificateoforigin','Certificate of Origin'],
      ['coo','Certificate of Origin'],
      ['inspection','Inspection Certificate'],
    ];
    const lk = k.toLowerCase();
    for (const [needle, label] of map) if (lk.includes(needle)) return label;
    return k;
  };

  return (
    <div style={styles.block}>
      <h4 style={styles.subtitle}>Uploaded Documents</h4>
      <ul style={styles.docList}>
        {candid.map(([k, url]) => (
          <li key={k}>
            {nice(k)}:&nbsp;
            <a href={url} target="_blank" rel="noreferrer" style={styles.link}>View / Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderShipmentImages(r) {
  const urls = [];
  // single fields
  ['shipmentImageUrl','shipmentPhotoUrl','imageUrl','photoUrl'].forEach(key => {
    if (typeof r[key] === 'string' && isUrl(r[key])) urls.push(r[key]);
  });
  // arrays
  if (Array.isArray(r.shipmentImages)) {
    r.shipmentImages.forEach(u => { if (typeof u === 'string' && isUrl(u)) urls.push(u); });
  }
  if (urls.length === 0) return null;

  return (
    <div style={styles.block}>
      <h4 style={styles.subtitle}>Shipment Image{urls.length>1?'s':''}</h4>
      <div style={styles.imgGrid}>
        {urls.map((u, i) => (
          <a key={i} href={u} target="_blank" rel="noreferrer" title={u}>
            <img src={u} alt={`Shipment ${i+1}`} style={styles.img} />
          </a>
        ))}
      </div>
    </div>
  );
}

function isUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

function countKnownDocs(r) {
  let n = 0;
  const keys = Object.keys(r || {});
  for (const k of keys) {
    const v = r[k];
    if (typeof v !== 'string') continue;
    if (!isUrl(v)) continue;
    const lk = k.toLowerCase();
    if (
      lk.includes('commercialinvoice') || lk.includes('invoice') ||
      lk.includes('packing') ||
      lk.includes('billoflading') || lk.includes('bol') ||
      lk.includes('insurance') ||
      lk.includes('certificateoforigin') || lk.includes('coo') ||
      lk.includes('inspection') ||
      lk.includes('contracturl') // count contract as a doc
    ) n++;
  }
  // array images don’t count toward “Docs” cell
  return n;
}






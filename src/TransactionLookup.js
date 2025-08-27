// src/TransactionLookup.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
import {
  doc, getDoc, collection, query, where, getDocs, updateDoc, Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const S = {
  page: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 1100, margin: '0 auto' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  h1: { margin: 0, fontSize: 24, fontWeight: 800 },
  row: { display: 'flex', gap: 8 },
  btn: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  danger: { padding: '8px 12px', borderRadius: 8, border: '1px solid #c00', background: '#f33', color: '#fff', cursor: 'pointer' },
  pilot: { margin:'8px 0 12px', padding:10, border:'1px solid #fde68a', background:'#fffbeb', borderRadius:10, color:'#92400e' },
  error: { margin:'12px 0', padding:10, border:'1px solid #fecaca', background:'#fef2f2', color:'#991b1b', borderRadius:10, whiteSpace:'pre-wrap' },

  card: { border:'1px solid #e5e7eb', borderRadius:12, background:'#fff' },
  tableWrap: { overflowX:'auto' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:14 },
  th: { textAlign:'left', padding:'10px 12px', borderBottom:'1px solid #e5e7eb', color:'#475569', whiteSpace:'nowrap' },
  td: { padding:'10px 12px', borderBottom:'1px solid #f1f5f9', verticalAlign:'top' },
  mono: { fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
  badgeOk: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#ecfdf5', color:'#047857', border:'1px solid #34d399', fontSize:12 },
  badgeWait: { display:'inline-block', padding:'4px 8px', borderRadius:999, background:'#fff7ed', color:'#9a3412', border:'1px solid #fbbf24', fontSize:12 },

  section: { border:'1px solid #e5e7eb', borderRadius:6, padding:10, marginTop:10, background:'#fff' },
  secTitle: { margin:'0 0 8px 0', fontWeight:800, fontSize:13, color:'#334155' },
  line: { margin:'4px 0' },
  k: { color:'#64748b' },
  link: { color:'#6d28d9', textDecoration:'underline', cursor:'pointer' },

  docList: { margin:0, paddingLeft:18 },
  imgGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:10, marginTop:8 },
  img: { width:'100%', height:140, objectFit:'cover', border:'1px solid #e5e7eb', borderRadius:6, background:'#fff' },

  ctlRow: { display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' },
  select: { padding:'6px 10px', border:'1px solid #ddd', borderRadius:6, background:'#fff' },
  small: { fontSize:12, opacity:.75 },
};

function shorten(s, head=10, tail=8) {
  if (!s) return '—';
  const str = String(s);
  if (str.length <= head + tail + 3) return str;
  return `${str.slice(0, head)}…${str.slice(-tail)}`;
}
function isUrl(s) {
  try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}
function explorerUrl(currency, txid) {
  if (!txid) return null;
  if (currency === 'XLM' || currency === 'USDC') return `https://stellar.expert/explorer/public/tx/${txid}`;
  if (currency === 'XRP') return `https://xrpscan.com/tx/${txid}`;
  return null;
}
const LABEL_MAP = {
  commercialinvoice: 'Commercial Invoice',
  invoice: 'Commercial Invoice',
  packing: 'Packing List',
  billoflading: 'Bill of Lading',
  bol: 'Bill of Lading',
  insurance: 'Insurance Certificate',
  certificateoforigin: 'Certificate of Origin',
  coo: 'Certificate of Origin',
  inspection: 'Inspection Certificate',
};
const IMG_KEYS_SINGLE = ['shipmentImageUrl','shipmentPhotoUrl','imageUrl','photoUrl'];

export default function TransactionLookup() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [trialCredits, setTrialCredits] = useState(0);
  const [plan, setPlan] = useState('');
  const [rows, setRows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [errText, setErrText] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const polls = useRef(0);

  const load = async (u) => {
    try {
      const uref = doc(db, 'users', u.uid);
      const usnap = await getDoc(uref);
      if (usnap.exists()) {
        const d = usnap.data();
        setHasPaid(!!d.hasPaid);
        setTrialCredits(d.trialCredits ?? 0);
        setPlan(d.plan || '');
      }
      const q = query(collection(db, 'transactions'), where('uid','==', u.uid));
      const qs = await getDocs(q);
      const list = qs.docs.map(s => ({ id: s.id, ...s.data() }));
      list.sort((a,b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
      setRows(list);
      if (!activeId && list.length) setActiveId(list[0].id);
      setErrText('');
    } catch (e) {
      console.error(e);
      setErrText(e?.message || 'Failed to load.');
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/login'); return; }
      setUser(u);
      await load(u);
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const t = setInterval(async () => {
      polls.current += 1;
      await load(user);
      if (polls.current >= 8) clearInterval(t);
    }, 15000);
    return () => clearInterval(t);
  }, [user]);

  const logout = async () => { await signOut(auth); navigate('/login'); };
  const allowAccess = hasPaid || trialCredits > 0 || plan === 'pilot';
  if (loading) return <div style={{textAlign:'center', marginTop:80}}>Loading…</div>;
  if (!allowAccess) {
    return (
      <div style={{ textAlign:'center', marginTop:80 }}>
        <h2>Access Restricted</h2>
        <p>You must complete payment to access this feature.</p>
        <button style={S.btn} onClick={() => navigate('/payment')}>Go to Payment</button>
      </div>
    );
  }

  const active = rows.find(r => r.id === activeId) || null;
  const setFieldOptimistic = async (txId, field, value) => {
    try {
      setSaving(true);
      // optimistic UI
      setRows(prev => prev.map(it => it.id === txId ? ({ ...it, [field]: value, updatedAt: Timestamp.now() }) : it));
      await updateDoc(doc(db,'transactions',txId), {
        [field]: value,
        updatedAt: Timestamp.now(),
        ...(field === 'buyerApprovalStatus' && value === 'Approved' ? { buyerApprovedAt: Timestamp.now() } : {})
      });
    } catch (e) {
      console.error('Update failed:', e);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.top}>
        <h1 style={S.h1}>Buyer Transaction Lookup</h1>
        <div style={S.row}>
          <button style={S.btn} onClick={() => navigate('/')}>Return Home</button>
          <button style={S.btn} onClick={() => user && load(user)}>Refresh</button>
          <button style={S.danger} onClick={logout}>Logout</button>
        </div>
      </div>

      {!hasPaid && (trialCredits > 0 || plan === 'pilot') && (
        <div style={S.pilot}>You’re on a <b>Free Pilot</b>. Lookup is enabled so you can validate documents for your shipment.</div>
      )}
      {errText && <div style={S.error}>{errText}</div>}

      {/* List */}
      <div style={S.card}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Select</th>
                <th style={S.th}>Date</th>
                <th style={S.th}>Currency</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Verified</th>
                <th style={S.th}>TXID</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td style={S.td} colSpan={6}>No transactions found yet.</td></tr>
              ) : rows.map(r => (
                <tr key={r.id} style={{ background: r.id === activeId ? '#f8fafc' : undefined }}>
                  <td style={S.td}><button style={S.btn} onClick={() => setActiveId(r.id)}>{r.id === activeId ? 'Viewing' : 'View'}</button></td>
                  <td style={S.td}>{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''}</td>
                  <td style={S.td}>{r.currency || '—'}</td>
                  <td style={S.td}>{r.amount || '—'}</td>
                  <td style={S.td}>{r.txValidated ? <span style={S.badgeOk}>Verified</span> : <span style={S.badgeWait}>Pending</span>}</td>
                  <td style={{...S.td, maxWidth:320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    <span style={S.mono} title={r.transactionId || ''}>{r.transactionId || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details */}
      {active && (
        <>
          <div style={S.section}>
            <h4 style={S.secTitle}>Transaction Details</h4>
            <div style={S.line}><span style={S.k}>Amount:</span> {active.amount || '—'}</div>
            <div style={S.line}><span style={S.k}>Currency:</span> {active.currency || '—'}</div>
            <div style={S.line}><span style={S.k}>Notes:</span> {active.notes || '—'}</div>
          </div>

          <div style={S.section}>
            <h4 style={S.secTitle}>Safe Payment (Seller/Your Receiving)</h4>
            <div style={S.ctlRow}>
              <div><span style={S.k}>Wallet Address:</span> <span style={S.mono} title={active.walletAddress}>{shorten(active.walletAddress)}</span></div>
              <button style={S.btn} onClick={() => copyToClipboard(active.walletAddress)}>Copy</button>
            </div>
            <div style={S.line}><span style={S.k}>Memo / Destination Tag:</span> <span style={S.mono}>{active.walletMemo || '—'}</span></div>
            <div style={S.small}>This is the monitored destination for matching your customer’s payment.</div>
          </div>

          <div style={S.section}>
            <h4 style={S.secTitle}>Buyer Payment (Customer Pays)</h4>
            <div style={S.line}><span style={S.k}>Buyer Wallet:</span> <span style={S.mono} title={active.buyerWalletAddress}>{shorten(active.buyerWalletAddress)}</span></div>
            <div style={S.line}><span style={S.k}>Buyer Memo / Tag:</span> <span style={S.mono}>{active.buyerMemoTag || '—'}</span></div>
          </div>

          <div style={S.section}>
            <h4 style={S.secTitle}>Payment Verification</h4>
            <div style={S.line}><span style={S.k}>Status:</span> {active.txValidated ? 'On-chain match (verified)' : 'Pending (awaiting on-chain match)'}</div>
            <div style={S.ctlRow}>
              <div><span style={S.k}>TXID:</span> <span style={S.mono}>{active.transactionId || '—'}</span></div>
              <button style={S.btn} onClick={() => copyToClipboard(active.transactionId || '')}>Copy</button>
              {!!explorerUrl(active.currency, active.transactionId) && (
                <a href={explorerUrl(active.currency, active.transactionId)} target="_blank" rel="noreferrer" style={S.btn}>Open in Explorer</a>
              )}
            </div>
            <div style={S.line}><span style={S.k}>Verified At:</span> {active.verifiedAt?.toDate ? active.verifiedAt.toDate().toLocaleString() : '—'}</div>
          </div>

          {renderUploadedDocuments(active)}

          {active.contractURL && (
            <div style={S.section}>
              <h4 style={S.secTitle}>Uploaded Contract</h4>
              <div><a href={active.contractURL} target="_blank" rel="noreferrer" style={S.link}>View Contract / Download</a></div>
            </div>
          )}

          {renderShipmentImages(active)}

          <div style={S.section}>
            <h4 style={S.secTitle}>Status & Approvals</h4>
            <div style={S.ctlRow}>
              <label htmlFor="docsApproval"><b>Documents Approval/Status:</b></label>
              <select
                id="docsApproval"
                style={S.select}
                value={active.docsApprovalStatus || 'Pending'}
                onChange={(e) => setFieldOptimistic(active.id, 'docsApprovalStatus', e.target.value)}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Needs Changes</option>
              </select>

              <label htmlFor="buyerApproval"><b>Buyer Approval/Status:</b></label>
              <select
                id="buyerApproval"
                style={S.select}
                value={active.buyerApprovalStatus || 'Pending'}
                onChange={(e) => setFieldOptimistic(active.id, 'buyerApprovalStatus', e.target.value)}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Disputed</option>
              </select>

              {saving ? <span style={S.small}>Saving…</span> : null}
            </div>

            <div style={{ marginTop:8 }}>
              <div style={S.line}><span style={S.k}>Seller Confirmation:</span> {active.sellerConfirmed ? 'Confirmed' : '—'}</div>
              <div style={S.line}><span style={S.k}>Confirmed By:</span> {active.sellerConfirmedBy || '—'}</div>
              <div style={S.line}><span style={S.k}>Confirmed/Updated At:</span> {active.confirmedAt?.toDate ? active.confirmedAt.toDate().toLocaleString() : '—'}</div>
            </div>
          </div>

          <div style={{ marginTop:10 }}>
            <button style={S.btn} onClick={() => user && load(user)}>Refresh Details</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function copyToClipboard(text) {
  if (!text) return;
  try { navigator.clipboard.writeText(text); } catch {}
}

/** Render freight docs from many possible shapes:
 * - top-level string fields ending with Url (and matching freighty names)
 * - nested objects: documents/docs/files/attachments
 * - arrays: documentUrls/docsList/filesList/attachments
 * - array items can be strings or objects with {url, name|label|type}
 */
function renderUploadedDocuments(r) {
  const items = [];

  const pushItem = (key, url, labelHint) => {
    if (!isUrl(url)) return;
    const lk = (key || '').toLowerCase();
    const mapped =
      LABEL_MAP[Object.keys(LABEL_MAP).find(k => lk.includes(k)) || ''] ||
      labelHint ||
      key ||
      'Document';
    items.push([mapped, url]);
  };

  // 1) Top-level *_Url fields (and other url-like keys)
  Object.entries(r || {}).forEach(([k, v]) => {
    if (typeof v === 'string' && isUrl(v)) {
      const lk = k.toLowerCase();
      const looksDoc =
        lk.endsWith('url') ||
        lk.includes('invoice') || lk.includes('packing') ||
        lk.includes('billoflading') || lk.includes('bol') ||
        lk.includes('insurance') || lk.includes('certificateoforigin') ||
        lk.includes('coo') || lk.includes('inspection');
      if (looksDoc && k !== 'contractURL' && !IMG_KEYS_SINGLE.includes(k)) {
        pushItem(k, v);
      }
    }
  });

  // 2) Common nested objects
  ['documents','docs','files','attachments'].forEach(bucket => {
    const obj = r?.[bucket];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.entries(obj).forEach(([k,v]) => {
        if (typeof v === 'string' && isUrl(v)) pushItem(k, v);
        if (v && typeof v === 'object') {
          const url = v.url || v.href;
          const name = v.name || v.label || v.type || k;
          if (url && isUrl(url)) pushItem(k, url, name);
        }
      });
    }
  });

  // 3) Common arrays
  ['documentUrls','docsList','filesList','attachments'].forEach(arrKey => {
    const arr = r?.[arrKey];
    if (Array.isArray(arr)) {
      arr.forEach((entry, idx) => {
        if (typeof entry === 'string' && isUrl(entry)) pushItem(`${arrKey}[${idx}]`, entry);
        if (entry && typeof entry === 'object') {
          const url = entry.url || entry.href;
          const name = entry.name || entry.label || entry.type || `${arrKey}[${idx}]`;
          if (url && isUrl(url)) pushItem(name, url, name);
        }
      });
    }
  });

  if (items.length === 0) return null;

  return (
    <div style={S.section}>
      <h4 style={S.secTitle}>Uploaded Documents</h4>
      <ul style={S.docList}>
        {items.map(([label, url], i) => (
          <li key={`${label}-${i}`}>
            {label}: <a href={url} target="_blank" rel="noreferrer" style={S.link}>View / Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderShipmentImages(r) {
  const urls = [];
  IMG_KEYS_SINGLE.forEach(k => { if (typeof r[k] === 'string' && isUrl(r[k])) urls.push(r[k]); });
  if (Array.isArray(r.shipmentImages)) {
    r.shipmentImages.forEach(u => { if (typeof u === 'string' && isUrl(u)) urls.push(u); });
  }
  if (urls.length === 0) return null;

  return (
    <div style={S.section}>
      <h4 style={S.secTitle}>Shipment Image{urls.length>1?'s':''}</h4>
      <div style={S.imgGrid}>
        {urls.map((u,i) => (
          <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt={`Shipment ${i+1}`} style={S.img} /></a>
        ))}
      </div>
    </div>
  );
}








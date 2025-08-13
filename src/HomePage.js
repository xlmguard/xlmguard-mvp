// HomePage.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

/* -----------------------------------------------------------
   CryptoTickerBar – CNBC/Bloomberg-style scrolling ticker
   - Shows XLM, XRP, USDC with live USD price + 24h change
   - Updates every 60s (CoinGecko)
   - Full-width marquee; CTA on the right
----------------------------------------------------------- */
function CryptoTickerBar({
  height = 38,
  bg = '#0d1b45',
  textColor = '#ffffff',
  accent = '#2d3e86',
  speedSec = 24,        // lower = faster
  ctaHref = '/instructions',
  showCTA = true,
}) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const fetchPrices = async () => {
    try {
      setErr('');
      const url =
        'https://api.coingecko.com/api/v3/simple/price' +
        '?ids=stellar,ripple,usd-coin&vs_currencies=usd&include_24hr_change=true';
      const r = await fetch(url, { headers: { accept: 'application/json' } });
      if (!r.ok) throw new Error('Price upstream error');
      const j = await r.json();
      setData({
        XLM: { usd: j.stellar?.usd, chg: j.stellar?.usd_24h_change },
        XRP: { usd: j.ripple?.usd, chg: j.ripple?.usd_24h_change },
        USDC: { usd: j['usd-coin']?.usd, chg: j['usd-coin']?.usd_24h_change },
        fetchedAt: Date.now(),
      });
    } catch (e) {
      setErr('Live prices temporarily unavailable');
    }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60_000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    const fmt = (n, d = 4) => (Number.isFinite(n) ? n : 0).toFixed(d);
    const chip = (v) => {
      const up = (v ?? 0) >= 0;
      return (
        <span
          style={{
            marginLeft: 8,
            padding: '2px 6px',
            borderRadius: 999,
            background: up ? 'rgba(16,160,44,.18)' : 'rgba(176,0,32,.18)',
            color: up ? '#11a52f' : '#ff4d4f',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {up ? '▲' : '▼'} {(v ?? 0).toFixed(2)}%
        </span>
      );
    };
    const row = (sym, v) => (
      <div key={sym} style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>{sym}</span>
        <span style={{ marginLeft: 10, fontVariantNumeric: 'tabular-nums', opacity: 0.95 }}>
          ${fmt(v.usd, sym === 'USDC' ? 4 : 4)}
        </span>
        {chip(v.chg)}
      </div>
    );
    return [row('XLM', data.XLM), row('XRP', data.XRP), row('USDC', data.USDC)];
  }, [data]);

  const track = useMemo(() => [...items, ...(items.length ? items : [])], [items]);

  return (
    <div
      role="region"
      aria-label="Live crypto prices"
      style={{
        width: '100%',
        height,
        background: bg,
        color: textColor,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${accent}`,
      }}
    >
      {showCTA && (
        <a
          href={ctaHref}
          style={{
            position: 'absolute',
            right: 8,
            top: 6,
            zIndex: 2,
            background: accent,
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 12,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Protect Your Transfer →
        </a>
      )}

      {err && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 14,
            opacity: 0.9,
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          position: 'absolute',
          left: 0,
          top: 0,
          height,
          padding: '0 14px',
          animation: `xt-marquee ${speedSec}s linear infinite`,
          paddingRight: 160, // leave space for CTA
        }}
      >
        {track.length
          ? track.map((el, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                {el}
                <span style={{ opacity: 0.3 }}>•</span>
              </div>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 120,
                  height: 10,
                  background: 'rgba(255,255,255,.15)',
                  borderRadius: 6,
                }}
              />
            ))}
      </div>

      <style>{`
        @keyframes xt-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 480px) {
          a[href="${ctaHref}"] { display: none; }
        }
      `}</style>
    </div>
  );
}
/* ----------------------- end CryptoTickerBar ----------------------- */

function HomePage() {
  const [language, setLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const [xlmPrice, setXlmPrice] = useState(null);
  const [xrpPrice, setXrpPrice] = useState(null);
  const [usdcPrice, setUsdcPrice] = useState(null);

  const [xlmTrades, setXlmTrades] = useState([]);
  const [xrpTrades, setXrpTrades] = useState([]);
  const [usdcTrades, setUsdcTrades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserRole(data.role || 'Unknown');
          setUserName(data.name || user.displayName || user.email);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=stellar,stellar-lumens,ripple,usd-coin&vs_currencies=usd'
        );
        const data = await res.json();
        setXlmPrice(data['stellar-lumens']?.usd || data['stellar']?.usd || 'N/A');
        setXrpPrice(data['ripple']?.usd || 'N/A');
        setUsdcPrice(data['usd-coin']?.usd || 'N/A');
      } catch (err) {
        console.error('Error fetching prices:', err);
        setXlmPrice('N/A');
        setXrpPrice('N/A');
        setUsdcPrice('N/A');
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // -------- XLM/USD --------
        const resXLM = await fetch('https://api.kraken.com/0/public/Trades?pair=XXLMZUSD', { cache: 'no-store' });
        const dataXLM = await resXLM.json();
        if (dataXLM.result) {
          const key = Object.keys(dataXLM.result)[0];
          if (key && Array.isArray(dataXLM.result[key])) {
            setXlmTrades(
              dataXLM.result[key].slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XLM Buy' }))
            );
          }
        }

        // -------- XRP/USD --------
        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD', { cache: 'no-store' });
        const dataXRP = await resXRP.json();
        if (dataXRP.result) {
          const key = Object.keys(dataXRP.result)[0];
          if (key && Array.isArray(dataXRP.result[key])) {
            setXrpTrades(
              dataXRP.result[key].slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XRP Buy' }))
            );
          }
        }

        // -------- USDC/USD --------
        const resUSDC = await fetch('https://api.kraken.com/0/public/Trades?pair=USDCUSD', { cache: 'no-store' });
        const dataUSDC = await resUSDC.json();
        if (dataUSDC.result) {
          const key = Object.keys(dataUSDC.result)[0];
          if (key && Array.isArray(dataUSDC.result[key])) {
            setUsdcTrades(
              dataUSDC.result[key].slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'USDC Buy' }))
            );
          }
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 120000); // refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.hasPaid) {
          navigate('/submit');
        } else {
          navigate('/payment');
        }
      } else {
        navigate('/payment');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      navigate('/payment');
    }
  };

  const descriptions = {
    English:
      'XLMGuard protects your XLM, XRP, and Stablecoin transactions with timestamped transaction verification and secure seller confirmations.',
  };

  // Build the composite ticker, now including USDC trades
  const allTrades = [...xlmTrades, ...xrpTrades, ...usdcTrades];
  const tickerContent =
    allTrades.length > 0 ? (
      allTrades.map((t, i) => (
        <span key={i} style={{ display: 'inline-block', padding: '0 2rem' }}>
          {t.side}: {t.volume} @ ${t.price}
        </span>
      ))
    ) : (
      <span style={{ padding: '0 2rem' }}>Loading latest trades...</span>
    );

  return (
    <div
      style={{
        textAlign: 'center',
        backgroundImage: 'url("/earthbackgrownd.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
      }}
    >
      <Helmet>
        <title>XLMGuard – Secure XLM, XRP & Stablecoin Transactions</title>
        <meta
          name="description"
          content="Secure your Stellar (XLM), XRP, and Stablecoin transactions with XLMGuard—blockchain-based escrow and payment verification you can trust."
        />
        <link rel="canonical" href="https://xlmguard.com/" />
      </Helmet>

      <nav
        style={{
          background: 'linear-gradient(to right, #0f0f0f, #1a1a1a)',
          borderBottom: '1px solid #333',
          padding: '1rem 1rem 2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <img
          src="/logo.png"
          alt="XLMGuard Logo"
          style={{ height: '140px', filter: 'drop-shadow(0 0 10px #00f2ff)', marginBottom: '0.5rem' }}
        />
        <div
          style={{ position: 'absolute', left: '10px', top: '20px', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: 'white', margin: '4px 0' }}></div>
        </div>
        <div
          style={{
            maxHeight: menuOpen ? '400px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0.5rem',
          }}
        >
          <a href="https://escrow.xlmguard.com" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Escrow
          </a>
          <Link to="/faq" style={{ margin: '0.25rem 0', color: '#fff' }}>
            FAQ
          </Link>
          <Link to="/contact" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Contact Us
          </Link>
          <Link to="/seller-confirm" style={{ margin: '0.25rem 0', color: '#fff' }}>
            Seller Panel
          </Link>
          <Link to="/instructions" style={{ margin: '0.25rem 0', color: '#fff' }}>
            User Instructions
          </Link>
        </div>
        {currentUser && (
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#007BFF',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
            onClick={handleLogout}
          >
            {userName?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </nav>

      {/* NEW: Rolling, stock-market-style ticker bar */}
      <CryptoTickerBar ctaHref="/instructions" speedSec={24} />

      <main style={{ paddingTop: '10px' }}>
        <h1 style={{ marginTop: '0', marginBottom: '10px' }}>
          XLMGuard<sup style={{ fontSize: '0.5em' }}>™</sup>
        </h1>
        <p>{descriptions[language]}</p>
        <p>
          <strong>XLM:</strong> {xlmPrice} | <strong>XRP:</strong> {xrpPrice} | <strong>USDC:</strong> {usdcPrice}
        </p>

        {/* Existing trades marquee (kept as-is) */}
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#000', padding: '10px 0', color: '#0f0' }}>
          <div style={{ display: 'inline-block', animation: 'scroll-left 360s linear infinite' }}>
            {tickerContent}
          </div>
        </div>

        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>

        {!currentUser && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')} style={{ marginLeft: '1rem' }}>
              Login
            </button>
          </div>
        )}

        {currentUser && userRole === 'buyer' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/transaction-lookup')}>Buyer Transaction Lookup</button>
            <button onClick={handleSubmitTransaction} style={{ marginLeft: '1rem' }}>
              Submit Transaction
            </button>
          </div>
        )}

        {currentUser && userRole === 'seller' && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => navigate('/seller-confirm')}>Seller Shipment Confirmation</button>
          </div>
        )}
      </main>

      <footer
        style={{
          marginTop: '3rem',
          padding: '1rem 0',
          fontSize: '0.8rem',
          color: '#777',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderTop: '1px solid #ddd',
        }}
      >
        &copy; {new Date().getFullYear()} XLMGuard.com – All rights reserved. <br />
        <em>Patent Pending</em>
      </footer>
    </div>
  );
}

export default HomePage;

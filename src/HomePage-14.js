// HomePage.js – Final Working Version with Fixed Schema Injection
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

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
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar,stellar-lumens,ripple,usd-coin&vs_currencies=usd');
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
        const resXLM = await fetch('https://api.kraken.com/0/public/Trades?pair=XXLMZUSD');
        const dataXLM = await resXLM.json();
        if (dataXLM.result?.XXLMZUSD) {
          setXlmTrades(dataXLM.result.XXLMZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XLM Buy' })));
        }
        const resXRP = await fetch('https://api.kraken.com/0/public/Trades?pair=XXRPZUSD');
        const dataXRP = await resXRP.json();
        if (dataXRP.result?.XXRPZUSD) {
          setXrpTrades(dataXRP.result.XXRPZUSD.slice(-10).map(t => ({ price: t[0], volume: t[1], side: 'XRP Buy' })));
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 120000);
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
    English: 'XLMGuard protects your XLM, XRP, and Stablecoin transactions with timestamped transaction verification and secure seller confirmations.'
  };

  const allTrades = [...xlmTrades, ...xrpTrades];
  const tickerContent = allTrades.length > 0
    ? allTrades.map((t, i) => (
        <span key={i} style={{ display: 'inline-block', padding: '0 2rem' }}>
          {t.side}: {t.volume} @ ${t.price}
        </span>
      ))
    : <span style={{ padding: '0 2rem' }}>Loading latest trades...</span>;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "XLMGuard",
    "url": "https://xlmguard.com",
    "logo": "https://xlmguard.com/logo.png",
    "sameAs": ["https://www.linkedin.com/company/xlmguard"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-980-297-8055",
      "contactType": "Customer Service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Charlotte",
      "addressRegion": "NC",
      "addressCountry": "US"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "XLMGuard Escrow Service",
    "description": "Blockchain-based escrow and payment verification for international crypto transactions using XLM, XRP, and stablecoins.",
    "brand": {
      "@type": "Brand",
      "name": "XLMGuard"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "100",
      "url": "https://xlmguard.com"
    },
    "areaServed": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    },
    "keywords": [
      "crypto escrow",
      "cross-border crypto",
      "xrp escrow",
      "international crypto payments",
      "stablecoin escrow",
      "crypto purchasing department",
      "stellar escrow service",
      "blockchain escrow"
    ]
  };

  return (
    <div style={{ textAlign: 'center', backgroundImage: 'url("/earthbackgrownd.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', backgroundAttachment: 'fixed' }}>
      <Helmet>
        <title>XLMGuard – Secure XLM, XRP & Stablecoin Transactions</title>
        <meta name="description" content="Secure your Stellar (XLM), XRP, and Stablecoin transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." />
        <link rel="canonical" href="https://xlmguard.com/" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {/* The rest of your layout JSX follows here (nav, content, footer) */}
    </div>
  );
}

export default HomePage;

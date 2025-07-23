// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

function HomePage() {
const \[language, setLanguage] = useState('English');
const \[currentUser, setCurrentUser] = useState(null);
const \[userRole, setUserRole] = useState(null);
const \[userName, setUserName] = useState('');
const \[menuOpen, setMenuOpen] = useState(false);
const \[xlmPrice, setXlmPrice] = useState(null);
const \[xrpPrice, setXrpPrice] = useState(null);
const \[xlmTrades, setXlmTrades] = useState(\[]);
const \[xrpTrades, setXrpTrades] = useState(\[]);

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
}, \[]);

useEffect(() => {
const fetchPrices = async () => {
try {
const res = await fetch('[https://api.coingecko.com/api/v3/simple/price?ids=stellar,stellar-lumens,ripple\&vs\_currencies=usd](https://api.coingecko.com/api/v3/simple/price?ids=stellar,stellar-lumens,ripple&vs_currencies=usd)');
const data = await res.json();
setXlmPrice(data\['stellar-lumens']?.usd || data\['stellar']?.usd || 'N/A');
setXrpPrice(data\['ripple']?.usd || 'N/A');
} catch (err) {
console.error('Error fetching prices:', err);
setXlmPrice('N/A');
setXrpPrice('N/A');
}
};
fetchPrices();
}, \[]);

useEffect(() => {
const fetchTrades = async () => {
try {
const resXLM = await fetch('[https://api.kraken.com/0/public/Trades?pair=XXLMZUSD](https://api.kraken.com/0/public/Trades?pair=XXLMZUSD)');
const dataXLM = await resXLM.json();
if (dataXLM.result?.XXLMZUSD) {
setXlmTrades(dataXLM.result.XXLMZUSD.slice(-10).map(t => ({ price: t\[0], volume: t\[1], side: 'XLM Buy' })));
}
const resXRP = await fetch('[https://api.kraken.com/0/public/Trades?pair=XXRPZUSD](https://api.kraken.com/0/public/Trades?pair=XXRPZUSD)');
const dataXRP = await resXRP.json();
if (dataXRP.result?.XXRPZUSD) {
setXrpTrades(dataXRP.result.XXRPZUSD.slice(-10).map(t => ({ price: t\[0], volume: t\[1], side: 'XRP Buy' })));
}
} catch (err) {
console.error('Error fetching trades:', err);
}
};
fetchTrades();
const interval = setInterval(fetchTrades, 120000);
return () => clearInterval(interval);
}, \[]);

const handleLogout = async () => {
try {
await signOut(auth);
window\.location.href = '/';
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
English: 'XLMGuard protects your XLM and XRP transactions with timestamped transaction verification and secure seller confirmations.'
};

const allTrades = \[...xlmTrades, ...xrpTrades];
const tickerContent = allTrades.length > 0
? allTrades.map((t, i) => (
\<span key={i} style={{ display: 'inline-block', padding: '0 2rem' }}>
{t.side}: {t.volume} @ \${t.price} </span>
))
: \<span style={{ padding: '0 2rem' }}>Loading latest trades...</span>;

return ( <div> <Helmet> <title>XLMGuard – Secure Your XLM and XRP Transactions</title> <meta name="description" content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." /> <link rel="canonical" href="https://xlmguard.com/" /> <script type="application/ld+json">{`           {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "XLMGuard",
            "url": "https://xlmguard.com",
            "applicationCategory": "FinancialApplication",
            "operatingSystem": "All",
            "browserRequirements": "Requires JavaScript and modern browser",
            "description": "XLMGuard is a secure blockchain escrow and transaction verification platform for XLM and XRP, enabling trusted peer-to-peer exchanges globally.",
            "featureList": "Escrow Protection, Stellar (XLM) and XRP Payment Validation, Seller Document Verification, Secure Multi-Asset Transfers",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "48"
            },
            "offers": {
              "@type": "Offer",
              "price": "10",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://xlmguard.com/register"
            },
            "author": {
              "@type": "Organization",
              "name": "XLMGuard",
              "url": "https://xlmguard.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "XLMGuard"
            },
            "applicationSuite": "XLMGuard Platform",
            "softwareHelp": "https://xlmguard.com/instructions",
            "inLanguage": ["en", "es", "de", "fr", "ar", "zh", "ru", "pt", "hi", "ja"],
            "areaServed": [
              {"@type": "Country", "name": "United States"},
              {"@type": "Country", "name": "Mexico"},
              {"@type": "Country", "name": "Germany"},
              {"@type": "Country", "name": "France"},
              {"@type": "Country", "name": "China"},
              {"@type": "Country", "name": "India"},
              {"@type": "Country", "name": "Brazil"},
              {"@type": "Country", "name": "United Arab Emirates"},
              {"@type": "Country", "name": "Japan"},
              {"@type": "Country", "name": "Russia"}
            ]
          }
        `}</script> </Helmet>

```
  {/* ... rest of the JSX content remains unchanged ... */}
</div>
```

);
}

export default HomePage;

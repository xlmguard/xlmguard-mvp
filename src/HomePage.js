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

const schemaData = {
"@context": "[https://schema.org](https://schema.org)",
"@graph": \[
{
"@type": "Organization",
"name": "XLMGuard",
"url": "[https://xlmguard.com/](https://xlmguard.com/)",
"logo": "[https://xlmguard.com/logo.png](https://xlmguard.com/logo.png)",
"description": "A global blockchain-based escrow and crypto transaction verification platform for XLM and XRP.",
"sameAs": \[
"[https://twitter.com/xlmguard](https://twitter.com/xlmguard)",
"[https://linkedin.com/company/xlmguard](https://linkedin.com/company/xlmguard)"
],
"location": {
"@type": "Place",
"address": {
"@type": "PostalAddress",
"addressLocality": "Charlotte",
"addressRegion": "NC",
"addressCountry": "US"
}
}
},
{
"@type": "WebApplication",
"name": "XLMGuard Platform",
"applicationCategory": "FinancialApplication",
"operatingSystem": "All",
"url": "[https://xlmguard.com/](https://xlmguard.com/)",
"softwareHelp": "[https://xlmguard.com/instructions](https://xlmguard.com/instructions)",
"featureList": "Escrow Protection, Stellar (XLM) and XRP Payment Validation, Seller Document Verification, Secure Multi-Asset Transfers",
"offers": {
"@type": "Offer",
"price": "10",
"priceCurrency": "USD",
"availability": "[https://schema.org/InStock](https://schema.org/InStock)",
"url": "[https://xlmguard.com/register](https://xlmguard.com/register)"
},
"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4.9",
"reviewCount": "48"
},
"inLanguage": \["en", "es", "de", "fr", "ar", "zh", "ru", "pt", "hi", "ja"]
}
]
};

return (
\<div style={{ textAlign: 'center', backgroundImage: 'url("/earthbackgrownd.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', backgroundAttachment: 'fixed' }}> <Helmet> <title>XLMGuard – Secure Your XLM and XRP Transactions</title> <meta name="description" content="Secure your Stellar (XLM) and XRP transactions with XLMGuard—blockchain-based escrow and payment verification you can trust." /> <link rel="canonical" href="https://xlmguard.com/" /> <script type="application/ld+json">{JSON.stringify(schemaData)}</script> </Helmet>
{/\* ... existing JSX continues here ... \*/} </div>
);
}

export default HomePage;






// FAQPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [language, setLanguage] = useState('en');

  const faqContent = {
    en: {
      heading: 'Frequently Asked Questions (FAQ)',
      content: `
<h2>What is XLMGuard?</h2>
<p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It’s designed to add an extra layer of trust and security to transactions—especially in peer-to-peer payments, sales, or where trust needs to be off‑chain verified.</p>

<h2>🔑 How XLMGuard Works</h2>
<ul>
  <li><strong>Initiating a transaction:</strong> The sender creates a payment request via XLMGuard.</li>
  <li><strong>Holding funds:</strong> The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.</li>
  <li><strong>Verification:</strong> XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.</li>
  <li><strong>Release or refund:</strong> Once conditions are met, funds are automatically released, or refunded if something goes wrong.</li>
</ul>

<h2>🌟 What Makes It Unique?</h2>
<ul>
  <li><strong>Cross‑chain support:</strong> It works with both XLM and XRP, which is less common—most escrow services target only one network.</li>
  <li><strong>Off‑chain verification:</strong> XLMGuard isn't just multisig—it can include external confirmations or approvals before releasing funds.</li>
  <li><strong>Transaction integrity:</strong> It prevents fraud and mistakes by enforcing pre-set terms in escrow, rather than trust-based or manual release.</li>
  <li><strong>Designed for real-world use cases:</strong> It’s tailor-made for things like marketplace sales, freelance work, or escrow-type transactions, not simply holding keys safely.</li>
</ul>

<h2>✅ Conclusion: A Unique Position in XLM Transactions?</h2>
<p>Yes—XLMGuard stands out because it:</p>
<ul>
  <li>Acts as a non-custodial escrow and payment verifier,</li>
  <li>Works across both Stellar and Ripple networks,</li>
  <li>Utilizes blockchain features enriched with off-chain logic,</li>
  <li>Shields users from counterpart risk by automating condition-based releases.</li>
</ul>

<p>It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions. That's its unique niche.</p>
      `
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        color: 'black',
        backgroundImage: 'url("/earth background.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ width: '210px', marginBottom: '20px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
        </select>
      </div>

      <h2>{faqContent[language].heading}</h2>
      <div dangerouslySetInnerHTML={{ __html: faqContent[language].content }} />

      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ fontSize: '16px', color: 'blue', textDecoration: 'underline' }}>← Return to Home Page</Link>
      </div>
    </div>
  );
};

export default FAQPage;





















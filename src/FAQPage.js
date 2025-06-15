import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FAQPage() {
  const [language, setLanguage] = useState('English');

  const translations = {
    English: 'Frequently Asked Questions (FAQ)',
    French: 'Questions Fréquemment Posées (FAQ)',
    Spanish: 'Preguntas Frecuentes (FAQ)',
    German: 'Häufig Gestellte Fragen (FAQ)',
    Chinese: '常见问题解答（FAQ）',
    Arabic: 'الأسئلة الشائعة (FAQ)',
    Hindi: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)'
  };

  const faqs = {
    English: (
      <div>
        <h2>What is XLMGuard?</h2>
        <p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP...</p>
        <h3>🔑 How XLMGuard Works</h3>
        <ul>
          <li><strong>Initiating a transaction:</strong> The sender creates a payment request via XLMGuard.</li>
          <li><strong>Holding funds:</strong> The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.</li>
          <li><strong>Verification:</strong> XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.</li>
          <li><strong>Release or refund:</strong> Once conditions are met, funds are automatically released, or refunded if something goes wrong.</li>
        </ul>
        <h3>🌟 What Makes It Unique?</h3>
        <ul>
          <li><strong>Cross‑chain support:</strong> It works with both XLM and XRP, which is less common—most escrow services target only one network.</li>
          <li><strong>Off‑chain verification:</strong> XLMGuard isn't just multisig—it can include external confirmations or approvals before releasing funds.</li>
          <li><strong>Transaction integrity:</strong> It prevents fraud and mistakes by enforcing pre-set terms in escrow, rather than trust-based or manual release.</li>
          <li><strong>Designed for real-world use cases:</strong> It’s tailor-made for things like marketplace sales, freelance work, or escrow-type transactions, not simply holding keys safely.</li>
        </ul>
        <h3>✅ Conclusion: A Unique Position in XLM Transactions?</h3>
        <p>Yes—XLMGuard stands out because it:</p>
        <ul>
          <li>Acts as a non-custodial escrow and payment verifier</li>
          <li>Works across both Stellar and Ripple networks</li>
          <li>Utilizes blockchain features enriched with off-chain logic</li>
          <li>Shields users from counterpart risk by automating condition-based releases</li>
        </ul>
        <p>It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions. That's its unique niche.</p>
      </div>
    )
  };

  const allLanguages = Object.keys(translations);

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.6' }}>
      <h1 style={{ textAlign: 'center' }}>{translations[language]}</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div>{faqs['English']}</div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Return to Home Page</button>
        </Link>
      </div>
    </div>
  );
}

export default FAQPage;



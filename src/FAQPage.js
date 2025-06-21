// --- FAQPage.js (Updated with dark overlay and better contrast) ---
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FAQPage() {
  const [language, setLanguage] = useState('English');

  const translations = {
    English: 'Frequently Asked Questions (FAQ)',
    Arabic: 'الأسئلة الشائعة (FAQ)',
    Chinese: '常见问题解答（FAQ）',
    French: 'Questions Fréquemment Posées (FAQ)',
    Spanish: 'Preguntas Frecuentes (FAQ)',
    German: 'Häufig Gestellte Fragen (FAQ)',
    Hindi: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    Portuguese: 'Perguntas Frequentes (FAQ)',
    Japanese: 'よくある質問 (FAQ)',
    Korean: '자주 묻는 질문 (FAQ)'
  };

  const content = `
    <h2>What is XLMGuard?</h2>
    <p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP...</p>
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
    <p>It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions.</p>
  `;

  const faqs = Object.fromEntries(
    Object.keys(translations).map(lang => [lang, <div dangerouslySetInnerHTML={{ __html: content }} />])
  );

  const allLanguages = Object.keys(translations);

  return (
    <div style={{
      backgroundImage: "url('/earthbackgrownd.png')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '40px',
        maxWidth: '900px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.6'
      }}>
        <h1 style={{ textAlign: 'center' }}>{translations[language]}</h1>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <label htmlFor="language">Select Language: </label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {allLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>{faqs[language]}</div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/">
            <button style={{ padding: '10px 20px', fontSize: '16px' }}>Return to Home Page</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;















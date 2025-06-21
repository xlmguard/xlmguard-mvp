// --- AboutPage.js (Fixed missing content, fallback, and background) ---
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      heading: 'About XLMGuard',
      body: 'XLMGuard is a blockchain-based service that protects your Stellar (XLM) and XRP transactions using escrow and verification. It ensures trust in peer-to-peer payments, business transactions, and more. By using both on-chain and off-chain methods, XLMGuard ensures a secure and reliable transaction process.'
    },
    ja: {
      heading: 'XLMGuardについて',
      body: 'XLMGuardは、エスクローと検証を使用してStellar（XLM）およびXRPのトランザクションを保護するブロックチェーンサービスです。ピアツーピアの支払い、ビジネストランザクションなどに信頼性を提供します。'
    },
    // Add other language entries here
  };

  const selectedContent = content[language] || content['en'];

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      backgroundImage: "url('/earthbackgrownd.png')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <img
          src="/logo.png"
          alt="XLMGuard Logo"
          style={{ width: '210px', marginBottom: '20px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select
          id="lang"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ color: 'black' }}
        >
          <option value="en">English</option>
          <option value="ja">Japanese</option>
          {/* Add others */}
        </select>
      </div>

      <h2>{selectedContent.heading}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{selectedContent.body}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default AboutPage;






import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: { heading: 'About XLMGuard', body: `XLMGuard is a blockchain-based transaction protection service...` },
    es: { heading: 'Acerca de XLMGuard', body: `XLMGuard es un servicio de protección de transacciones...` },
    fr: { heading: 'À propos de XLMGuard', body: `XLMGuard est un service de protection des transactions...` },
    zh: { heading: '关于 XLMGuard', body: `XLMGuard 是一个基于区块链的交易保护服务...` },
    ja: { heading: 'XLMGuardについて', body: `XLMGuardはStellarとXRPブロックチェーンを利用した...` },
    de: { heading: 'Über XLMGuard', body: `XLMGuard ist ein blockchain-basierter Transaktionsschutzdienst...` },
    it: { heading: 'Informazioni su XLMGuard', body: `XLMGuard è un servizio di protezione delle transazioni...` },
    hi: { heading: 'XLMGuard के बारे में', body: `XLMGuard एक ब्लॉकचेन-आधारित लेनदेन सुरक्षा सेवा है...` }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      <img
        src="/logo.png"
        alt="XLMGuard Logo"
        style={{ width: '210px', marginBottom: '20px' }}
      />

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <h2>{content[language].heading}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{content[language].body}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default AboutPage;


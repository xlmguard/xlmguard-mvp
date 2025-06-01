// HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const translations = {
  en: "Protect your XLM and XRP transactions from fraud with our secure transaction verification and protection system. Our service ensures that your payments are verified, logged, and can be validated anytime.",
  ja: "安全な取引検証と保護システムでXLMおよびXRPの取引を詐欺から守ります。支払いが確認され、記録され、いつでも検証できることを保証します。",
  ko: "안전한 거래 검증 및 보호 시스템으로 XLM 및 XRP 거래를 사기로부터 보호하세요. 당사의 서비스는 결제가 확인되고, 기록되며, 언제든지 검증될 수 있도록 보장합니다.",
  pt: "Proteja suas transações de XLM e XRP contra fraudes com nosso sistema seguro de verificação e proteção de transações. Nosso serviço garante que seus pagamentos sejam verificados, registrados e possam ser validados a qualquer momento.",
  zh: "通过我们安全的交易验证和保护系统，保护您的XLM和XRP交易免受欺诈。我们的服务确保您的付款已验证、已记录，并且可以随时验证。"
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isReady) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <img src="/logo.png" alt="XLMGuard Logo" style={{ width: 185, marginBottom: 20 }} />
      <h1>Welcome to XLMGuard</h1>
      <p>{translations[language]}</p>
      <div style={{ margin: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Register
        </button>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px' }}>
          Login
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="en">English</option>
          <option value="ja">日本語 (Japanese)</option>
          <option value="ko">한국어 (Korean)</option>
          <option value="pt">Português</option>
          <option value="zh">中文 (Chinese)</option>
        </select>
      </div>
    </div>
  );
};

export default HomePage;










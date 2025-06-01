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
  zh: "通过我们安全的交易验证和保护系统，保护您的XLM和XRP交易免受欺诈。我们的服务确保您的付款已验证、已记录，并且可以随时验证。",
  ru: "Защитите свои транзакции XLM и XRP от мошенничества с помощью нашей безопасной системы проверки и защиты транзакций. Наш сервис гарантирует, что ваши платежи будут проверены, зафиксированы и могут быть подтверждены в любое время.",
  es: "Proteja sus transacciones XLM y XRP contra fraudes con nuestro sistema seguro de verificación y protección de transacciones. Nuestro servicio garantiza que sus pagos estén verificados, registrados y puedan validarse en cualquier momento.",
  fr: "Protégez vos transactions XLM et XRP contre la fraude grâce à notre système sécurisé de vérification et de protection des transactions. Notre service garantit que vos paiements sont vérifiés, enregistrés et peuvent être validés à tout moment.",
  hi: "हमारी सुरक्षित लेन-देन सत्यापन और सुरक्षा प्रणाली के साथ अपनी XLM और XRP लेन-देन को धोखाधड़ी से बचाएं। हमारी सेवा यह सुनिश्चित करती है कि आपके भुगतान सत्यापित, दर्ज और किसी भी समय मान्य किए जा सकें।",
  ar: "قم بحماية معاملات XLM و XRP الخاصة بك من الاحتيال باستخدام نظام التحقق والحماية الآمن الخاص بنا. تضمن خدمتنا التحقق من مدفوعاتك وتسجيلها ويمكن التحقق منها في أي وقت."
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '中文 (Chinese)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ar', label: 'العربية (Arabic)' }
  // More can be added progressively
];

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
      <img src="/logo.png" alt="XLMGuard Logo" style={{ width: 260, marginBottom: 20 }} />
      <h1>Welcome to XLMGuard</h1>
      <p>{translations[language] || translations['en']}</p>
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
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default HomePage;











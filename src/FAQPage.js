// Full multilingual FAQPage.js with Swahili added.
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
    Hindi: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    Portuguese: 'Perguntas Frequentes (FAQ)',
    Japanese: 'よくある質問 (FAQ)',
    Korean: '자주 묻는 질문 (FAQ)',
    Italian: 'Domande Frequenti (FAQ)',
    Lingala: 'Mituna mingi ya kotunaka (FAQ)',
    Swahili: 'Maswali Yanayoulizwa Mara kwa Mara (FAQ)'
  };

  const faqs = {
    English: <div><h2>What is XLMGuard?</h2><p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP...</p></div>,
    Spanish: <div><h2>¿Qué es XLMGuard?</h2><p>XLMGuard es un servicio de verificación de pagos y depósito en garantía basado en blockchain...</p></div>,
    French: <div><h2>Qu'est-ce que XLMGuard ?</h2><p>XLMGuard est un service basé sur la blockchain pour le séquestre et la vérification des paiements, conçu pour Stellar (XLM) et XRP...</p></div>,
    German: <div><h2>Was ist XLMGuard?</h2><p>XLMGuard ist ein blockchain-basierter Treuhand- und Zahlungsprüfungsdienst für Stellar (XLM) und XRP...</p></div>,
    Chinese: <div><h2>XLMGuard 是什么？</h2><p>XLMGuard 是一个基于区块链的托管和支付验证服务，适用于 Stellar (XLM) 和 XRP...</p></div>,
    Arabic: <div><h2>ما هو XLMGuard؟</h2><p>XLMGuard هو خدمة قائمة على البلوكشين للتحقق من الدفع والحجز لكل من Stellar (XLM) و XRP...</p></div>,
    Hindi: <div><h2>XLMGuard क्या है?</h2><p>XLMGuard एक ब्लॉकचेन-आधारित एस्क्रो और भुगतान सत्यापन सेवा है जो Stellar (XLM) और XRP के लिए बनाई गई है...</p></div>,
    Portuguese: <div><h2>O que é o XLMGuard?</h2><p>O XLMGuard é um serviço baseado em blockchain de verificação de pagamentos e custódia para Stellar (XLM) e XRP...</p></div>,
    Japanese: <div><h2>XLMGuardとは何ですか？</h2><p>XLMGuardは、Stellar（XLM）とXRPの両方に対応したブロックチェーンベースのエスクローおよび支払い確認サービスです...</p></div>,
    Korean: <div><h2>XLMGuard란 무엇인가요?</h2><p>XLMGuard는 Stellar (XLM)과 XRP를 위한 블록체인 기반 에스크로 및 결제 검증 서비스입니다...</p></div>,
    Italian: <div><h2>Che cos'è XLMGuard?</h2><p>XLMGuard è un servizio di deposito a garanzia e verifica dei pagamenti basato su blockchain, progettato per Stellar (XLM) e XRP...</p></div>,
    Lingala: <div><h2>XLMGuard ezali nini?</h2><p>XLMGuard ezali mosala ya blockchain ya kosunga na kokanga mbongo mpe kokatisa sika ya kofuta, mpo na Stellar (XLM) mpe XRP...</p></div>,
    Swahili: <div><h2>XLMGuard ni nini?</h2><p>XLMGuard ni huduma ya msingi ya blockchain ya amana na uthibitisho wa malipo iliyojengwa kwa ajili ya Stellar (XLM) na XRP...</p></div>
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

      <div>{faqs[language]}</div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Return to Home Page</button>
        </Link>
      </div>
    </div>
  );
}

export default FAQPage;




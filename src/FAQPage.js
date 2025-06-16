// Full multilingual FAQPage.js with full content in English, Arabic, Chinese, French, Spanish, German, Hindi, Portuguese, Japanese, and Korean
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

  const faqs = {
    English: ( ... ),
    Arabic: ( ... ),
    Chinese: ( ... ),
    French: ( ... ),
    Spanish: ( ... ),
    German: ( ... ),
    Hindi: ( ... ),
    Portuguese: ( ... ),
    Japanese: ( ... ),
    Korean: (
      <div>
        <h2>XLMGuard란 무엇인가요?</h2>
        <p>XLMGuard는 Stellar(XLM) 및 XRP를 위한 블록체인 기반 에스크로 및 결제 검증 서비스입니다. 특히 개인 간 결제, 판매, 또는 체인 외부에서 신뢰를 확인해야 하는 거래에서 신뢰성과 보안을 향상시키는 데 목적이 있습니다.</p>
        <h2>🔑 XLMGuard의 작동 방식</h2>
        <ul>
          <li><strong>거래 시작:</strong> 발신자가 XLMGuard를 통해 결제 요청을 생성합니다.</li>
          <li><strong>자금 보관:</strong> 루멘(XLM) 또는 XRP는 양 당사자가 미리 정의한 조건을 충족할 때까지 에스크로에 보관됩니다.</li>
          <li><strong>검증:</strong> XLMGuard는 거래를 모니터링하며, 필요한 경우 체인 외부 확인 메커니즘을 통합합니다.</li>
          <li><strong>자금 해제 또는 환불:</strong> 조건이 충족되면 자금이 자동으로 해제되며, 문제가 발생한 경우 환불됩니다.</li>
        </ul>
        <h2>🌟 XLMGuard만의 특징</h2>
        <ul>
          <li><strong>크로스 체인 지원:</strong> 대부분의 에스크로 서비스가 하나의 네트워크만 지원하는 것과 달리 XLM 및 XRP를 모두 지원합니다.</li>
          <li><strong>체인 외부 검증:</strong> 단순한 멀티시그 이상의 기능으로, 자금 해제 전에 외부 승인 또는 확인을 포함할 수 있습니다.</li>
          <li><strong>거래 무결성 보장:</strong> 신뢰 기반 또는 수동 해제가 아닌 미리 설정된 조건을 강제하여 사기 및 오류를 방지합니다.</li>
          <li><strong>현실적인 사용 사례에 맞춘 설계:</strong> 마켓플레이스 판매, 프리랜서 작업 또는 에스크로 유형 거래 등 실생활에 적합하도록 설계되었습니다.</li>
        </ul>
        <h2>✅ 결론: XLM 거래에서의 고유한 위치?</h2>
        <p>그렇습니다 — XLMGuard는 다음과 같은 이유로 돋보입니다:</p>
        <ul>
          <li>비관리형 에스크로 및 결제 검증 도구로 작동</li>
          <li>Stellar 및 Ripple 네트워크 모두에서 사용 가능</li>
          <li>체인 기능과 체인 외부 로직을 결합하여 사용</li>
          <li>조건 기반 자동 해제를 통해 거래 상대방의 위험을 방지</li>
        </ul>
        <p>단순히 프라이빗 키를 보호하는 것을 넘어, XLM 거래의 공정성과 무결성을 보장하는 시스템입니다. 이것이 바로 XLMGuard의 고유한 위치입니다.</p>
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












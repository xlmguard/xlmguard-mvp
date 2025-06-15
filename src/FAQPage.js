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
    Korean: '자주 묻는 질문 (FAQ)',
    Italian: 'Domande Frequenti (FAQ)'
  };

  const faqs = {
    English: [
      { q: 'What is XLMGuard?', a: 'XLMGuard is a protection service for XLM and XRP transactions.' },
      { q: 'How do I register?', a: 'Click on the register button and fill in your transaction details.' },
    ],
    Arabic: [
      { q: 'ما هو XLMGuard؟', a: 'XLMGuard هي خدمة حماية للمعاملات باستخدام XLM وXRP.' },
      { q: 'كيف يمكنني التسجيل؟', a: 'انقر على زر التسجيل واملأ تفاصيل معاملتك.' },
    ],
    Chinese: [
      { q: '什么是 XLMGuard？', a: 'XLMGuard 是一种用于 XLM 和 XRP 交易的保护服务。' },
      { q: '我如何注册？', a: '点击注册按钮并填写交易详情。' },
    ],
    French: [
      { q: 'Qu\'est-ce que XLMGuard ?', a: 'XLMGuard est un service de protection pour les transactions XLM et XRP.' },
      { q: 'Comment puis-je m\'inscrire ?', a: 'Cliquez sur le bouton d\'inscription et remplissez les détails de votre transaction.' },
    ],
    Spanish: [
      { q: '¿Qué es XLMGuard?', a: 'XLMGuard es un servicio de protección para transacciones de XLM y XRP.' },
      { q: '¿Cómo me registro?', a: 'Haz clic en el botón de registro y completa los detalles de la transacción.' },
    ],
    German: [
      { q: 'Was ist XLMGuard?', a: 'XLMGuard ist ein Schutzdienst für XLM- und XRP-Transaktionen.' },
      { q: 'Wie registriere ich mich?', a: 'Klicken Sie auf die Schaltfläche „Registrieren“ und geben Sie Ihre Transaktionsdaten ein.' },
    ],
    Hindi: [
      { q: 'XLMGuard क्या है?', a: 'XLMGuard XLM और XRP लेनदेन के लिए एक सुरक्षा सेवा है।' },
      { q: 'मैं पंजीकरण कैसे करूं?', a: 'रजिस्टर बटन पर क्लिक करें और अपने लेन-देन का विवरण भरें।' },
    ],
    Portuguese: [
      { q: 'O que é o XLMGuard?', a: 'XLMGuard é um serviço de proteção para transações de XLM e XRP.' },
      { q: 'Como faço para me registrar?', a: 'Clique no botão de registro e preencha os detalhes da transação.' },
    ],
    Japanese: [
      { q: 'XLMGuardとは何ですか？', a: 'XLMGuardは、XLMおよびXRP取引の保護サービスです。' },
      { q: 'どうやって登録しますか？', a: '登録ボタンをクリックして、取引の詳細を入力してください。' },
    ],
    Korean: [
      { q: 'XLMGuard란 무엇인가요?', a: 'XLMGuard는 XLM 및 XRP 거래를 위한 보호 서비스입니다.' },
      { q: '등록은 어떻게 하나요?', a: '등록 버튼을 클릭하고 거래 세부정보를 입력하세요.' },
    ],
    Italian: [
      { q: 'Che cos\'è XLMGuard?', a: 'XLMGuard è un servizio di protezione per le transazioni XLM e XRP.' },
      { q: 'Come mi registro?', a: 'Fai clic sul pulsante di registrazione e compila i dettagli della transazione.' },
    ]
  };

  return (
    <div className="faq-page">
      <h1>{translations[language]}</h1>

      <div className="language-selector">
        <label>Select Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {Object.keys(translations).map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="faq-list">
        {faqs[language].map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>

      <Link to="/">← Back to Home</Link>
    </div>
  );
}

export default FAQPage;

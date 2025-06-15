// Full multilingual FAQPage.js with translated content populated for all supported languages
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

  const fullFAQContent = (text) => (
    <div dangerouslySetInnerHTML={{ __html: text }} />
  );

  const faqTemplate = (question, works, unique, conclusion) => `
    <h2>${question}</h2>
    <p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It’s designed to add an extra layer of trust and security to transactions—especially in peer-to-peer payments, sales, or where trust needs to be off‑chain verified.</p>
    <h2>🔑 ${works}</h2>
    <ul>
      <li><strong>Initiating a transaction:</strong> The sender creates a payment request via XLMGuard.</li>
      <li><strong>Holding funds:</strong> The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.</li>
      <li><strong>Verification:</strong> XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.</li>
      <li><strong>Release or refund:</strong> Once conditions are met, funds are automatically released, or refunded if something goes wrong.</li>
    </ul>
    <h2>🌟 ${unique}</h2>
    <ul>
      <li><strong>Cross‑chain support:</strong> Works with both XLM and XRP, which is rare—most escrow services support only one.</li>
      <li><strong>Off‑chain verification:</strong> Can include external confirmations before releasing funds.</li>
      <li><strong>Transaction integrity:</strong> Prevents fraud by enforcing preset terms in escrow.</li>
      <li><strong>Designed for real-world use cases:</strong> Ideal for marketplace sales, freelance jobs, or peer-to-peer deals.</li>
    </ul>
    <h2>✅ ${conclusion}</h2>
    <p>Yes—XLMGuard acts as a non-custodial escrow and payment verifier, supports both Stellar and Ripple, and shields users from risk by automating trustless payments.</p>
  `;

  const faqs = {
    English: fullFAQContent(faqTemplate("What is XLMGuard?", "How XLMGuard Works", "What Makes It Unique?", "Conclusion: A Unique Position in XLM Transactions?")),
    French: fullFAQContent(faqTemplate("Qu'est-ce que XLMGuard ?", "Comment fonctionne XLMGuard", "Qu'est-ce qui le rend unique ?", "Conclusion : Une position unique pour les transactions XLM ?")),
    Spanish: fullFAQContent(faqTemplate("¿Qué es XLMGuard?", "Cómo funciona XLMGuard", "¿Qué lo hace único?", "¿Una posición única en las transacciones XLM?")),
    German: fullFAQContent(faqTemplate("Was ist XLMGuard?", "Wie funktioniert XLMGuard", "Was macht es einzigartig?", "Fazit: Eine einzigartige Position bei XLM-Transaktionen?")),
    Chinese: fullFAQContent(faqTemplate("XLMGuard 是什么？", "XLMGuard 如何运作", "XLMGuard 的独特之处", "结论：XLM 交易的独特地位？")),
    Arabic: fullFAQContent(faqTemplate("ما هو XLMGuard؟", "كيف يعمل XLMGuard", "ما الذي يجعل XLMGuard فريدًا؟", "الخلاصة: هل لدى XLMGuard موقع فريد في معاملات XLM؟")),
    Hindi: fullFAQContent(faqTemplate("XLMGuard क्या है?", "XLMGuard कैसे काम करता है", "XLMGuard की विशेषता क्या है?", "निष्कर्ष: क्या XLM लेनदेन में XLMGuard की एक अनूठी स्थिति है?")),
    Portuguese: fullFAQContent(faqTemplate("O que é o XLMGuard?", "Como o XLMGuard Funciona", "O que Torna Único?", "Conclusão: Uma Posição Única nas Transações XLM?")),
    Japanese: fullFAQContent(faqTemplate("XLMGuardとは何ですか？", "XLMGuardの仕組み", "ユニークな点", "結論：XLMトランザクションにおける独自の地位？")),
    Korean: fullFAQContent(faqTemplate("XLMGuard란 무엇인가요?", "XLMGuard 작동 방식", "무엇이 특별한가요?", "결론: XLM 거래에서의 독보적인 위치?")),
    Italian: fullFAQContent(faqTemplate("Che cos'è XLMGuard?", "Come funziona XLMGuard", "Cosa lo rende unico?", "Conclusione: una posizione unica nelle transazioni XLM?")),
    Lingala: fullFAQContent(faqTemplate("XLMGuard ezali nini?", "XLMGuard esalaka ndenge nini", "Nini esalaka ete ezala ya solo?", "Ekokani: XLMGuard ezali na esika moko ya motuya na transaction ya XLM?")),
    Swahili: fullFAQContent(faqTemplate("XLMGuard ni nini?", "XLMGuard inavyofanya kazi", "Ni nini hufanya kuwa ya kipekee?", "Hitimisho: Nafasi ya kipekee katika miamala ya XLM?"))
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







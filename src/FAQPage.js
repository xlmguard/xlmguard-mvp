// FAQPage.js - Multilingual FAQ Component for XLMGuard

import React, { useState } from 'react';

const faqContent = {
  en: [
    {
      question: "What is XLMGuard?",
      answer: `XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP...`
    },
    // ... other questions
    {
      question: "💱 Does XLMGuard support StableCoin?",
      answer: `Yes, XLMGuard now supports transactions with major StableCoins such as USDC (on Stellar) and other chains where integration is complete. This adds another layer of trust and flexibility for users who prefer price-stable crypto assets.`
    }
  ],
  tr: [
    // ... other questions
    {
      question: "💱 XLMGuard StableCoin'i Destekliyor mu?",
      answer: `Evet, XLMGuard artık Stellar ağı üzerindeki USDC gibi başlıca StableCoin'lerle işlemleri desteklemektedir. Bu, fiyat istikrarı isteyen kullanıcılar için ekstra güven ve esneklik sağlar.`
    }
  ],
  vi: [
    // ... other questions
    {
      question: "💱 XLMGuard có hỗ trợ StableCoin không?",
      answer: `Có, XLMGuard hiện hỗ trợ các giao dịch với các StableCoin phổ biến như USDC trên mạng Stellar, mang lại sự linh hoạt và ổn định hơn cho người dùng.`
    }
  ],
  ru: [
    // ... other questions
    {
      question: "💱 Поддерживает ли XLMGuard стабильные монеты (StableCoin)?",
      answer: `Да, XLMGuard теперь поддерживает транзакции с основными стабильными монетами, такими как USDC в сети Stellar, обеспечивая дополнительную гибкость и стабильность.`
    }
  ],
  pl: [
    // ... other questions
    {
      question: "💱 Czy XLMGuard obsługuje StableCoin?",
      answer: `Tak, XLMGuard obsługuje teraz transakcje ze StableCoinami, takimi jak USDC w sieci Stellar, oferując użytkownikom większą elastyczność i bezpieczeństwo.`
    }
  ],
  nl: [
    // ... other questions
    {
      question: "💱 Ondersteunt XLMGuard StableCoin?",
      answer: `Ja, XLMGuard ondersteunt nu transacties met populaire StableCoins zoals USDC op het Stellar-netwerk, wat extra flexibiliteit en stabiliteit biedt.`
    }
  ],
  th: [
    // ... other questions
    {
      question: "💱 XLMGuard รองรับ StableCoin หรือไม่?",
      answer: `ใช่ XLMGuard รองรับการทำธุรกรรมด้วย StableCoin ยอดนิยมเช่น USDC บนเครือข่าย Stellar เพิ่มความมั่นคงและยืดหยุ่นในการใช้งาน.`
    }
  ],
  id: [
    // ... other questions
    {
      question: "💱 Apakah XLMGuard mendukung StableCoin?",
      answer: `Ya, XLMGuard kini mendukung transaksi dengan StableCoin populer seperti USDC di jaringan Stellar, memberikan stabilitas dan fleksibilitas tambahan.`
    }
  ],
  ms: [
    // ... other questions
    {
      question: "💱 Adakah XLMGuard menyokong StableCoin?",
      answer: `Ya, XLMGuard kini menyokong transaksi dengan StableCoin seperti USDC di rangkaian Stellar, memberikan kestabilan harga kepada pengguna.`
    }
  ],
  sw: [
    // ... other questions
    {
      question: "💱 Je, XLMGuard inaunga mkono StableCoin?",
      answer: `Ndiyo, XLMGuard sasa inasaidia miamala kwa StableCoin maarufu kama USDC kwenye mtandao wa Stellar, ikitoa uthabiti zaidi kwa watumiaji.`
    }
  ],
  fa: [
    // ... other questions
    {
      question: "💱 آیا XLMGuard از StableCoin پشتیبانی می‌کند؟",
      answer: `بله، XLMGuard اکنون از تراکنش‌ها با StableCoinهای محبوب مانند USDC در شبکه Stellar پشتیبانی می‌کند و انعطاف‌پذیری بیشتری را برای کاربران فراهم می‌کند.`
    }
  ]
};

const FAQPage = () => {
  const [language, setLanguage] = useState('en');
  const faqs = faqContent[language] || faqContent['en'];

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="ru">Русский (Russian)</option>
        <option value="tr">Türkçe (Turkish)</option>
        <option value="vi">Tiếng Việt (Vietnamese)</option>
        <option value="pl">Polski (Polish)</option>
        <option value="nl">Nederlands (Dutch)</option>
        <option value="th">ไทย (Thai)</option>
        <option value="id">Bahasa Indonesia</option>
        <option value="ms">Bahasa Melayu (Malay)</option>
        <option value="sw">Kiswahili (Swahili)</option>
        <option value="fa">فارسی (Persian)</option>
      </select>

      <div className="faq-section">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <h3>{item.question}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{item.answer}</p>
          </div>
        ))}
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => window.location.href = '/'} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ⬅️ Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

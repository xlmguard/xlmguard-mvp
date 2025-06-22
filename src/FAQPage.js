// FAQPage.js - Multilingual FAQ Component for XLMGuard

import React, { useState } from 'react';

const faqContent = {
  en: [
    {
      question: 'What is XLMGuard?',
      answer:
        'XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It provides a secure and transparent method for buyers and sellers to manage cross-border transactions.',
    },
    {
      question: 'How does XLMGuard work?',
      answer:
        'The buyer deposits funds into an escrow wallet and uploads a contract. The seller uploads shipment documents. Once the buyer verifies everything, the funds are released to the seller.',
    },
    {
      question: 'What documents are required?',
      answer:
        'The seller must upload a commercial invoice, packing list, bill of lading, insurance certificate, certificate of origin, inspection certificate, and images of the shipment.',
    },
    {
      question: 'Who should use XLMGuard?',
      answer:
        'Anyone engaging in international trade using XLM or XRP, including importers, exporters, and brokers, can benefit from using XLMGuard.',
    },
  ],
  // Placeholder content for translation – replace with accurate translations
  ru: [
    {
      question: 'Что такое XLMGuard?',
      answer:
        'XLMGuard — это основанный на блокчейне сервис условного депонирования и проверки платежей для Stellar (XLM) и XRP. Он обеспечивает безопасный и прозрачный способ управления международными транзакциями.',
    },
    {
      question: 'Как работает XLMGuard?',
      answer:
        'Покупатель вносит средства в эскроу-кошелёк и загружает контракт. Продавец загружает отгрузочные документы. После проверки покупателем средства переводятся продавцу.',
    },
    {
      question: 'Какие документы требуются?',
      answer:
        'Продавец должен загрузить коммерческий инвойс, упаковочный лист, коносамент, страховой сертификат, сертификат происхождения, сертификат инспекции и фотографии груза.',
    },
    {
      question: 'Кто должен использовать XLMGuard?',
      answer:
        'Любой, кто участвует в международной торговле с использованием XLM или XRP: импортеры, экспортеры и брокеры.',
    },
  ],
  // Add similar blocks for tr, vi, pl, nl, th, id, ms, sw, fa
};

const FAQPage = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="faq-page">
      <h1>{language === 'en' ? 'Frequently Asked Questions (FAQ)' : 'FAQ'}</h1>

      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
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

      <div className="faq-list">
        {faqContent[language]?.map((item, index) => (
          <div key={index} className="faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        )) || <p>No FAQ available in this language yet.</p>}
      </div>
    </div>
  );
};

export default FAQPage;
























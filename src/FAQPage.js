// FAQPage.js
import React, { useState } from 'react';

const FAQPage = () => {
  const [language, setLanguage] = useState('en');

  const faqContent = {
    en: {
      heading: 'Frequently Asked Questions (FAQ)',
      content: `
<h2>What is XLMGuard?</h2>
<p>XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It allows buyers and sellers to verify payments and documents before goods are released, reducing fraud in international transactions.</p>

<h2>How does XLMGuard work?</h2>
<p>The buyer deposits funds in an escrow wallet. The seller then uploads shipping documentation. Once the buyer confirms shipment, funds are released to the seller. All transactions are recorded on the blockchain for transparency and security.</p>

<h2>What currencies are supported?</h2>
<p>Currently, XLMGuard supports payments in Stellar Lumens (XLM) and Ripple (XRP). More currencies may be added in the future.</p>

<h2>Do I need a wallet?</h2>
<p>Yes. Both buyer and seller need to provide a valid Stellar or XRP wallet address to use the service.</p>

<h2>Is XLMGuard safe to use?</h2>
<p>Yes. XLMGuard uses blockchain technology to ensure immutable and transparent records of all transactions. Additionally, payments are only released when both parties complete their responsibilities.</p>

<h2>Is there customer support?</h2>
<p>Yes. You can contact us through the form on the website or email us directly at support@xlmguard.com.</p>
      `
    }
    // Add other languages as needed following this structure
  };

  return (
    <div style={{ padding: '20px', color: 'black' }}>
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ width: '210px', marginBottom: '20px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          {/* Add more language options here */}
        </select>
      </div>

      <h2>{faqContent[language].heading}</h2>
      <div dangerouslySetInnerHTML={{ __html: faqContent[language].content }} />
    </div>
  );
};

export default FAQPage;



















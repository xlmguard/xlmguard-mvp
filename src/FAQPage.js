import React, { useState } from 'react';

function FAQPage() {
  const [language, setLanguage] = useState('English');

  const faqs = {
    English: `What is XLMGuard?

XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It’s designed to add an extra layer of trust and security to transactions—especially in peer-to-peer payments, sales, or where trust needs to be off‑chain verified.

🔑 How XLMGuard Works

- Initiating a transaction: The sender creates a payment request via XLMGuard.
- Holding funds: The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.
- Verification: XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.
- Release or refund: Once conditions are met, funds are automatically released, or refunded if something goes wrong.

🌟 What Makes It Unique?

- Cross‑chain support: It works with both XLM and XRP, which is less common—most escrow services target only one network.
- Off‑chain verification: XLMGuard isn't just multisig—it can include external confirmations or approvals before releasing funds.
- Transaction integrity: It prevents fraud and mistakes by enforcing pre-set terms in escrow, rather than trust-based or manual release.
- Designed for real-world use cases: It’s tailor-made for things like marketplace sales, freelance work, or escrow-type transactions, not simply holding keys safely.

✅ Conclusion: A Unique Position in XLM Transactions?

Yes—XLMGuard stands out because it:
- Acts as a non-custodial escrow and payment verifier,
- Works across both Stellar and Ripple networks,
- Utilizes blockchain features enriched with off-chain logic,
- Shields users from counterpart risk by automating condition-based releases.

It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions. That's its unique niche.`
  };

  const allLanguages = ['English'];

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Frequently Asked Questions (FAQ)</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '16px' }}>{faqs[language]}</pre>
    </div>
  );
}

export default FAQPage;

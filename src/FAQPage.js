import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      heading: 'About XLMGuard',
      body: `XLMGuard is a blockchain-based transaction protection service that utilizes the Stellar and XRP blockchains. It is designed to provide security and transparency for cross-border commerce by helping buyers and sellers verify payments before goods or services are fulfilled.

Here's how XLMGuard leverages blockchain technology and its benefits:

Secure Transactions: XLMGuard enhances transaction security by using the distributed and immutable nature of blockchain technology. This means that transactions recorded on the network cannot be altered, ensuring trust and transparency.

Decentralized Nature: Unlike traditional systems that rely on a central authority, blockchain allows network participants (nodes) to validate transactions, reducing the risk of a single point of failure and potentially increasing user privacy.

Improved Transparency: Blockchain records key transaction details like participants, what was exchanged, when, and where, along with transaction amounts and conditions. This allows authorized participants to verify data and build trust.

Streamlined Processes: Blockchain can streamline processes such as accounting and banking services by enabling direct payments and faster transactions, bypassing traditional intermediaries.

Real-time Transactions: XLMGuard allows businesses to conduct transactions in real-time, 24/7, unlike traditional bank transfers with limited business hours and cutoff times.

Reduced Costs: Blockchain can lower costs for businesses, particularly for high-value, high-volume transactions, as fees associated with traditional methods can be substantial.

Potential for Smart Contracts: While not explicitly mentioned in relation to XLMGuard's specific service, smart contracts, which are code stored on the blockchain, could potentially be integrated to automate contract execution and reduce transaction and enforcement costs in certain cases.

In essence, XLMGuard uses blockchain to provide a more secure, transparent, and efficient way for businesses to engage in cross-border transactions, ultimately aiming to reduce risks and improve the overall commerce experience.`
    },
    // other languages will remain the same or be restored later
  };

  return (
    <div style={{ padding: '20px', color: 'black', backgroundColor: 'white' }}>
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <img
          src="/logo.png"
          alt="XLMGuard Logo"
          style={{ width: '210px', marginBottom: '20px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="ja">Japanese</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="hi">Hindi</option>
          <option value="zh">Chinese</option>
          <option value="fr">French</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <h2>{content[language].heading}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{content[language].body}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default FAQPage;

















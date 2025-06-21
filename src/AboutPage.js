// AboutPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      heading: "About XLMGuard",
      body:
        "XLMGuard is a blockchain-based transaction protection service that utilizes the Stellar and XRP blockchains. It is designed to provide security and transparency for cross-border commerce by helping buyers and sellers verify payments before goods or services are fulfilled." + "\n\n" +
        "Here's how XLMGuard leverages blockchain technology and its benefits:" + "\n\n" +
        "Secure Transactions: XLMGuard enhances transaction security by using the distributed and immutable nature of blockchain technology. This means that transactions recorded on the network cannot be altered, ensuring trust and transparency." + "\n\n" +
        "Decentralized Nature: Unlike traditional systems that rely on a central authority, blockchain allows network participants (nodes) to validate transactions, reducing the risk of a single point of failure and potentially increasing user privacy." + "\n\n" +
        "Improved Transparency: Blockchain records key transaction details like participants, what was exchanged, when, and where, along with transaction amounts and conditions. This allows authorized participants to verify data and build trust." + "\n\n" +
        "Streamlined Processes: Blockchain can streamline processes such as accounting and banking services by enabling direct payments and faster transactions, bypassing traditional intermediaries." + "\n\n" +
        "Real-time Transactions: XLMGuard allows businesses to conduct transactions in real-time, 24/7, unlike traditional bank transfers with limited business hours and cutoff times." + "\n\n" +
        "Reduced Costs: Blockchain can lower costs for businesses, particularly for high-value, high-volume transactions, as fees associated with traditional methods can be substantial." + "\n\n" +
        "Potential for Smart Contracts: While not explicitly mentioned in relation to XLMGuard's specific service, smart contracts, which are code stored on the blockchain, could potentially be integrated to automate contract execution and reduce transaction and enforcement costs in certain cases." + "\n\n" +
        "In essence, XLMGuard uses blockchain to provide a more secure, transparent, and efficient way for businesses to engage in cross-border transactions, ultimately aiming to reduce risks and improve the overall commerce experience."
    },
    ja: {
      heading: "XLMGuardについて",
      body: "XLMGuardは、StellarおよびXRPブロックチェーンを活用したブロックチェーンベースのトランザクション保護サービスです。国境を越えた取引において、商品やサービスの履行前に支払いを確認することで、セキュリティと透明性を提供します。\n\nXLMGuardがブロックチェーン技術を活用する方法とその利点は次のとおりです：\n\n安全な取引：分散型かつ不変のブロックチェーンの性質を活かし、記録された取引は改ざんできず、信頼性と透明性を保証します。\n\n分散型構造：中央集権システムとは異なり、ネットワーク参加者（ノード）が取引を検証し、単一障害点のリスクを低減し、ユーザーのプライバシー向上につながります。\n\n透明性の向上：ブロックチェーンは参加者、取引内容、時間、場所、金額、条件などの情報を記録し、正当な関係者がデータを検証できます。\n\nプロセスの効率化：仲介業者を排除し、迅速かつ直接的な支払いで会計や銀行業務を簡素化します。\n\nリアルタイム取引：銀行の営業時間や締切に左右されず、24時間365日取引可能です。\n\nコスト削減：特に高額・大量取引において、従来の方法にかかる手数料を削減します。\n\nスマートコントラクトの可能性：スマートコントラクトによって契約の実行を自動化し、取引コストや執行コストを削減できます。\n\n要するに、XLMGuardはブロックチェーンを活用し、安全で透明性が高く効率的な取引を提供します。"
    },
    de: { heading: 'Über XLMGuard', body: `XLMGuard ist ein blockchainbasiertes Transaktionsschutzsystem ...` },
    it: { heading: 'Informazioni su XLMGuard', body: `XLMGuard è un servizio di protezione delle transazioni ...` },
    hi: { heading: 'XLMGuard के बारे में', body: `XLMGuard एक ब्लॉकचेन आधारित ट्रांज़ैक्शन प्रोटेक्शन सेवा ...` },
    zh: { heading: '关于XLMGuard', body: `XLMGuard是一项基于区块链的交易保护服务 ...` },
    fr: { heading: 'À propos de XLMGuard', body: `XLMGuard est un service de protection des transactions ...` },
    pt: { heading: 'Sobre o XLMGuard', body: `XLMGuard é um serviço de proteção de transações ...` },
    es: { heading: 'Acerca de XLMGuard', body: `XLMGuard es un servicio de protección de transacciones ...` }
  };

  return (
    <div style={{ padding: '20px' }}>
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

export default AboutPage;



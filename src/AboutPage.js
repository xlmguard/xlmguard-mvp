// About Page.js 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      heading: 'About XLMGuard',
      body: XLMGuard is a blockchain-based transaction protection service that utilizes the Stellar and XRP blockchains. It is designed to provide security and transparency for cross-border commerce by helping buyers and sellers verify payments before goods or services are fulfilled.

Here's how XLMGuard leverages blockchain technology and its benefits:

Secure Transactions: XLMGuard enhances transaction security by using the distributed and immutable nature of blockchain technology. This means that transactions recorded on the network cannot be altered, ensuring trust and transparency.

Decentralized Nature: Unlike traditional systems that rely on a central authority, blockchain allows network participants (nodes) to validate transactions, reducing the risk of a single point of failure and potentially increasing user privacy.

Improved Transparency: Blockchain records key transaction details like participants, what was exchanged, when, and where, along with transaction amounts and conditions. This allows authorized participants to verify data and build trust.

Streamlined Processes: Blockchain can streamline processes such as accounting and banking services by enabling direct payments and faster transactions, bypassing traditional intermediaries.

Real-time Transactions: XLMGuard allows businesses to conduct transactions in real-time, 24/7, unlike traditional bank transfers with limited business hours and cutoff times.

Reduced Costs: Blockchain can lower costs for businesses, particularly for high-value, high-volume transactions, as fees associated with traditional methods can be substantial.

Potential for Smart Contracts: While not explicitly mentioned in relation to XLMGuard's specific service, smart contracts, which are code stored on the blockchain, could potentially be integrated to automate contract execution and reduce transaction and enforcement costs in certain cases.

In essence, XLMGuard uses blockchain to provide a more secure, transparent, and efficient way for businesses to engage in cross-border transactions, ultimately aiming to reduce risks and improve the overall commerce experience.
    },
    ja: {
      heading: 'XLMGuardについて',
      body: XLMGuardは、StellarおよびXRPブロックチェーンを活用したブロックチェーンベースのトランザクション保護サービスです。国境を越えた取引において、商品やサービスの履行前に支払いを確認することで、セキュリティと透明性を提供します。

XLMGuardがブロックチェーン技術を活用する方法とその利点は次のとおりです：

安全な取引：分散型かつ不変のブロックチェーンの性質を活かし、記録された取引は改ざんできず、信頼性と透明性を保証します。

分散型構造：中央集権システムとは異なり、ネットワーク参加者（ノード）が取引を検証し、単一障害点のリスクを低減し、ユーザーのプライバシー向上につながります。

透明性の向上：ブロックチェーンは参加者、取引内容、時間、場所、金額、条件などの情報を記録し、正当な関係者がデータを検証できます。

プロセスの効率化：仲介業者を排除し、迅速かつ直接的な支払いで会計や銀行業務を簡素化します。

リアルタイム取引：銀行の営業時間や締切に左右されず、24時間365日取引可能です。

コスト削減：特に高額・大量取引において、従来の方法にかかる手数料を削減します。

スマートコントラクトの可能性：スマートコントラクトによって契約の実行を自動化し、取引コストや執行コストを削減できます。

要するに、XLMGuardはブロックチェーンを活用し、安全で透明性が高く効率的な取引を提供します。
    },
    de: {
      heading: 'Über XLMGuard',
      body: XLMGuard ist ein blockchainbasiertes Transaktionsschutzsystem, das die Stellar- und XRP-Blockchains nutzt. Es bietet Sicherheit und Transparenz für den grenzüberschreitenden Handel, indem es Käufern und Verkäufern ermöglicht, Zahlungen vor der Erfüllung von Waren oder Dienstleistungen zu verifizieren.

So nutzt XLMGuard die Blockchain-Technologie und ihre Vorteile:

Sichere Transaktionen: Durch die verteilte und unveränderliche Natur der Blockchain sind Transaktionen fälschungssicher und transparent.

Dezentralisierung: Transaktionen werden von den Teilnehmern selbst validiert, wodurch das Risiko zentraler Fehlerquellen reduziert wird.

Transparenz: Alle relevanten Transaktionsdaten wie Beteiligte, Zeitpunkt, Ort, Betrag und Bedingungen werden unveränderlich aufgezeichnet und überprüfbar gemacht.

Effizienz: Blockchain ermöglicht schnellere, direkte Zahlungen ohne Zwischenhändler und vereinfacht Buchhaltung und Bankprozesse.

Echtzeit-Transaktionen: Transaktionen können rund um die Uhr durchgeführt werden – unabhängig von Banköffnungszeiten.

Kostensenkung: Für große Transaktionen fallen im Vergleich zu traditionellen Methoden geringere Gebühren an.

Smart Contracts: Zukünftig könnten intelligente Verträge genutzt werden, um Prozesse zu automatisieren und Kosten zu senken.

Kurz gesagt: XLMGuard verbessert den internationalen Handel durch eine sichere, transparente und effiziente Transaktionsabwicklung.
    },
    it: {
      heading: 'Informazioni su XLMGuard',
      body: XLMGuard è un servizio di protezione delle transazioni basato su blockchain che utilizza le blockchain Stellar e XRP. È progettato per offrire sicurezza e trasparenza nel commercio transfrontaliero, aiutando acquirenti e venditori a verificare i pagamenti prima dell’erogazione dei beni o servizi.

Ecco come XLMGuard sfrutta la tecnologia blockchain:

Transazioni Sicure: La blockchain è distribuita e immutabile, garantendo che le transazioni non possano essere modificate.

Natura Decentralizzata: Le transazioni vengono validate dai nodi di rete senza bisogno di un’autorità centrale, migliorando privacy e affidabilità.

Trasparenza: Le informazioni di scambio sono pubbliche e verificabili, creando fiducia tra le parti.

Processi Snelli: I pagamenti diretti e rapidi eliminano la necessità di intermediari bancari.

Transazioni in Tempo Reale: Le operazioni sono disponibili 24/7, senza limiti di orario bancario.

Riduzione dei Costi: I costi associati ai metodi tradizionali sono notevolmente ridotti.

Smart Contract: Possibile integrazione futura per automatizzare i contratti e ridurre costi legali.

In sintesi, XLMGuard offre un metodo sicuro, trasparente ed efficiente per facilitare le transazioni internazionali.
    },
    hi: {
      heading: 'XLMGuard के बारे में',
      body: XLMGuard एक ब्लॉकचेन आधारित ट्रांज़ैक्शन प्रोटेक्शन सेवा है जो Stellar और XRP ब्लॉकचेन का उपयोग करती है। यह सीमा पार लेन-देन में सुरक्षा और पारदर्शिता प्रदान करती है, जिससे खरीदार और विक्रेता सेवाओं या उत्पादों की पूर्ति से पहले भुगतान की पुष्टि कर सकते हैं।

XLMGuard ब्लॉकचेन की इन विशेषताओं का लाभ उठाता है:

सुरक्षित लेन-देन: डेटा अपरिवर्तनीय होता है जिससे धोखाधड़ी की संभावना कम हो जाती है।

विकेंद्रीकरण: केंद्रीय प्रणाली की आवश्यकता नहीं होती, जिससे विश्वसनीयता और गोपनीयता बढ़ती है।

पारदर्शिता: सभी विवरण नेटवर्क में दर्ज होते हैं, जिससे भरोसा बनता है।

प्रक्रियाओं का सरलीकरण: बैंकों और मध्यस्थों की आवश्यकता कम होती है।

रियल-टाइम ट्रांज़ैक्शन: 24/7 ट्रांज़ैक्शन संभव होता है।

लागत में कमी: पारंपरिक तरीकों की तुलना में लागत कम होती है।

स्मार्ट कॉन्ट्रैक्ट्स की संभावना: भविष्य में स्वचालित अनुबंध संभव।

संक्षेप में, XLMGuard सुरक्षित, पारदर्शी और कुशल व्यापार की सुविधा देता है।
    },
    zh: {
      heading: '关于XLMGuard',
      body: XLMGuard是一项基于区块链的交易保护服务，使用Stellar和XRP区块链。该平台旨在为跨境交易提供安全性和透明度，帮助买卖双方在商品或服务履行之前验证付款。

XLMGuard如何利用区块链的优势：

安全交易：数据无法更改，确保透明和信任。

去中心化：无需中央机构，提升系统鲁棒性。

透明性：记录所有关键交易细节，供用户验证。

流程简化：可绕过传统银行系统，进行直接支付。

实时交易：全天候运作，不受银行时间限制。

降低成本：减少传统方法下的高昂费用。

智能合约潜力：可自动执行协议，进一步减少风险与成本。

总之，XLMGuard利用区块链，为企业提供更安全、更高效的跨境交易方式。
    },
    fr: {
      heading: 'À propos de XLMGuard',
      body: XLMGuard est un service de protection des transactions basé sur la blockchain qui utilise les blockchains Stellar et XRP. Il est conçu pour garantir la sécurité et la transparence du commerce transfrontalier en aidant les acheteurs et les vendeurs à vérifier les paiements avant la livraison des biens ou services.

Comment XLMGuard exploite les avantages de la blockchain :

Transactions sécurisées : grâce à l'immuabilité des données sur la blockchain, les transactions sont protégées contre toute altération.

Nature décentralisée : pas d'autorité centrale, chaque participant peut valider une transaction, ce qui renforce la confiance.

Transparence accrue : toutes les informations clés sont visibles et traçables.

Processus simplifiés : paiements plus rapides sans passer par les intermédiaires traditionnels.

Transactions en temps réel : disponibles 24h/24 et 7j/7.

Réduction des coûts : frais moindres pour les transactions à forte valeur.

Contrats intelligents : possibilité d'automatiser les accords commerciaux à l'avenir.

En résumé, XLMGuard apporte sécurité, efficacité et transparence aux échanges internationaux.
    },
    pt: {
      heading: 'Sobre o XLMGuard',
      body: XLMGuard é um serviço de proteção de transações baseado em blockchain que utiliza as blockchains Stellar e XRP. Foi desenvolvido para oferecer segurança e transparência ao comércio internacional, ajudando compradores e vendedores a verificarem pagamentos antes da entrega dos produtos ou serviços.

Como o XLMGuard utiliza a tecnologia blockchain:

Transações Seguras: A natureza imutável da blockchain garante a integridade dos dados.

Sistema Descentralizado: Elimina intermediários centrais, aumentando a confiabilidade e privacidade.

Maior Transparência: Informações importantes ficam acessíveis e auditáveis.

Processos Mais Ágeis: Pagamentos diretos e rápidos com menos burocracia.

Transações em Tempo Real: Disponíveis a qualquer momento, 24/7.

Custos Reduzidos: Tarifas mais baixas em relação aos métodos tradicionais.

Contratos Inteligentes: Possibilidade de automação de acordos no futuro.

Resumidamente, XLMGuard proporciona uma maneira mais segura e eficiente de realizar transações internacionais.
    },
    es: {
      heading: 'Acerca de XLMGuard',
      body: XLMGuard es un servicio de protección de transacciones basado en blockchain que utiliza las blockchains Stellar y XRP. Su objetivo es proporcionar seguridad y transparencia en el comercio transfronterizo, ayudando a compradores y vendedores a verificar pagos antes de la entrega de productos o servicios.

Ventajas del uso de blockchain por XLMGuard:

Transacciones seguras: La información es inmutable, brindando confianza.

Naturaleza descentralizada: Sin dependencia de autoridades centrales.

Transparencia: Detalles importantes están registrados y verificables.

Procesos optimizados: Pagos directos y sin intermediarios.

Transacciones en tiempo real: Disponibles las 24 horas.

Reducción de costos: Comisiones más bajas.

Contratos inteligentes: Automatización posible para el futuro.

En resumen, XLMGuard facilita transacciones seguras y eficientes a nivel global.
    }
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

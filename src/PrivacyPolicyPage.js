// src/PrivacyPolicyPage.js
import React from 'react';

const PrivacyPolicyPage = () => {
  const container = {
    maxWidth: 860,
    margin: '24px auto',
    padding: '0 16px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    color: '#111827'
  };
  const h1 = { fontSize: 28, marginBottom: 12 };
  const h2 = { fontSize: 20, marginTop: 20, marginBottom: 8 };
  const small = { color: '#6b7280', fontSize: 12 };

  return (
    <div style={container}>
      <h1 style={h1}>Privacy Policy</h1>
      <p style={small}>Last updated: 2025-08-30</p>

      <p>
        This Privacy Policy explains how XLMGuard (“we,” “us”) collects, uses, discloses, and protects information
        when you use our website and services (“Service”). By using the Service, you agree to this Policy.
      </p>

      <h2 style={h2}>1. Information We Collect</h2>
      <ul>
        <li><b>Account Information:</b> name, email, password (hashed), role (buyer/seller).</li>
        <li><b>Transaction & Documents:</b> counterparty names, shipping documents and metadata you upload.</li>
        <li><b>Wallet & Network Data:</b> addresses, memos, transaction IDs you submit or that we derive for validation.</li>
        <li><b>Compliance Data:</b> sanctions screening results and audit logs (e.g., cleared/possible/confirmed match, evidence links).</li>
        <li><b>Usage & Analytics:</b> page views, device and browser info, IP address, timestamps (e.g., via Google Analytics).</li>
        <li><b>Support:</b> messages and contact info you provide when requesting help.</li>
      </ul>

      <h2 style={h2}>2. How We Use Information</h2>
      <ul>
        <li>Provide and improve the Service, including validating transactions and document workflows.</li>
        <li>Conduct sanctions screening and other compliance checks as required by law.</li>
        <li>Prevent fraud, enforce our Terms, and protect the Service and users.</li>
        <li>Support, troubleshooting, and communications (e.g., service updates).</li>
        <li>Analytics to understand usage and improve performance.</li>
      </ul>

      <h2 style={h2}>3. Legal Bases (GDPR/UK)</h2>
      <ul>
        <li><b>Contract:</b> to provide the Service you request.</li>
        <li><b>Legal Obligation:</b> sanctions screening and recordkeeping.</li>
        <li><b>Legitimate Interests:</b> security, fraud prevention, product improvement.</li>
        <li><b>Consent:</b> where required (e.g., optional marketing emails).</li>
      </ul>

      <h2 style={h2}>4. Sharing of Information</h2>
      <ul>
        <li>Service providers (e.g., cloud hosting, analytics) under appropriate safeguards.</li>
        <li>Compliance partners or authorities when legally required or to protect rights and safety.</li>
        <li>Business transfers (e.g., merger or acquisition) with continued protections.</li>
      </ul>

      <h2 style={h2}>5. Data Retention</h2>
      <p>
        We retain account, transaction, and compliance records for as long as your account is active and as required
        by law. Compliance logs (including sanctions screening) are generally retained for <b>at least 5 years</b>.
      </p>

      <h2 style={h2}>6. Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards to protect information.
        No method of transmission or storage is 100% secure.
      </p>

      <h2 style={h2}>7. Your Rights</h2>
      <ul>
        <li>Access, correct, or delete certain personal data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Data portability (where applicable).</li>
        <li>To exercise rights, contact <a href="mailto:support@xlmguard.com">support@xlmguard.com</a>.</li>
      </ul>

      <h2 style={h2}>8. Cookies & Analytics</h2>
      <p>
        We use cookies and similar technologies for essential functionality and analytics (e.g., Google Analytics).
        You can control cookies through your browser settings. Analytics may collect IP address and device information.
      </p>

      <h2 style={h2}>9. International Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your own. We use appropriate
        safeguards where required by law.
      </p>

      <h2 style={h2}>10. Children</h2>
      <p>
        The Service is not intended for children under 18, and we do not knowingly collect data from children.
      </p>

      <h2 style={h2}>11. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. Material changes will be posted on this page with a new
        “Last updated” date.
      </p>

      <h2 style={h2}>12. Contact</h2>
      <p>
        Questions about this Policy: <a href="mailto:support@xlmguard.com">support@xlmguard.com</a>
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;

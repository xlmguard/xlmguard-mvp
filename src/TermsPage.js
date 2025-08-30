// src/TermsPage.js
import React from 'react';

const TermsPage = () => {
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
      <h1 style={h1}>Terms of Service</h1>
      <p style={small}>Last updated: 2025-08-30</p>

      <p>
        These Terms of Service (“Terms”) govern your access to and use of the XLMGuard website,
        products, and services (collectively, the “Service”). By creating an account or using the
        Service, you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2 style={h2}>1. About XLMGuard</h2>
      <p>
        XLMGuard provides workflow tools for submitting, validating, and tracking cryptocurrency-based
        trade transactions and related documents. XLMGuard is <b>not a bank</b>, money transmitter, or
        broker, and does not provide investment, legal, or tax advice. On-chain transfers are executed
        via third-party networks and wallets outside XLMGuard’s control.
      </p>

      <h2 style={h2}>2. Eligibility</h2>
      <ul>
        <li>You must be at least 18 years old and legally able to enter contracts.</li>
        <li>You must not be a person or entity subject to sanctions or other restrictions that would
            prohibit your use of the Service.</li>
      </ul>

      <h2 style={h2}>3. Accounts</h2>
      <ul>
        <li>You are responsible for safeguarding your login credentials and for all activity under your account.</li>
        <li>You must provide accurate information and keep it current.</li>
      </ul>

      <h2 style={h2}>4. Sanctions & Compliance</h2>
      <p>
        You agree that XLMGuard may screen your name, company, counterparties, and parties listed in submitted
        documents against global sanctions and watchlists (including OFAC, UN, EU, and UK lists). Transactions
        may be paused, declined, or reported when required by law. You represent that you are not subject to
        sanctions and will not use the Service to transact with sanctioned parties or jurisdictions.
      </p>

      <h2 style={h2}>5. Prohibited Uses</h2>
      <ul>
        <li>Use in violation of sanctions, export controls, or anti-money-laundering laws.</li>
        <li>Fraud, deceptive practices, or submitting false documents.</li>
        <li>Interference with the Service, abuse of network resources, or attempts to bypass controls.</li>
      </ul>

      <h2 style={h2}>6. Fees & Payments</h2>
      <p>
        Fees (including minimums, percentages, and network fees) are displayed in the product or at checkout and
        are non-refundable unless expressly stated. Blockchain transfers are generally irreversible; verify
        addresses, memos, and amounts before submitting.
      </p>

      <h2 style={h2}>7. Documents & Data You Provide</h2>
      <p>
        You are solely responsible for the accuracy and legality of uploaded documents and data.
        You grant XLMGuard a limited license to process such materials for the purpose of providing the Service,
        including compliance screening and recordkeeping.
      </p>

      <h2 style={h2}>8. Risk Disclosures</h2>
      <ul>
        <li>Digital assets can be volatile; transaction values may fluctuate.</li>
        <li>On-chain transactions can be delayed, congested, or fail due to network conditions.</li>
        <li>Third-party wallets, exchanges, and networks are outside XLMGuard’s control.</li>
      </ul>

      <h2 style={h2}>9. Intellectual Property</h2>
      <p>
        The Service, including its UI, code, and content, is owned by XLMGuard or its licensors and protected by
        applicable laws. You may not copy, modify, reverse engineer, or create derivative works except as permitted
        by law.
      </p>

      <h2 style={h2}>10. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” XLMGUARD DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,
        INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>

      <h2 style={h2}>11. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, XLMGUARD SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, OR GOODWILL. IN NO EVENT SHALL
        XLMGUARD’S AGGREGATE LIABILITY EXCEED THE FEES PAID BY YOU TO XLMGUARD IN THE 3 MONTHS PRECEDING THE EVENT
        GIVING RISE TO THE CLAIM.
      </p>

      <h2 style={h2}>12. Termination</h2>
      <p>
        We may suspend or terminate your access immediately for suspected violations of these Terms or applicable
        law. You may stop using the Service at any time.
      </p>

      <h2 style={h2}>13. Governing Law & Disputes</h2>
      <p>
        These Terms are governed by the laws of the state/country where XLMGuard is organized, without regard to
        conflicts of law. Venue and jurisdiction shall lie in the competent courts of that location.
      </p>

      <h2 style={h2}>14. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be posted on this page with a new
        “Last updated” date.
      </p>

      <h2 style={h2}>15. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:support@xlmguard.com">support@xlmguard.com</a>
        {/* Replace with your preferred email */}
      </p>
    </div>
  );
};

export default TermsPage;

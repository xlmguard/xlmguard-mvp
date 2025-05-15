import React, { useState } from 'react';

function XLMEscrowMVP() {
  const [walletAddress, setWalletAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [contractDetails, setContractDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>XLM Transaction Protection MVP</h1>

      {/* Payment Button */}
      <a
        href="https://pay.seobot.online/xlmguard"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            cursor: "pointer"
          }}
        >
          💳 Pay $25 for XLM Transaction Protection
        </button>
      </a>

      <div style={{ marginBottom: '1rem' }}>
        <label>Wallet Address</label>
        <input
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Memo</label>
        <input
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Contract Details</label>
        <textarea
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          value={contractDetails}
          onChange={(e) => setContractDetails(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Submit
      </button>

      {submitted && (
        <p style={{ marginTop: '1rem', color: '#10b981', fontWeight: 'bold' }}>
          ✅ Transaction submitted!
        </p>
      )}
    </div>
  );
}

export default XLMEscrowMVP;
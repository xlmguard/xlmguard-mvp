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
    <div style={{ padding: '2rem' }}>
      <h1>XLM Transaction Protection MVP</h1>
      <div>
        <label>Wallet Address</label>
        <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
      </div>
      <div>
        <label>Memo</label>
        <input value={memo} onChange={(e) => setMemo(e.target.value)} />
      </div>
      <div>
        <label>Contract Details</label>
        <textarea value={contractDetails} onChange={(e) => setContractDetails(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {submitted && <p>Transaction submitted!</p>}
    </div>
  );
}

export default XLMEscrowMVP;
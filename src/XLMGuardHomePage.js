import React, { useState } from 'react';

function XLMGuardHomePage() {
  const [form, setForm] = useState({
    wallet: '',
    memo: '',
    contract: '',
    payment: '',
    email: '',
    submitted: false
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, submitted: true });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '60px', marginRight: '1rem' }} />
        <h1>XLMGuard</h1>
      </header>

      <section>
        <h2>Protect Your XLM Transactions with Confidence</h2>
        <p>Fast, flat-fee protection for Stellar payments.</p>
        <a href="https://pay.seobot.online/xlmguard" target="_blank" rel="noopener noreferrer">
          <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px' }}>
            💳 Pay $25 for Protection
          </button>
        </a>
      </section>
 
      <section style={{ marginTop: '2rem' }}>
        <h3>Submit Transaction for Protection</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="wallet"
            placeholder="Wallet Address"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
          />
          <input
            name="memo"
            placeholder="Memo"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
          />
          <textarea
            name="contract"
            placeholder="Contract Details"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
          />
          <input
            name="payment"
            placeholder="Payment Confirmation Code"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '8px', width: '100%' }}
          />
          <button
            type="submit"
            style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '6px' }}
          >
            Submit
          </button>
        </form>
        {form.submitted && (
          <p style={{ color: 'green', marginTop: '1rem' }}>
            ✅ Transaction submitted!
          </p>
        )}
      </section>
    </div>
  );
}

export default XLMGuardHomePage;

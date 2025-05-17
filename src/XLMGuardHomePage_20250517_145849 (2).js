import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

function XLMGuardHomePage() {
  const [form, setForm] = useState({
    wallet: '',
    memo: '',
    contract: '',
    payment: '',
    email: '',
    submitted: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form to Firestore...");
    try {
      await addDoc(collection(db, "submissions"), {
        wallet: form.wallet,
        memo: form.memo,
        contract: form.contract,
        payment: form.payment,
        email: form.email,
        submittedAt: serverTimestamp(),
        status: "pending",
      });
      setForm({ ...form, submitted: true });
      alert("✅ Submission saved to Firestore!");
    } catch (err) {
      console.error("Error saving submission:", err);
      alert("❌ Failed to submit. Please try again.");
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '60px', marginRight: '1rem' }} />
        <h1>XLMGuard</h1>
      </header>

      <section>
        <h2>Protect Your XLM Transactions with Confidence</h2>
        <p style={{ fontSize: '1.1rem' }}>
          Fast, flat-fee protection for Stellar payments. Submit your transaction details, and we’ll record and protect the agreement using Firestore.
        </p>
        <a
          href="https://pay.seobot.online/xlmguard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            💳 Pay $25 for Protection
          </button>
        </a>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h3>Submit Transaction for Protection</h3>
        <p>Fill out all fields below. Once submitted, your contract will be recorded with a timestamp for proof and dispute resolution.</p>
        <form onSubmit={handleSubmit}>
          <input
            name="wallet"
            placeholder="Wallet Address"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '10px', width: '100%' }}
          />
          <input
            name="memo"
            placeholder="Memo"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '10px', width: '100%' }}
          />
          <textarea
            name="contract"
            placeholder="Contract Details"
            onChange={handleChange}
            required
            rows={4}
            style={{ display: 'block', margin: '0.5rem 0', padding: '10px', width: '100%' }}
          />
          <input
            name="payment"
            placeholder="Payment Confirmation Code"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '10px', width: '100%' }}
          />
          <input
            name="email"
            placeholder="Your Email"
            type="email"
            onChange={handleChange}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '10px', width: '100%' }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        </form>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h3>About XLMGuard</h3>
        <p>
          XLMGuard is a lightweight web tool designed to add transactional accountability and trust to the Stellar blockchain.
          We store contract terms and proof of agreement securely in Google Firestore. Perfect for freelancers, vendors,
          small businesses, and private transactions.
        </p>
      </section>
    </div>
  );
}

export default XLMGuardHomePage;

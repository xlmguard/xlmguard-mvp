import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <img src="/logo.png" alt="XLMGuard Logo" style={{ height: '60px', marginRight: '1rem' }} />
        <h1>XLMGuard</h1>
      </header>

      <section>
        <h2>Protect Your XLM & XRP Transactions</h2>
        <p>Fast, flat-fee protection for Stellar (XLM) and Ripple (XRP) payments.</p>
        <p>Simply register, pay a one-time fee, and log your transaction so we can help track and validate it securely.</p>
        <Link to="/register">
          <button style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', borderRadius: '6px' }}>
            Register to Start
          </button>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;

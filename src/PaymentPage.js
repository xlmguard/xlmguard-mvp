// PaymentPage.js
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { auth, db } from './firebase.js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const PaymentPage = () => {
  const [amountUSD, setAmountUSD] = useState('');
  const [serviceFee, setServiceFee] = useState(0);
  const [currency, setCurrency] = useState('XLM');
  const [xlmPrice, setXlmPrice] = useState(null);
  const [xrpPrice, setXrpPrice] = useState(null);
  const [usdcPrice, setUsdcPrice] = useState(1); // USDC ~1 USD
  const [txHash, setTxHash] = useState('');

  const walletDetails = {
    XLM: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      memo: '1095582935',
      network: 'Stellar'
    },
    XRP: {
      address: 'rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J',
      memo: '1952896539',
      network: 'XRP Ledger'
    },
    USDC: {
      address: 'GCF74576I7AQ56SLMKBQAP255EGUOWCRVII3S44KEXVNJEOIFVBDMXVL',
      memo: '1095582935',
      network: 'Stellar (USDC)'
    }
  };

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar,usd-coin,ripple&vs_currencies=usd');
        const data = await res.json();
        setXlmPrice(data.stellar?.usd || null);
        setXrpPrice(data.ripple?.usd || null);
        setUsdcPrice(data['usd-coin']?.usd || 1);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  // Calculate service fee
  useEffect(() => {
    if (amountUSD) {
      const calculated = Math.max(amountUSD * 0.0075, 100);
      setServiceFee(calculated);
    } else {
      setServiceFee(0);
    }
  }, [amountUSD]);

  const selectedWallet = walletDetails[currency];
  let pricePerCoin = currency === 'XLM' ? xlmPrice : currency === 'XRP' ? xrpPrice : usdcPrice;
  const amountCrypto = pricePerCoin ? (serviceFee / pricePerCoin).toFixed(4) : '0.0000';

  const qrValue = currency === 'XRP'
    ? `ripple:${selectedWallet.address}?dt=${selectedWallet.memo}&amount=${amountCrypto}`
    : `stellar:${selectedWallet.address}?memo=${selectedWallet.memo}&amount=${amountCrypto}`;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Make a Payment</h2>
      <p>
        XLMGuard service fee is <strong>0.75%</strong> of your transaction amount, with a <strong>$100.00</strong> minimum.
      </p>

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
        <label><strong>Transaction Amount (USD)</strong></label>
        <input
          type="number"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
        <p>
          Calculated Service Fee (USD): <strong>${serviceFee.toFixed(2)}</strong> (greater of 0.75% or $100)
        </p>
      </div>

      <label>Pay Fee With: </label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="XLM">XLM</option>
        <option value="XRP">XRP</option>
        <option value="USDC">USDC</option>
      </select>

      <div style={{ marginTop: '15px' }}>
        <p><strong>Network:</strong> {selectedWallet.network}</p>
        <p><strong>Wallet Address:</strong> {selectedWallet.address}</p>
        <p><strong>Memo/Tag:</strong> {selectedWallet.memo}</p>
        <p><strong>Send:</strong> {amountCrypto} {currency} (≈ ${serviceFee.toFixed(2)} at current rates)</p>

        <h4>Scan QR Code to Pay:</h4>
        <QRCode value={qrValue} size={150} />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>Transaction Hash:</label>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
    </div>
  );
};

export default PaymentPage;


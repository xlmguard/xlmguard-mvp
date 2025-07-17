// monitorStellarTx.js
require('dotenv').config();
const { Server } = require('@stellar/stellar-sdk'); // ✅ Use official SDK
const admin = require('firebase-admin');

// Load Firebase service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const server = new Server('https://horizon.stellar.org'); // Use 'https://horizon-testnet.stellar.org' for testnet

const ESCROW_PUBLIC_KEY = process.env.ESCROW_PUBLIC_KEY;

if (!ESCROW_PUBLIC_KEY) {
  console.error('❌ ESCROW_PUBLIC_KEY is missing from .env');
  process.exit(1);
}

console.log(`🔍 Monitoring Stellar account: ${ESCROW_PUBLIC_KEY}`);

// Stream real-time payments to the escrow account
server
  .payments()
  .forAccount(ESCROW_PUBLIC_KEY)
  .cursor('now')
  .stream({
    onmessage: async (payment) => {
      if (payment.type !== 'payment' || payment.asset_type !== 'native') return;

      const txId = payment.transaction_hash;
      const amount = payment.amount;

      console.log(`💰 Payment detected - TXID: ${txId}, Amount: ${amount}`);

      try {
        await db.collection('transactions').add({
          escrow: ESCROW_PUBLIC_KEY,
          transactionId: txId,
          amount,
          currency: 'XLM',
          createdAt: admin.firestore.Timestamp.now(),
          notes: 'Auto-imported from Stellar'
        });

        console.log('✅ Transaction inserted into Firestore');
      } catch (err) {
        console.error('❌ Firestore insert error:', err);
      }
    },
    onerror: (error) => {
      console.error('❌ Stellar stream error:', error);
    }
  });




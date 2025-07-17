// monitorStellarTx.js
require('dotenv').config();
const { Server } = require('@stellar/stellar-sdk');
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc
} = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Stellar
const server = new Server('https://horizon-testnet.stellar.org');
const ESCROW_ACCOUNT = process.env.ESCROW_PUBLIC_KEY;

async function monitorTransactions() {
  console.log('🔍 Checking for new escrow transactions...');

  try {
    const transactions = await server.transactions()
      .forAccount(ESCROW_ACCOUNT)
      .order('desc')
      .limit(10)
      .call();

    for (const tx of transactions.records) {
      const txid = tx.id;

      // Check if TX already exists
      const q = query(collection(db, 'transactions'), where('transactionId', '==', txid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(collection(db, 'transactions'), {
          transactionId: txid,
          createdAt: new Date(),
          currency: 'XLM',
          amount: 'Unknown',
          notes: 'Auto-imported from Stellar',
          documentApprovalStatus: 'Pending'
        });
        console.log(`✅ Added new TXID to Firestore: ${txid}`);
      } else {
        console.log(`⏭ TXID already exists: ${txid}`);
      }
    }
  } catch (error) {
    console.error('❌ Error monitoring transactions:', error);
  }
}

monitorTransactions();

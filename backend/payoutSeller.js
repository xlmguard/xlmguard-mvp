// backend/payoutSeller.js

require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const StellarSdk = require('@stellar/stellar-sdk');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Stellar setup
const server = new StellarSdk.Server('https://horizon.stellar.org');
const sourceKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_SECRET);
const sourcePublicKey = sourceKeypair.publicKey();

async function payoutSellers() {
  try {
    const transactionsRef = db.collection('transactions');
    const snapshot = await transactionsRef
      .where('documentApprovalStatus', '==', 'Approved')
      .where('payoutCompleted', '!=', true)
      .get();

    if (snapshot.empty) {
      console.log('✅ No approved transactions pending payout.');
      return;
    }

    for (const doc of snapshot.docs) {
      const tx = doc.data();

      if (!tx.sellerWallet || !tx.amount) {
        console.warn(`⚠️ Skipping ${doc.id}: Missing seller wallet or amount.`);
        continue;
      }

      const amountStr = String(tx.amount);
      console.log(`🔁 Processing payout of ${amountStr} XLM to ${tx.sellerWallet}`);

      try {
        const account = await server.loadAccount(sourcePublicKey);

        const transaction = new StellarSdk.TransactionBuilder(account, {
          fee: await server.fetchBaseFee(),
          networkPassphrase: StellarSdk.Networks.PUBLIC,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: tx.sellerWallet,
              asset: StellarSdk.Asset.native(),
              amount: amountStr,
            })
          )
          .setTimeout(30)
          .build();

        transaction.sign(sourceKeypair);
        const result = await server.submitTransaction(transaction);

        console.log(`✅ Paid ${amountStr} XLM to ${tx.sellerWallet} - TXID: ${result.hash}`);

        await doc.ref.update({
          payoutCompleted: true,
          payoutTxId: result.hash,
          payoutTimestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`❌ Failed to payout for transaction ${doc.id}:`, err.response?.data || err);
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error during payout run:', err);
  }
}

// Run immediately
payoutSellers();

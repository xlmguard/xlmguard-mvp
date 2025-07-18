// backend/payoutSeller.mjs

import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Keypair, Server, Networks, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Stellar setup
const server = new Server('https://horizon.stellar.org');
const sourceKeypair = Keypair.fromSecret(process.env.STELLAR_SECRET);
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

        const transaction = new TransactionBuilder(account, {
          fee: await server.fetchBaseFee(),
          networkPassphrase: Networks.PUBLIC,
        })
          .addOperation(
            Operation.payment({
              destination: tx.sellerWallet,
              asset: Asset.native(),
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

payoutSellers();



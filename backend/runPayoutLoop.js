// backend/runPayoutLoop.js

const { exec } = require('child_process');

function runPayoutScript() {
  console.log('⏳ Checking for eligible payouts...');

  exec('node backend/payoutSeller.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Payout script error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Payout script stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`✅ Payout script output:\n${stdout}`);
    }
  });
}

// Run every 5 minutes (300,000 ms)
setInterval(runPayoutScript, 300000);

console.log('🟢 Payout loop started. Running every 5 minutes...');

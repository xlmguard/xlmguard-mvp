// SellerConfirmationPanel.js
import React from 'react';

function SellerConfirmationPanel() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h2>Seller Shipment Confirmation</h2>
      <p>Please log in and upload the Bill of Lading and product photos using the matching TXID.</p>
      {/* Additional logic for file upload, TXID validation, and confirmation tracking can go here */}
    </div>
  );
}

export default SellerConfirmationPanel;




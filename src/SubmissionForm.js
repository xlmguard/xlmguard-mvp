return (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h2>Submit Transaction</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
      <label style={{ marginTop: '10px' }}>Currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="XLM">XLM</option>
        <option value="XRP">XRP</option>
        <option value="USDC">USDC</option>
      </select>

      <label style={{ marginTop: '10px' }}>Transaction Type:</label>
      <label>
        <input
          type="radio"
          value="auto"
          checked={submissionMode === 'auto'}
          onChange={() => setSubmissionMode('auto')}
        /> Auto: Detect from Lobstr/Vault or Explorer
      </label>
      <label>
        <input
          type="radio"
          value="manual"
          checked={submissionMode === 'manual'}
          onChange={() => setSubmissionMode('manual')}
        /> Manual: Enter your TXID
      </label>

      {submissionMode === 'manual' && (
        <>
          <label style={{ marginTop: '10px' }}>Transaction ID:</label>
          <input
            type="text"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
          />
        </>
      )}

      <label style={{ marginTop: '10px' }}>Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <label style={{ marginTop: '10px' }}>Notes:</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ height: '60px' }}
      />

      <label style={{ marginTop: '10px' }}>Upload Contract (PDF/DOC):</label>
      <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

      <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
    </form>

    {message && <p style={{ marginTop: '10px' }}>{message}</p>}

    <div style={{ marginTop: '30px' }}>
      <button onClick={() => navigate('/')} style={{ marginRight: '10px' }}>
        Return to Home Page
      </button>
      <button
        onClick={handleLogout}
        style={{ backgroundColor: '#f00', color: '#fff' }}
      >
        Logout
      </button>
    </div>
  </div>
);


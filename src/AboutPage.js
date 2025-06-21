import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    // existing content unchanged
    // ...
  };

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        backgroundImage: "url('/earthbackgrownd.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'white'
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <img
          src="/logo.png"
          alt="XLMGuard Logo"
          style={{ width: '210px', marginBottom: '20px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lang">Language: </label>
        <select
          id="lang"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ color: 'black' }}
        >
          <option value="en">English</option>
          <option value="ja">Japanese</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="hi">Hindi</option>
          <option value="zh">Chinese</option>
          <option value="fr">French</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <h2>{content[language].heading}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{content[language].body}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default AboutPage;





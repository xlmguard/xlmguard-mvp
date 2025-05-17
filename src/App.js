import React, { useState } from 'react';
import XLMGuardHomePage from './XLMGuardHomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {!isLoggedIn ? (
        <>
          {showRegister ? (
            <RegisterForm onRegisterSuccess={() => setIsLoggedIn(true)} />
          ) : (
            <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
          )}
          <button
            onClick={() => setShowRegister(!showRegister)}
            style={{
              marginTop: '1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </>
      ) : (
        <XLMGuardHomePage />
      )}
    </div>
  );
}

export default App;

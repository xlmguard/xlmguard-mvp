// HomePage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function HomePage() {
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const descriptions = {
    English: 'XLMGuard protects your XLM and XRP transactions with timestamped transaction verification and secure seller confirmations.',
    French: 'XLMGuard protège vos transactions XLM et XRP avec une vérification horodatée et des confirmations de vendeur sécurisées.',
    Spanish: 'XLMGuard protege sus transacciones XLM y XRP con verificación de transacción con sello de tiempo y confirmaciones seguras del vendedor.',
    German: 'XLMGuard schützt Ihre XLM- und XRP-Transaktionen mit zeitgestempelter Transaktionsverifizierung und sicheren Verkäuferbestätigungen.',
    Chinese: 'XLMGuard 使用时间戳验证和安全的卖家确认来保护您的 XLM 和 XRP 交易。',
    Arabic: 'XLMGuard يحمي معاملات XLM و XRP الخاصة بك من خلال التحقق من المعاملة بختم زمني وتأكيدات البائع الآمنة.',
    Hindi: 'XLMGuard आपकी XLM और XRP लेन-देन को समय-मुद्रित सत्यापन और सुरक्षित विक्रेता पुष्टि के साथ सुरक्षित करता है।'
  };

  const allLanguages = [
    'English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Hindi',
    'Afrikaans', 'Albanian', 'Amharic', 'Arabic (Egyptian Spoken)', 'Arabic (Levantine)', 'Arabic (Modern Standard)',
    'Arabic (Moroccan Spoken)', 'Arabic (Overview)', 'Aramaic', 'Armenian', 'Assamese', 'Aymara', 'Azerbaijani', 'Balochi',
    'Bamanankan', 'Bashkort (Bashkir)', 'Basque', 'Belarusan', 'Bengali', 'Bhojpuri', 'Bislama', 'Bosnian', 'Brahui', 'Bulgarian',
    'Burmese', 'Cantonese', 'Catalan', 'Cebuano', 'Chechen', 'Cherokee', 'Croatian', 'Czech', 'Dakota', 'Danish', 'Dari',
    'Dholuo', 'Dutch', 'Esperanto', 'Estonian', 'Éwé', 'Finnish', 'Georgian', 'German', 'Gikuyu', 'Greek', 'Guarani',
    'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hawaiian Creole', 'Hebrew', 'Hiligaynon', 'Hindi', 'Hungarian',
    'Icelandic', 'Igbo', 'Ilocano', 'Indonesian (Bahasa Indonesia)', 'Inuit/Inupiaq', 'Irish Gaelic', 'Italian', 'Japanese',
    'Jarai', 'Javanese', 'K’iche’', 'Kabyle', 'Kannada', 'Kashmiri', 'Kazakh', 'Khmer', 'Khoekhoe', 'Korean', 'Kurdish', 'Kyrgyz',
    'Lao', 'Latin', 'Latvian', 'Lingala', 'Lithuanian', 'Macedonian', 'Maithili', 'Malagasy', 'Malay (Bahasa Melayu)',
    'Malayalam', 'Mandarin (Chinese)', 'Marathi', 'Mende', 'Mongolian', 'Nahuatl', 'Navajo', 'Nepali', 'Norwegian', 'Ojibwa',
    'Oriya', 'Oromo', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua', 'Romani', 'Romanian', 'Russian', 'Rwanda',
    'Samoan', 'Sanskrit', 'Serbian', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovene', 'Somali', 'Swahili', 'Swedish',
    'Tachelhit', 'Tagalog', 'Tajiki', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Tibetic Languages', 'Tigrigna', 'Tok Pisin', 'Turkish',
    'Turkmen', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese', 'Warlpiri', 'Welsh', 'Wolof', 'Xhosa', 'Yakut', 'Yiddish',
    'Yoruba', 'Yucatec', 'Zapotec', 'Zulu'
  ];

  return (
    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      <img
        src="/logo.png"
        alt="XLMGuard Logo"
        style={{ width: '210px', marginBottom: '20px' }}
      />
      <h1>Welcome to XLMGuard</h1>
      <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '16px' }}>{descriptions[language] || descriptions['English']}</p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px' }}>Register</button>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>Login</button>
        <button onClick={() => navigate('/seller-confirm')} style={{ marginRight: '10px' }}>Seller Shipment Confirmation</button>
        <button onClick={() => navigate('/transaction-lookup')} style={{ marginRight: '10px' }}>Transaction Lookup</button>
        <button onClick={() => navigate('/submit')} style={{ marginRight: '10px' }}>Submit Transaction</button>
        <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
        <Link to="/about">
          <button>About XLMGuard</button>
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <footer style={{ marginTop: '60px', fontSize: '12px', color: '#666' }}>
        &copy; {new Date().getFullYear()} XLMGuard.com – All information on this site is protected by U.S. copyright laws.
      </footer>
    </div>
  );
}

export default HomePage;

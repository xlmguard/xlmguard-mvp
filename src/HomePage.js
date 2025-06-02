// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();

  const handleLanguageChange = (e) => { 
    setLanguage(e.target.value);
  };

  const descriptions = {
    English: 'XLMGuard protects your XLM and XRP transactions with timestamped transaction verification and secure seller confirmations.',
    // Add translations for other languages as needed
  };

  const allLanguages = [
    'English', 'Afrikaans', 'Albanian', 'Amharic', 'Arabic (Egyptian Spoken)', 'Arabic (Levantine)', 'Arabic (Modern Standard)',
    'Arabic (Moroccan Spoken)', 'Arabic (Overview)', 'Aramaic', 'Armenian', 'Assamese', 'Aymara', 'Azerbaijani', 'Balochi',
    'Bamanankan', 'Bashkort (Bashkir)', 'Basque', 'Belarusan', 'Bengali', 'Bhojpuri', 'Bislama', 'Bosnian', 'Brahui', 'Bulgarian',
    'Burmese', 'Cantonese', 'Catalan', 'Cebuano', 'Chechen', 'Cherokee', 'Croatian', 'Czech', 'Dakota', 'Danish', 'Dari',
    'Dholuo', 'Dutch', 'Esperanto', 'Estonian', 'Éwé', 'Finnish', 'French', 'Georgian', 'German', 'Gikuyu', 'Greek', 'Guarani',
    'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hawaiian Creole', 'Hebrew', 'Hiligaynon', 'Hindi', 'Hungarian',
    'Icelandic', 'Igbo', 'Ilocano', 'Indonesian (Bahasa Indonesia)', 'Inuit/Inupiaq', 'Irish Gaelic', 'Italian', 'Japanese',
    'Jarai', 'Javanese', 'K’iche’', 'Kabyle', 'Kannada', 'Kashmiri', 'Kazakh', 'Khmer', 'Khoekhoe', 'Korean', 'Kurdish', 'Kyrgyz',
    'Lao', 'Latin', 'Latvian', 'Lingala', 'Lithuanian', 'Macedonian', 'Maithili', 'Malagasy', 'Malay (Bahasa Melayu)',
    'Malayalam', 'Mandarin (Chinese)', 'Marathi', 'Mende', 'Mongolian', 'Nahuatl', 'Navajo', 'Nepali', 'Norwegian', 'Ojibwa',
    'Oriya', 'Oromo', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua', 'Romani', 'Romanian', 'Russian', 'Rwanda',
    'Samoan', 'Sanskrit', 'Serbian', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovene', 'Somali', 'Spanish', 'Swahili', 'Swedish',
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
      <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '16px' }}>{descriptions[language]}</p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/register')} style={{ marginRight: '10px' }}>Register</button>
        <button onClick={() => navigate('/login')}>Login</button>
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














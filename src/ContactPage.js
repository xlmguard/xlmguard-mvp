import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:support@xlmguard.com?subject=Contact from ${encodeURIComponent(
      form.name
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )}`;

    window.open(mailtoLink, '_blank'); // Open mail client in a new tab
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Contact Us</h2>
      {submitted ? (
        <>
          <p>Thank you! Your email client should now be open to send the message.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Return to Home Page
          </button>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '400px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            style={{ padding: '10px', fontSize: '16px', height: '120px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}




import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        timestamp: Timestamp.now()
      });
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Error submitting message.');
    }
  };

  // Auto-redirect to home page after 4 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you! We will get back to you shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
            Send
          </button>
        </form>
      )}
    </div>
  );
}


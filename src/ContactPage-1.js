// ContactPage.js
import React, { useState } from 'react';
import { db } from './firebase.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you! We will get back to you shortly.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, 'submissions'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmissions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '4rem' }}>
      <h3>Admin Dashboard</h3>
      {loading ? (
        <p>Loading submissions...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Wallet</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Memo</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((entry) => (
              <tr key={entry.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.wallet}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.memo}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {entry.submittedAt?.toDate ? entry.submittedAt.toDate().toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, 'submissions'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmissions(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = submissions.filter(entry =>
      entry.email?.toLowerCase().includes(search.toLowerCase()) ||
      entry.memo?.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate().getTime() : 0;
      const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate().getTime() : 0;
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    setFiltered(result);
  }, [search, submissions, sortAsc]);

  return (
    <div style={{ marginTop: '4rem' }}>
      <h3>Admin Dashboard</h3>

      <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search by email or memo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '60%' }}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sort by Date {sortAsc ? '↑' : '↓'}
        </button>
      </div>

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
          {filtered.map((entry) => (
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
    </div>
  );
}

export default AdminDashboard;

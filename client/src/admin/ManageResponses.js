import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3004/api/responses')
      .then(res => {
        setResponses(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Anket Cevapları</h2>
      <ul>
        {responses.map(r => (
          <li key={r._id} style={{ margin: '15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <strong>Anket ID:</strong> {r.surveyId}<br />
            <strong>Cevaplar:</strong> {JSON.stringify(r.answers)}<br />
            <small>{new Date(r.createdAt).toLocaleString('tr-TR')}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

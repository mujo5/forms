// En üstte:
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

export default function ManageSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState(null);
  const [showQr, setShowQr] = useState(false);

  const fetchSurveys = () => {
    axios.get('http://localhost:3004/api/surveys')
      .then(res => {
        setSurveys(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const deleteSurvey = async (id) => {
    if (window.confirm('Bu anketi silmek istediğinizden emin misiniz?')) {
      await axios.delete(`http://localhost:3004/api/surveys/${id}`);
      fetchSurveys();
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert('✅ Anket linki kopyalandı:\n' + url);
  };

  const handleShowQr = (url) => {
    setQrUrl(url);
    setShowQr(true);
  };

  const closeQr = () => {
    setShowQr(false);
    setQrUrl(null);
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center', fontSize: '18px' }}>⏳ Yükleniyor...</div>;

  return (
    <div style={{
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f4f6f8', // 👈 yeni background
      minHeight: '100vh'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '30px',
        color: '#2c3e50'
      }}>📋 Mevcut Anketler</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {surveys.map(survey => {
          const shareUrl = `http://localhost:3000/survey/${survey._id}`;

          return (
            <li key={survey._id} style={{
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>{survey.title}</h3>
              <p style={{ fontSize: '13px', color: '#7f8c8d' }}>
                Oluşturulma: {new Date(survey.createdAt).toLocaleString('tr-TR')}
              </p>

              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                {survey.questions.map(q => (
                  <li key={q._id} style={{ fontSize: '14px', color: '#555' }}>
                    • {q.text} <span style={{ fontStyle: 'italic', color: '#999' }}>({q.type})</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link to={`/admin/edit-survey/${survey._id}`}>
                  <button style={buttonStylePrimary}>✏️ Düzenle</button>
                </Link>

                <button onClick={() => deleteSurvey(survey._id)} style={buttonStyleDanger}>
                  🗑️ Sil
                </button>

                <button onClick={() => handleCopy(shareUrl)} style={buttonStyleInfo}>
                  🔗 Linki Kopyala
                </button>

                <button onClick={() => handleShowQr(shareUrl)} style={buttonStyleQr}>
                  📱 QR Kod Göster
                </button>
              </div>

              <div style={{ marginTop: '10px', fontSize: '13px', color: '#555' }}>
                <strong>Paylaşım Linki:</strong> <br />
                <a href={shareUrl} target="_blank" rel="noreferrer" style={{ color: '#2980b9' }}>{shareUrl}</a>
              </div>
            </li>
          );
        })}
      </ul>

      {showQr && qrUrl && (
        <div onClick={closeQr} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          cursor: 'pointer'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>📱 QR Kod</h3>
            <QRCodeCanvas value={qrUrl} size={250} level="H" includeMargin={true} />
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#888' }}>
              QR'ye tıklayarak kapatabilirsiniz
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Daha yumuşak ve uyumlu buton stilleri
const buttonStyleBase = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: 'white',
  transition: 'all 0.3s ease'
};

const buttonStylePrimary = {
  ...buttonStyleBase,
  backgroundColor: '#2c7be5'
};

const buttonStyleDanger = {
  ...buttonStyleBase,
  backgroundColor: '#d33f49'
};

const buttonStyleInfo = {
  ...buttonStyleBase,
  backgroundColor: '#38b2ac'
};

const buttonStyleQr = {
  ...buttonStyleBase,
  backgroundColor: '#6c5ce7'
};

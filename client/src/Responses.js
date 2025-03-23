import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Responses() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Testing server connection...');
    
    // First test if the server is running at all
    axios.get('http://localhost:3004/api/questions')
      .then(res => {
        console.log('Server is reachable, questions:', res.data);
        // If we can reach the server, now try to get responses
        return axios.get('http://localhost:3004/api/responses');
      })
      .then(res => {
        console.log('Received responses:', res.data);
        setResponses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error details:', err);
        if (err.response) {
          console.error('Error status:', err.response.status);
          console.error('Error data:', err.response.data);
        } else if (err.request) {
          console.error('No response received. Server might be down.');
        } else {
          console.error('Error setting up request:', err.message);
        }
        setError('Verileri getirirken bir hata oluştu: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>Hata Oluştu</h1>
          <p style={{ color: '#e53e3e' }}>{error}</p>
          <p style={{ marginTop: '20px' }}>Lütfen sunucunun çalıştığından emin olun.</p>
        </div>
      </div>
    );
  }

  // Rest of your component remains the same
  if (responses.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>Anket Cevapları</h1>
          <p style={{ color: '#4a5568' }}>Henüz hiç anket cevabı bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const getQuestionText = (questionId) => {
    const questions = {
      1: "Hizmet memnuniyetiniz",
      2: "Temizlik puanı",
      3: "Personelden memnuniyet",
      4: "İstek ve öneriler"
    }
    return questions[questionId] || `Soru ${questionId}`
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2d3748', marginBottom: '30px', textAlign: 'center' }}>
          Anket Cevapları
        </h1>
        {responses.map(response => (
          <div key={response._id} style={{ 
            margin: '20px 0',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>
              Anket #{response.surveyId}
            </h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Tarih: {new Date(response.createdAt).toLocaleString('tr-TR')}
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {Object.entries(response.answers).map(([questionId, answer]) => (
                <div key={questionId} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <strong>{getQuestionText(questionId)}:</strong>{' '}
                  {questionId === '4' ? (
                    <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{answer}</div>
                  ) : (
                    <span>{answer}/5</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
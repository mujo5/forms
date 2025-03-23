import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Survey() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/api/surveys/${surveyId}`);
        setSurvey(response.data);

        // Varsayılan cevapları ayarla (range için)
        const defaultAnswers = {};
        response.data.questions.forEach((q) => {
          if (q.type === 'range') {
            defaultAnswers[q._id] = Math.floor((q.min + q.max) / 2);
          }
        });
        setAnswers(defaultAnswers);
      } catch (err) {
        console.error('Anket getirilemedi:', err);
        setError('Anket yüklenirken bir hata oluştu.');
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3004/api/submit', {
        surveyId,
        answers,
      });
      navigate('/thank-you');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError('Cevaplar kaydedilemedi.');
    }
  };

  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!survey) return <div style={{ padding: 20 }}>Yükleniyor...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{
          color: '#2d3748',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          {survey.title}
        </h2>

        <form onSubmit={handleSubmit}>
          {survey.questions.map(q => (
            <div key={q._id} style={{
              margin: '25px 0',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>{q.text}</label>
              {q.type === 'textarea' ? (
                <textarea
                  onChange={e => handleAnswerChange(q._id, e.target.value)}
                  value={answers[q._id] || ''}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Lütfen görüşlerinizi buraya yazın..."
                />
              ) : (
                <>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={answers[q._id] || q.min}
                    onChange={e => handleAnswerChange(q._id, parseInt(e.target.value))}
                    style={{ width: '100%', margin: '10px 0' }}
                  />
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    Puan: {answers[q._id] || q.min}
                  </div>
                </>
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              display: 'block',
              margin: '30px auto 0',
            }}
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}

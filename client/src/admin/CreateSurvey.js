import { useState, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { id: Date.now(), text: '', min: 1, max: 5, type: 'range' },
  ]);
  const [newSurveyUrl, setNewSurveyUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState('');
  const qrWrapperRef = useRef(null);

  // Yeni soru ekleme
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        id: Date.now(),
        text: '', 
        min: 1, 
        max: 5, 
        type: 'range'
      }
    ]);
  };

  // Soru güncelleme
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!title.trim()) {
      setError('Lütfen anket başlığı giriniz');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3004/api/surveys', {
        title: title.trim(),
        questions: questions.map(q => ({
          text: q.text.trim(),
          type: q.type,
          min: q.type === 'range' ? q.min : undefined,
          max: q.type === 'range' ? q.max : undefined
        }))
      });

      const newSurveyId = response.data.survey._id;
      setNewSurveyUrl(`http://localhost:3000/survey/${newSurveyId}`);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Anket oluşturulamadı');
      console.error('Hata:', err.response?.data || err.message);
    }
  };

  // QR indirme
  const handleDownload = () => {
    const canvas = qrWrapperRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'anket-qr.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Yeni Anket Oluştur</h2>

      {error && (
        <div style={{ 
          color: '#dc3545',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        background: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#495057'
          }}>
            Anket Başlığı
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '1px solid #ced4da',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            style={{
              marginBottom: '20px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}
          >
            <input
              type="text"
              name="text"
              placeholder={`Soru ${index + 1}`}
              value={q.text}
              onChange={(e) => handleQuestionChange(index, e)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                marginBottom: '15px',
                border: '1px solid #ced4da',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
            
            <select
              name="type"
              value={q.type}
              onChange={(e) => handleQuestionChange(index, e)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ced4da',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="range">Puanlama (1-5)</option>
              <option value="textarea">Yazılı Cevap</option>
            </select>
          </div>
        ))}

        <div style={{ 
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={addQuestion}
            style={{
              padding: '12px 25px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#357abd'
              }
            }}
          >
            ➕ Yeni Soru Ekle
          </button>

          <button
            type="submit"
            style={{
              padding: '12px 25px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#218838'
              }
            }}
          >
            📤 Anketi Oluştur
          </button>
        </div>
      </form>

      {newSurveyUrl && (
        <div style={{ 
          marginTop: '40px',
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            color: '#2c3e50',
            marginBottom: '25px',
            fontSize: '1.5rem'
          }}>
            QR Kod ile Paylaş
          </h3>

          <div 
            ref={qrWrapperRef}
            onClick={() => setIsFullscreen(true)}
            style={{ 
              display: 'inline-block',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              ':hover': {
                transform: 'scale(1.03)'
              }
            }}
          >
            <QRCodeCanvas
              value={newSurveyUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <div style={{ marginTop: '25px' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '12px 30px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'background-color 0.3s',
                ':hover': {
                  backgroundColor: '#138496'
                }
              }}
            >
              ⬇️ QR Kodunu İndir
            </button>
          </div>

          {isFullscreen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => setIsFullscreen(false)}
            >
              <div style={{ 
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }}>
                <QRCodeCanvas
                  value={newSurveyUrl}
                  size={350}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
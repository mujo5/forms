import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3004/api/surveys/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setQuestions(res.data.questions);
      });
  }, [id]);

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3004/api/surveys/${id}`, { title, questions });
    navigate('/admin/surveys');
  };

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>🛠️ Anketi Düzenle</h2>

      <form 
        onSubmit={handleSubmit} 
        style={{
          backgroundColor: '#f9f9f9',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Anket Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Anket başlığını girin"
            style={{
              padding: '12px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        {questions.map((q, index) => (
          <div 
            key={q._id} 
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #eee',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
              Soru {index + 1}
            </label>
            <input
              type="text"
              name="text"
              value={q.text}
              onChange={(e) => handleQuestionChange(index, e)}
              required
              placeholder="Soru metni"
              style={{
                padding: '10px',
                width: '100%',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px'
              }}
            />
            <select
              name="type"
              value={q.type}
              onChange={(e) => handleQuestionChange(index, e)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: 'white'
              }}
            >
              <option value="range">📊 Puanlama (1-5)</option>
              <option value="textarea">📝 Yazılı Cevap</option>
            </select>
          </div>
        ))}

        <button 
          type="submit"
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '14px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
        >
          💾 Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
}

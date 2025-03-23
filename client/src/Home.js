import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '2rem',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        backgroundColor: 	'rgba(255, 255, 255, 0.2)',
        padding: '10px 20px',
        borderRadius: '12px'
      }}>Ankete Katıl</h1>
      
      <button 
        onClick={() => navigate('/survey/1')}
        className="start-button"
      >
        Anketi Başlat
      </button>
    </div>
  );
}

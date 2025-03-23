import { useNavigate } from 'react-router-dom'

export default function ThankYou() {
  const navigate = useNavigate()

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>
          Teşekkür Ederiz!
        </h1>
        <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '30px' }}>
          Anketimize katıldığınız için teşekkür ederiz. Görüşleriniz bizim için çok değerli.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '12px 30px',
            fontSize: '1rem',
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  )
}

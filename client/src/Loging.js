import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3004/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin'); // Başarılı giriş sonrası admin paneline yönlendir
    } catch (err) {
      alert('Giriş başarısız! Kullanıcı adı ya da şifre hatalı.');
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Giriş</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Giriş Yap</button>
      </form>
    </div>
  );
}

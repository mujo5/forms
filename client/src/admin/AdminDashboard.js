import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token'ı sil
    navigate('/login'); // Login sayfasına yönlendir
  };

  return (
    <div className="admin-container">
      <h1>Admin Paneli</h1>

      <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>

      <nav>
        <ul className="admin-links">
          <li><Link to="/admin/surveys">Anketleri Yönet</Link></li>
          <li><Link to="/admin/responses">Cevapları Yönet</Link></li>
          <li><Link to="/admin/analytics">Analiz</Link></li>
        </ul>
      </nav>
    </div>

  );
}

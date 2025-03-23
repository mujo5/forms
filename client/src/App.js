import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Loging';
import ProtectedRoute from './protectedRoute';
import Survey from './Survey';
import ThankYou from './ThankYou';
import Responses from './Responses';
// Yeni Admin Sayfaları
import AdminDashboard from './admin/AdminDashboard';
import ManageSurveys from './admin/ManageSurveys';
import ManageResponses from './admin/ManageResponses';
import CreateSurvey from './admin/CreateSurvey';
import EditSurvey from './admin/EditSurvey';
import ResponseAnalytics from './admin/ResponseAnalytics';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/survey/:id" element={<Survey />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/responses" element={<Responses />} />
      {/* Admin Routes */}
      {/* Giriş Sayfası */}
      <Route path="/login" element={<Login />} />
      {/* Admin Korumalı Sayfalar */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/surveys" element={
        <ProtectedRoute>
          <ManageSurveys />
        </ProtectedRoute>
      } />
      <Route path="/admin/responses" element={
        <ProtectedRoute>
          <ManageResponses />
        </ProtectedRoute>
      } />
      <Route path="/admin/create-survey" element={
        <ProtectedRoute>
          <CreateSurvey />
        </ProtectedRoute>
      } />
      <Route path="/admin/edit-survey/:id" element={
        <ProtectedRoute>
          <EditSurvey />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <ResponseAnalytics />
        </ProtectedRoute>
      } />



    </Routes>
  );
}

export default App;

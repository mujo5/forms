const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Survey = require('./models/Survey');
const Response = require('./models/Response'); // doğru model importu
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Mock data for testing
const questions = [
  { id: 1, text: "Hizmet memnuniyetiniz?", min: 1, max: 5, type: "range" },
  { id: 2, text: "Temizlik puanı?", min: 1, max: 5, type: "range" },
  { id: 3, text: "Personelden memnun musunuz?", min: 1, max: 5, type: "range" },
  { id: 4, text: "İstek ve önerileriniz:", type: "textarea" }
];

const adminUser = {
    username: 'admin',
    passwordHash: bcrypt.hashSync('123456', 10) // şifre: 123456
  };

const JWT_SECRET = 'gizliAnahtar'; // .env ile güvenceye alınabilir

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username !== adminUser.username) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }
  
    const isPasswordValid = bcrypt.compareSync(password, adminUser.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Şifre hatalı' });
    }
  
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token eksik' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      res.status(403).json({ error: 'Token geçersiz' });
    }
  }

app.get('/api/admin-only', verifyToken, (req, res) => {
    res.json({ message: 'Bu korumalı alana erişimin var!' });
  });
  
  
// Mock responses for testing
let mockResponses = [
  {
    _id: '1',
    surveyId: '1',
    answers: {
      1: '4',
      2: '5',
      3: '3',
      4: 'Çok memnun kaldım, teşekkürler!'
    },
    createdAt: new Date()
  }
];

// API routes
app.get('/api/questions', (req, res) => {
  console.log('Questions endpoint called');
  res.json(questions);
});

app.post('/api/submit', async (req, res) => {
    try {
      const { surveyId, answers } = req.body;
  
      if (!surveyId || typeof answers !== 'object') {
        return res.status(400).json({ error: 'Geçersiz veri gönderildi' });
      }
  
      console.log('Gelen surveyId:', surveyId);
      console.log('Gelen answers:', answers);
  
      const response = new Response({ surveyId, answers });
      await response.save();
  
      res.status(201).json({ message: 'Yanıt kaydedildi' });
    } catch (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  });
  

app.get('/api/responses', async (req, res) => {
    try {
      const responses = await Response.find().sort({ createdAt: -1 });
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// MongoDB bağlantısı burada olacak:
mongoose.connect('mongodb://localhost:27017/survey-app')
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı');
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err);
  });
  
// Yeni anket oluşturma endpoint'i
app.post('/api/surveys', async (req, res) => {
    try {
      const newSurvey = new Survey(req.body);
      await newSurvey.save();
      res.status(201).json({ success: true, survey: newSurvey });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Tüm anketleri getirme endpoint'i
app.get('/api/surveys', async (req, res) => {
    try {
      const surveys = await Survey.find().sort({ createdAt: -1 });
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Anket düzenleme endpoint'i (PUT)
app.put('/api/surveys/:id', async (req, res) => {
    try {
      const updatedSurvey = await Survey.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, survey: updatedSurvey });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Anket silme endpoint'i (DELETE)
app.delete('/api/surveys/:id', async (req, res) => {
    try {
      await Survey.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
app.get('/api/surveys/:id', async (req, res) => {
    try {
      const survey = await Survey.findById(req.params.id);
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Start server
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/questions');
  console.log('- POST /api/submit');
  console.log('- GET /api/responses');
});
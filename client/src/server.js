const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Survey = require('./models/Survey')
const app = express()


app.use(cors())
app.use(express.json())

// Anket soruları
const questions = [
  { id: 1, text: "Hizmet memnuniyetiniz?", min: 1, max: 5, type: "range" },
  { id: 2, text: "Temizlik puanı?", min: 1, max: 5, type: "range" },
  { id: 3, text: "Personelden memnun musunuz?", min: 1, max: 5, type: "range" },
  { id: 4, text: "İstek ve önerileriniz:", type: "textarea" }
]

// Debug için log ekleyelim
app.get('/api/questions', (req, res) => {
  console.log('Questions endpoint called');
  res.json(questions);
});

// MongoDB işlemlerini şimdilik yorum satırına alalım
/* 
mongoose.connect('mongodb://localhost:27017/survey-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı')
}).catch(err => {
  console.error('MongoDB bağlantı hatası:', err)
})
*/

app.post('/api/submit', (req, res) => {
  console.log('Received survey response:', req.body);
  res.json({ success: true });
});

const PORT = 3002;  // Changed from 3001 to 3002
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} üzerinde çalışıyor`);
});
// models/Survey.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lütfen anket başlığı giriniz']
  },
  questions: [{
    text: {
      type: String,
      required: [true, 'Lütfen soru metni giriniz']
    },
    type: {
      type: String,
      enum: ['range', 'textarea'],
      default: 'range'
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    }
  }]
}, {
  timestamps: true // Otomatik createdAt ve updatedAt alanları
});

// Modeli export etme (Mongoose 6.0+ için)
const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;

// Veya daha kısa syntax ile:
// module.exports = mongoose.model('Survey', surveySchema);
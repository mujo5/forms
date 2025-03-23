import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ResponseAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3004/api/responses')
      .then(res => {
        const formattedData = formatChartData(res.data);
        setData(formattedData);
      });
  }, []);

  const formatChartData = (responses) => {
    const summary = {};
  
    responses.forEach(response => {
      Object.entries(response.answers).forEach(([questionId, answer]) => {
        const num = Number(answer);
        if (!isNaN(num)) { // sadece sayısal cevapları işle
          if (!summary[questionId]) summary[questionId] = [];
          summary[questionId].push(num);
        }
      });
    });
  
    return Object.keys(summary).map(questionId => ({
      question: `Soru ${questionId}`,
      Ortalama: (summary[questionId].reduce((a, b) => a + b, 0) / summary[questionId].length).toFixed(2)
    }));
  };
  

  return (
    <div sclassName="chart-container">
      <h2>Anket Cevapları Grafik Analizi</h2>
      <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Ortalama" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// health-check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// example route mount (we'll add modules later)
app.use('/api/auth', require('./routes/auth'));

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;

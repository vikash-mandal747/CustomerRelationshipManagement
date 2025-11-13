// src/app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const leadRoutes = require('./routes/leadRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/activities', activityRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
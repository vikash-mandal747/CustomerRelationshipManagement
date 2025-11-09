// src/routes/auth.js
const express = require('express');
const router = express.Router();

// placeholder route - will implement in Step 2
router.post('/signup', (req, res) => res.status(501).json({ message: 'Not implemented yet' }));
router.post('/login', (req, res) => res.status(501).json({ message: 'Not implemented yet' }));

module.exports = router;

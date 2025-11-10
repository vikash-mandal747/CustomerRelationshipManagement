// src/routes/protected.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Only authenticated users can access
router.get('/private', verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authenticated!`, user: req.user });
});

// Only Admins can access
router.get('/admin', verifyToken, allowRoles('ADMIN'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}!` });
});

// Admins and Managers can access
router.get('/manager', verifyToken, allowRoles('ADMIN', 'MANAGER'), (req, res) => {
  res.json({ message: `Hello ${req.user.role}, access granted.` });
});

module.exports = router;

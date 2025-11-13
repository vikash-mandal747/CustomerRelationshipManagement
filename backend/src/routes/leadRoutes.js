const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadHistory,
} = require('../controllers/leadController');

const router = express.Router();

// Create lead (Sales, Manager, Admin)
router.post('/', verifyToken, allowRoles('ADMIN', 'MANAGER', 'SALES'), createLead);

// Get all leads (role-based)
router.get('/', verifyToken, getLeads);

// Update lead
router.put('/:id', verifyToken, allowRoles('ADMIN', 'MANAGER', 'SALES'), updateLead);

// Delete lead
router.delete('/:id', verifyToken, allowRoles('ADMIN', 'MANAGER', 'SALES'), deleteLead);

// 🧾 Get Lead History
router.get('/:id/history',verifyToken,allowRoles('ADMIN', 'MANAGER', 'SALES'),getLeadHistory);


module.exports = router;

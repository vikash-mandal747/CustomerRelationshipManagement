const express = require('express');
const {
  createActivity,
  getActivitiesByLead,
  deleteActivity
} = require('../controllers/activityController');
const verifyToken  = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Create a new activity (Sales, Manager, Admin)
router.post('/', verifyToken, allowRoles('ADMIN', 'MANAGER', 'SALES'), createActivity);

// Get all activities for a specific lead
router.get('/lead/:leadId', verifyToken, getActivitiesByLead);

// Delete an activity (Admin or Manager only)
router.delete('/:id', verifyToken, allowRoles('ADMIN', 'MANAGER'), deleteActivity);

module.exports = router;

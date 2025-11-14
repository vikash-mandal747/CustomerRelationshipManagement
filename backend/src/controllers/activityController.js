const prisma = require("../utils/prisma");

/**
 * @desc Create a new activity for a lead
 * @route POST /api/activities
 * @access Protected
 */
const createActivity = async (req, res) => {
  try {
    const { leadId, type, note } = req.body;
    const userId = req.user.id; // comes from JWT middleware

    if (!leadId || !type) {
      return res.status(400).json({ message: 'Lead ID and type are required.' });
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        note,
        leadId: Number(leadId),
        userId: userId
      },
      include: {
        lead: true,
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    res.status(201).json({
      message: 'Activity created successfully',
      activity
    });
    // 🔔 Notify all clients about the new activity
    const io = req.app.get('io');
    io.emit('activityCreated', activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error creating activity' });
  }
};

/**
 * @desc Get all activities for a specific lead
 * @route GET /api/activities/lead/:leadId
 * @access Protected
 */
const getActivitiesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const activities = await prisma.activity.findMany({
      where: { leadId: Number(leadId) },
      include: {
        user: { select: { id: true, name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};

/**
 * @desc Delete an activity
 * @route DELETE /api/activities/:id
 * @access Protected (Admin or Manager only)
 */
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.activity.findUnique({ where: { id: Number(id) } });

    if (!existing) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await prisma.activity.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
};


module.exports = {
  createActivity,
  getActivitiesByLead,
  deleteActivity
};

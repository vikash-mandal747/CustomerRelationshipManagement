const prisma = require("../utils/prisma");

// 🟢 Create a new lead
const createLead = async (req, res) => {
  try {
    const { title, company, email, phone, source, status } = req.body;
    const userId = req.user.id;

    const lead = await prisma.lead.create({
      data: {
        title,
        company,
        email,
        phone,
        source,
        status: status || 'new',
        createdById: userId,
      },
    });

    res.status(201).json({ message: 'Lead created successfully', lead });
    // 🔔 Notify all connected clients
    const io = req.app.get('io');
    io.emit('leadCreated', lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
};

// 🟣 Get all leads (Admin/Manager) or user’s own leads (Sales)
const getLeads = async (req, res) => {
  try {
    const user = req.user;
    let leads;

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      leads = await prisma.lead.findMany({
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          activities: true,
          histories: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      leads = await prisma.lead.findMany({
        where: { createdById: user.id },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          activities: true,
          histories: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

// 🟡 Update a lead (with Lead History tracking)
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;

    const existingLead = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!existingLead) return res.status(404).json({ message: 'Lead not found' });

    // Only Admin/Manager or creator can update
    if (user.role === 'SALES' && existingLead.createdById !== user.id) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Perform the lead update
    const updatedLead = await prisma.lead.update({
      where: { id: Number(id) },
      data: updates,
    });

    // --- 🧠 Lead History Tracking ---
    const changedFields = Object.keys(updates);
    const historyEntries = [];

    for (const field of changedFields) {
      const oldValue = existingLead[field];
      const newValue = updatedLead[field];

      if (oldValue !== newValue) {
        historyEntries.push({
          leadId: Number(id),
          field,
          fromValue: oldValue ? String(oldValue) : null,
          toValue: newValue ? String(newValue) : null,
          changedBy: user.id,
        });
      }
    }

    if (historyEntries.length > 0) {
      await prisma.leadHistory.createMany({ data: historyEntries });
    }

    res.json({
      message: 'Lead updated successfully',
      updatedLead,
      historyLogged: historyEntries.length,
    });

    // 🔔 Notify all connected clients
    const io = req.app.get('io');
    io.emit('leadUpdated', updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
};


// 🔴 Delete a lead
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (user.role === 'SALES' && lead.createdById !== user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this lead' });
    }

    await prisma.lead.delete({ where: { id: Number(id) } });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting lead', error: error.message });
  }
};


// 🧾 Get lead history (for Admin, Manager, or Owner)
const getLeadHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if the lead exists
    const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only Admin/Manager or the creator can view history
    if (user.role === "SALES" && lead.createdById !== user.id) {
      return res.status(403).json({ message: "Not authorized to view this lead's history" });
    }

    const history = await prisma.leadHistory.findMany({
      where: { leadId: Number(id) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        field: true,
        fromValue: true,
        toValue: true,
        changedBy: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      leadId: id,
      totalChanges: history.length,
      history,
    });
  } catch (error) {
    console.error("Error fetching lead history:", error);
    res.status(500).json({ message: "Error fetching lead history", error: error.message });
  }
};


module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadHistory
};
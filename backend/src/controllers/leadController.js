const prisma = require("../utils/prisma");

// 🟢 Create a new lead
exports.createLead = async (req, res) => {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
};

// 🟣 Get all leads (Admin/Manager) or user’s own leads (Sales)
exports.getLeads = async (req, res) => {
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

// 🟡 Update a lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, email, phone, source, status } = req.body;
    const user = req.user;

    const existingLead = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!existingLead) return res.status(404).json({ message: 'Lead not found' });

    // Only Admin/Manager or creator can update
    if (user.role === 'SALES' && existingLead.createdById !== user.id) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    const updated = await prisma.lead.update({
      where: { id: Number(id) },
      data: { title, company, email, phone, source, status },
    });

    res.json({ message: 'Lead updated successfully', updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
};

// 🔴 Delete a lead
exports.deleteLead = async (req, res) => {
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

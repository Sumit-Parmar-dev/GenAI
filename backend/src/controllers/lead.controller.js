const leadDao = require('../dao/lead.dao');

exports.createLead = async (req, res) => {
    try {
        const lead = await leadDao.createLead({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await leadDao.getAllLeads(req.user.id);
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLead = async (req, res) => {
    try {
        const lead = await leadDao.getLeadById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await leadDao.updateLead(req.params.id, req.user.id, req.body);
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

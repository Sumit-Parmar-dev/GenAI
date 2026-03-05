const leadDao = require('../dao/lead.dao');
const { scoreLead } = require('../services/ml.service');

const ALLOWED_CREATE_FIELDS = [
    'name', 'email', 'phone', 'company', 'jobRole', 'industry',
    'source', 'budget', 'status', 'notes',
    'aiScore', 'aiCategory', 'aiReason', 'aiInsight', 'aiEmailDraft',
    'isConverted', 'convertedAt',
];

const ALLOWED_UPDATE_FIELDS = [
    'name', 'email', 'phone', 'company', 'jobRole', 'industry',
    'source', 'budget', 'status', 'notes',
    'aiScore', 'aiCategory', 'aiReason', 'aiInsight', 'aiEmailDraft',
    'isConverted', 'convertedAt',
];

function pickFields(body, allowedFields) {
    return allowedFields.reduce((acc, field) => {
        if (body[field] !== undefined) acc[field] = body[field];
        return acc;
    }, {});
}

/** Call ML service and patch the lead in DB — silently skips if service unavailable */
async function enrichWithAI(lead) {
    const aiResult = await scoreLead(lead);
    if (!aiResult) return lead;

    const updated = await leadDao.updateLead(lead.id, lead.userId, {
        aiScore: aiResult.score,
        aiCategory: aiResult.category,
        aiReason: aiResult.reason,
        aiInsight: aiResult.insight,
        aiEmailDraft: aiResult.emailDraft,
    });
    console.log(`[AI] Lead #${lead.id} scored: ${aiResult.score} (${aiResult.category})`);
    return updated;
}

exports.createLead = async (req, res) => {
    try {
        const data = pickFields(req.body, ALLOWED_CREATE_FIELDS);
        // 1. Save lead first
        const lead = await leadDao.createLead({ ...data, userId: req.user.id });
        // 2. Enrich with AI score asynchronously (non-blocking response)
        res.status(201).json(lead);
        // 3. Score in background and persist
        enrichWithAI(lead).catch(() => { });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const { status } = req.query;
        const leads = status
            ? await leadDao.getLeadsByStatus(req.user.id, status)
            : await leadDao.getAllLeads(req.user.id);
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
        const data = pickFields(req.body, ALLOWED_UPDATE_FIELDS);
        const lead = await leadDao.updateLead(req.params.id, req.user.id, data);
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        await leadDao.deleteLead(req.params.id, req.user.id);
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.convertLead = async (req, res) => {
    try {
        const lead = await leadDao.updateLead(req.params.id, req.user.id, {
            isConverted: true,
            convertedAt: new Date(),
            status: 'Converted',
        });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** POST /:id/score — re-score an existing lead on demand */
exports.rescoreLead = async (req, res) => {
    try {
        const lead = await leadDao.getLeadById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        const aiResult = await scoreLead(lead);
        if (!aiResult) {
            return res.status(503).json({ message: 'ML service unavailable' });
        }

        const updated = await leadDao.updateLead(req.params.id, req.user.id, {
            aiScore: aiResult.score,
            aiCategory: aiResult.category,
            aiReason: aiResult.reason,
            aiInsight: aiResult.insight,
            aiEmailDraft: aiResult.emailDraft,
        });
        console.log(`[AI] Lead #${lead.id} re-scored: ${aiResult.score} (${aiResult.category})`);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

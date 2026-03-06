const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const outreachService = require("../services/outreach.service");

/**
 * Outreach Routes
 */

// POST /api/outreach/:leadId - Send email to a specific lead
router.post("/:leadId", auth, async (req, res) => {
    try {
        const result = await outreachService.sendEmail(req.params.leadId, req.user.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/outreach/bulk - Bulk outreach for Hot leads
router.post("/bulk", auth, async (req, res) => {
    try {
        const results = await outreachService.bulkOutreach(req.user.id);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
    createLead,
    getLeads,
    getLead,
    updateLead,
    deleteLead,
    convertLead,
    rescoreLead,
} = require("../controllers/lead.controller");

router.post("/", auth, createLead);
router.get("/", auth, getLeads);
router.get("/:id", auth, getLead);
router.patch("/:id", auth, updateLead);
router.delete("/:id", auth, deleteLead);
router.post("/:id/convert", auth, convertLead);
router.post("/:id/score", auth, rescoreLead);

module.exports = router;

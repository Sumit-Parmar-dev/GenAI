const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { createLead, getLeads, getLead, updateLead } = require("../controllers/lead.controller");

router.post("/", auth, createLead);
router.get("/", auth, getLeads);
router.get("/:id", auth, getLead);
router.patch("/:id", auth, updateLead);

module.exports = router;

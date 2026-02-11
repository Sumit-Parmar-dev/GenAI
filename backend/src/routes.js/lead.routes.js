const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { createLead, getLeads } = require("../controllers/lead.controller");

router.post("/", auth, createLead);
router.get("/", auth, getLeads);

module.exports = router;

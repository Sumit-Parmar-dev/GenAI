const router = require("express").Router();
const { login, register, logout, resetPassword } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


module.exports = router;

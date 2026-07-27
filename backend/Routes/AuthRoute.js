const express = require("express");
const { signup, login, getUser, requireAuth, updateUser, updatePassword } = require("../Controllers/AuthController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getUser)
router.put("/me", requireAuth, updateUser)
router.patch("/changePassword", requireAuth, updatePassword)
module.exports = router;

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.signupController);

router.post("/signin", authController.signinController);

module.exports = router;

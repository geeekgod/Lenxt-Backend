const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");

router.get("/", profileController.listProfiles);

router.get("/me", profileController.listMe);

module.exports = router;
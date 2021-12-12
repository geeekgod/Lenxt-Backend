const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

router.get("/", contactController.listContacts);

router.post("/addNew", contactController.addToContacts);

module.exports = router;

const express = require('express');
const router = express.Router();


router.get("/signup", async (req, res) => {
    res.json({ message: "This is the Sign-up route" });   
  });
  

router.post("/signin", async (req, res) => {
    res.json({ message: "This is the Sign-in route" }); 
  });
  
  module.exports = router;
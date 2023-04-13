const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// PUT - edit my account
// ***needs more testing

router.put("/edit", isAuthenticated, (req, res) => {
  const userId = req.payload.sub;
  const { name, email, location } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((updatedUser) => {res.json(updatedUser)})
    .catch((error) => res.status(500).json(error))
});

module.exports = router;

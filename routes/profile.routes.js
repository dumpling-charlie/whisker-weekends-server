const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET - view my account
// ***needs more testing
router.get("/my-account", isAuthenticated, (req, res) => { 

  const userId = req.payload.sub;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Log in to see your account" });
      }
      console.log({ user });

      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// PUT - edit my account
// ***needs more testing
router.put("/edit", isAuthenticated, (req, res) => {
  const userId = req.payload.sub;
  const { name, email, location } = req.body;

  User.findByIdAndUpdate(userId, { name, email, location }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log({ user });

      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// POST - delete my account
// ***needs more testing
router.delete("/my-account", isAuthenticated, (req, res, next) => {
  const userId = req.payload.sub;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified ID is not valid" });
    return;
  }

  User.findByIdAndRemove(userId)
    .then(() =>
      res.json({ message: `User with ${userId} is removed successfully.` })
    )
    .catch((error) => res.json(error));
});

module.exports = router;

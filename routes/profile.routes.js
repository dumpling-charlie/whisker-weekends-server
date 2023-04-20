const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");


// GET - profile info from DB
router.get("/profile/:userId", isAuthenticated, (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    })
})

// PUT - edit my account
router.put("/profile/:userId", isAuthenticated, (req, res) => {
  const {userId} = req.params;
  const { name, location } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User
    .findByIdAndUpdate(userId, req.body, { new: true })
    .then((updatedUser) => {
      res.json({ user: updatedUser })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    });
}); 

// GET - view another user's profile
router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: "Cannot find user with userId"});
    });
});

module.exports = router;

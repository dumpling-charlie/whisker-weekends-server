const express = require("express");
const router = express.Router();
const Playdate = require("../models/Playdate.model.js");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//GET - list all playdates
router.get("/", (req, res) =>
  Playdate.find({})
    .then((playdates) => res.status(200).json(playdates))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    })
);

// GET - view playdate
router.get("/:playdateId", /*isAuthenticated,*/ (req, res) => {
  const playdateId = req.params.playdateId;

  if (!mongoose.Types.ObjectId.isValid(playdateId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Playdate.findById(playdateId)
    .then((playdate) => res.status(200).json(playdate))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// POST - create a playdate
router.post("/create",  (req, res) => {
  const { title, location, date, time, pets, description } = req.body;

  const newPlaydate = new Playdate({
    title,
    location,
    date,
    time,
    pets,
    description,
    // organizer: req.payload.sub, // set the organizer to the authenticated user's ID
  });

  newPlaydate
    .save()
    .then((playdate) => res.status(201).json(playdate))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// PUT - edit my playdate
router.put("/:playdateId/edit",  (req, res) => {
  const playdateId = req.params.playdateId;
  const { title, location, date, time, pets, description } = req.body;

  Playdate.findByIdAndUpdate(
    playdateId,
    { title, location, date, time, pets, description },
    { new: true }
  )
    .then((playdate) => {
      if (!playdate) {
        return res.status(404).json({ message: "Playdate not found" });
      }
      console.log({ playdate });

      res.json({ playdate });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// DELETE - delete my playdate
router.delete("/playdates/:playdateId", (req, res, next) => {
  const playdateId = req.params.playdateId;

  if (!mongoose.Types.ObjectId.isValid(playdateId)) {
    res.status(400).json({ message: "Specified ID is not valid" });
    return;
  }

  Playdate.findByIdAndRemove(playdateId)
    .then(() =>
      res.json({
        message: `Playdate with ${playdateId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;

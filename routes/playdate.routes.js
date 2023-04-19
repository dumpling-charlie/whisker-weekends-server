const express = require("express");
const router = express.Router();
const Playdate = require("../models/Playdate.model.js");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");
const Pet = require("../models/Pet.model.js");

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
// /api/playdates/:playdateId
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
router.post("/create", isAuthenticated, (req, res) => {
  const { imageUrl, title, location, date, time, pets, description } = req.body;

  const newPlaydate = new Playdate({
    imageUrl,
    title,
    location,
    date,
    time,
    pets,
    description,
    createdBy: req.payload._id
  });

  newPlaydate
    .save()
    .then((playdate) => res.status(201).json(playdate))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// PUT /api/playdates/:playdateId/like - like a playdate
router.put('/:playdateId/like', isAuthenticated, (req, res) => {
  const { playdateId } = req.params;
  const userId = req.payload._id;

  Playdate.findByIdAndUpdate(playdateId)
    .then(playdate => {
      if(playdate.likedBy.includes(userId)) {
        playdate.likes -= 1;
        const index = playdate.likedBy.indexOf(userId);
        playdate.likedBy.splice(index, 1);
        console.log(playdate.likedBy);
      } else {
        playdate.likes += 1;
        playdate.likedBy.push(userId);
      }
      return playdate.save();
})
  .then(updatedPlaydate => {
    res.status(200).json(updatedPlaydate);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'error liking playdate' });
  });
})

// PUT - edit my playdate
// /playdates/:playdateId
router.put("/:playdateId",  (req, res) => {
  const playdateId = req.params.playdateId;
  // const { title, location, date, time, pets, description } = req.body;

  Playdate.findByIdAndUpdate( playdateId, req.body, { new: true })
    .then((playdate) => {
      if (!playdate) {
        return res.status(404).json({ message: "Playdate not found" });
      }
      res.json({ playdate });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// DELETE - /api/playdates/:playdateId
router.delete("/:playdateId", isAuthenticated, (req, res) => {
  const playdateId = req.params.playdateId;
  const userId = req.payload._id;

  Playdate.findOne({ _id: playdateId, createdBy: userId })
    .then((playdate) => {
      if(!playdate) {
        return res.status(404).json({ message: "playdate not found" });
      }

      Playdate.findByIdAndRemove(playdateId)
        .then(() => {
          res.json({ message: `playdate with ${playdateId} was removed successfully`})
        })
        .catch((error) => res.json(error));
    })
    .catch((error) => res.json(error));
});

module.exports = router;

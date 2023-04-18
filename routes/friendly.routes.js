const express = require("express");
const router = express.Router();
const PetFriendly = require("../models/PetFriendly.model.js");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");


//GET - list all places
router.get("/", (req, res) =>
  PetFriendly.find({})
    .then((friendlyPlaces) => res.status(200).json(friendlyPlaces))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    })
);

// GET - view place
router.get(
  "/:friendlyPlaceId",
  /*isAuthenticated,*/ (req, res) => {
    const friendlyPlaceId = req.params.friendlyPlaceId;

    if (!mongoose.Types.ObjectId.isValid(friendlyPlaceId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    PetFriendly.findById(friendlyPlaceId)
      .then((petfriendly) => res.status(200).json(petfriendly))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
);


// POST - create a place
router.post("/create", isAuthenticated, (req, res) => {
  const { name, location, details } = req.body;
  const userId = req.payload._id;

  const newPetFriendly = new PetFriendly({
    name,
    location,
    details,
    createdBy: userId,
  });

  newPetFriendly
    .save()
    .then((petfriendly) => res.status(201).json(petfriendly))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// PUT like a place
router.put("/:friendlyPlaceId/like", isAuthenticated, (req, res) => {
  const { friendlyPlaceId } = req.params;
  const userId = req.payload._id;

  PetFriendly.findByIdAndUpdate(
    friendlyPlaceId,
    {
      $inc: { likes: 1 },
      $push: { likedBy: userId },
    },
    { new: true }
  )
    .then((likedPetFriendly) => {
      likedPetFriendly.save();
      res.status(200).json(likedPetFriendly);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "error liking place" });
    });
});

// PUT - edit my place
router.put("/:friendlyPlaceId/edit", (req, res) => {
  const friendlyPlaceId = req.params.friendlyPlaceId;
  const { name, location, details } = req.body;

  PetFriendly.findByIdAndUpdate(
    friendlyPlaceId,
    { name, location, details },
    { new: true }
  )
    .then((petfriendly) => {
      if (!petfriendly) {
        return res.status(404).json({ message: "Place not found" });
      }
      console.log({ petfriendly });

      res.json({ petfriendly });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// DELETE - delete my petfriendly
router.delete("/:friendlyPlaceId", (req, res, next) => {
  const friendlyPlaceId = req.params.friendlyPlaceId;

  if (!mongoose.Types.ObjectId.isValid(friendlyPlaceId)) {
    res.status(400).json({ message: "Specified ID is not valid" });
    return;
  }

  PetFriendly.findByIdAndRemove(friendlyPlaceId)
    .then(() =>
      res.json({
        message: `Place with ${friendlyPlaceId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;

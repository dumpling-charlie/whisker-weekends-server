const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pet = require("../models/Pet.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");

// view your own pets
// GET - /api/pets
router.get("/pets", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  Pet.find({ owner: userId })
    .then((allPets) => res.json(allPets))
    .catch((err) => {
      console.log("error getting list of pets", err);
      res.status(500).json({
        message: "error getting list of pets",
        error: err,
      });
    });
});

// view pet profile details
// GET /api/pets/:petId
router.get("/pets/:petId", (req, res) => {
  const { petId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(petId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Pet.findById(petId)
    .populate("owner")
    .then((pet) => res.status(200).json(pet))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// create pet profile
// POST /api/pets/
router.post("/pets", isAuthenticated, (req, res, next) => {
  const { name, age, species, breed, personality, imageUrl } = req.body;
  const userId = req.payload._id;

  Pet.create({
    name,
    age,
    species,
    breed,
    personality,
    imageUrl,
    owner: userId,
  })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error creating a new pet",
        error: err,
      });
    });
});

// edit pet profile details
// PUT /pets/:petId
router.put("/pets/:petId", isAuthenticated, (req, res) => {
  const { petId } = req.params;

  Pet.findByIdAndUpdate(petId, req.body, { new: true })
    .then((updatedPet) => {
      res.json({ pet: updatedPet });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// DELETE /api/pets/:petId
router.delete("/pets/:petId", isAuthenticated, (req, res, next) => {
  const { petId } = req.params;
  const userId = req.payload._id;

  Pet.findOne({ _id: petId, owner: userId })
    .then((pet) => {
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      Pet.findByIdAndDelete(petId)
        .then(() => {
          res.json({ message: `pet with ${petId} is removed successfully` });
        })
        .catch((error) => res.json(error));
    })
    .catch((error) => res.json(error));
});

module.exports = router;

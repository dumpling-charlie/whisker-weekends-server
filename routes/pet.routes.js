const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pet = require("../models/Pet.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");


// GET - /api/pets view all pets
router.get("/", (req, res) => {
    console.log("Got a request for the pets list!")
    Pet.find()
    .then(allPets => res.json(allPets))
    .catch(err => {
        console.log("error getting list of pets", err);
        res.status(500).json({
            message: "error getting list of pets",
            error: err
        })
    })
})

// GET - view pet profile details
router.get("/:petId", (req, res) => {
    const { petId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Pet.findById(petId)
      .populate('owner')
      .then((pet) => res.status(200).json(pet))
      .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Internal server error" });
        });
  });

  // create pet profile
  // POST /api/pets/
  router.post("/", isAuthenticated, (req, res, next) => {
      const { name, age, species, breed, personality } = req.body;
      const userId = req.payload._id;
  
      Pet.create( {name, age, species, breed, personality, owner: userId} )
          .then((result) => {
            console.log(userId)
              res.status(201).json(result)
          })
          .catch(err => {
              console.log("error creating a new pet", err);
              res.status(500).json({
                  message: "error creating a new pet",
                  error: err
              });
          })
  })
  
  // PUT - edit pet profile
  // ***WORKING***
  router.put("/edit/:petId", isAuthenticated, (req, res) => { 
    const { petId } = req.params;
    const { name, age, species, breed, personality } = req.body;
    const userId = req.payload.sub;
  
    Pet.findOne({_id: petId, owner: userId})
      .then((pet) => {
        if (!pet) {
          return res.status(404).json({message: "pet not found"});
        }
  
        Pet.findByIdAndUpdate(
          petId, 
          { name, age, species, breed, personality },
          {new: true}
        )
          .then((updatedPet) => {
            console.log({updatedPet});
            res.json({pet: updatedPet});
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({message: "Internal server error"});
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
      })
  });
  
  // DELETE - delete pet profile
  // ***WORKING***
  router.delete("/:petId", isAuthenticated, (req, res, next) => { 
      const { petId } = req.params;
      const userId = req.payload.sub;
  
      Pet.findOne({ _id: petId, owner: userId })
        .then((pet) => {
          if(!pet) {
            return res.status(404).json({ message: "Pet not found" });
          }
  
          Pet.findByIdAndDelete(petId)
            .then(() => {
              res.json({ message: `pet with ${petId} is removed successfully`})
            })
            .catch((error) => res.json(error));
        })
        .catch((error) => res.json(error));
      });


module.exports = router;
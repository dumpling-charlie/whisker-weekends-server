const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET - view my account
router.get("/my-account", isAuthenticated, (req, res) => { 
  const userId = req.user._id;

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
router.put("/edit", isAuthenticated, (req, res) => {
  const userId = req.user._id;
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
router.delete("/my-account", isAuthenticated, (req, res, next) => {
  const { userId } = req.user._id;

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

// GET - view pet profile
router.get("/pet/:petId", isAuthenticated, (req, res) => {
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

// POST - create pet profile
router.post("/pets", (req, res, next) => {
    const { name, age, species, breed, personality } = req.body;
    const { userId } = req.user._id;

    Pet.create( {name, age, species, breed, personality, owner: userId} )
        .then((res) => {
            console.log(res);
            res.status(201).json(response)
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
router.put("/edit/:petId", isAuthenticated, (req, res) => { 
  const { petId } = req.params;
  const { name, age, species, breed, personality } = req.body;

  Pet.findByIdAndUpdate(
    petId,
    { name, age, species, breed, personality },
    { new: true }
  )
    .then((pet) => {
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      console.log({ pet });

      res.json({ pet });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// POST - delete pet profile
router.delete("/pet/:petId", isAuthenticated, (req, res, next) => { 
    const { petId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      res.status(400).json({ message: "Specified ID is not valid" });
      return;
    }
  
    Pet.findByIdAndRemove(petId)
      .then(() =>
        res.json({ message: `Pet with ${petId} is removed successfully.` })
      )
      .catch((error) => res.json(error));
  });

module.exports = router;

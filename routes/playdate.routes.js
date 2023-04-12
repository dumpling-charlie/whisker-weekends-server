const express = require("express");
const router = express.Router();
const Playdate = require("../models/Playdate.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.get("/playdates/create", isAuthenticated, (req, res) =>
  res.render("playdates/create")
);

//create playdate
router.post(
  "/playdates/create",
  (req, res) => {
    const { title, location, date, pets, description, createdBy } = req.body;

    Playdate.create({
      title,
      location,
      date,
      pets,
      description,
      createdBy,
    })
      .then((newlyCreatedPlaydateFromDB) => {
        res.redirect("/playdates");
      })
      .catch((error) => res.redirect("/playdates/create"), {
        errorMessage: "Unable to edit playdate.",
      });
  }
);

router.get("/playdates", (req, res) => {
  Playdate.find()
    .then((playdatesFromDB) => {
      res.render("/playdates", { playdates: playdatesFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the playdates from the DB: ${err}`)
    );
});

// edit event
router.get("/playdates/:id/edit", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload.sub;

  Playdate.findById(id)
    .then((playdateToEdit) => {
        res.render("events/events-edit", eventToEdit);

    })
    .catch((error) =>
      console.log(`Error while getting a single playdate for edit: ${error}`)
    );
});

router.post(
  "/playdates/:id/edit",
  (req, res) => {
    const { id } = req.params;
    const { title, location, date, pets, description, createdBy } = req.body;

    Playdate.findByIdAndUpdate(
      id,
      { title, location, date, pets, description, createdBy },
      { new: true }
    )
      .then(() => res.redirect(`/playdates`))
      .catch((error) => res.redirect("playdates/"), {
        errorMessage: "Unable to edit playdate.",
      });
  }
);

//Delete event
router.post("/playdates/:playdateId/delete", isAuthenticated, (req, res, next) => {
  const { playdateId } = req.params;

  Event.findByIdAndDelete(playdateId)
    .then(() => res.redirect("/playdates"))
    .catch((error) => next(error));
});

module.exports = router;

const { Schema, model } = require("mongoose");

const petfriendlySchema = new Schema({
  name: {
    type: String,
    // required: true
  },
  location: {
    type: String,
    // required: true
  },
  details: {
    type: String,
    // required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: "User",
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
});

const PetFriendly = model("PetFriendly", petfriendlySchema);

module.exports = PetFriendly;

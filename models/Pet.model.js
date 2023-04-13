const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const petSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
    },
    species: {
      type: String,
      enum: ['cat', 'dog'],
      required: [true, "Type is required."],
    },
    breed: {
      type: String,
    },
    personality: {
      type: String,
      enum: ['introvert', 'outgoing', 'playful'],
      // required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
    },
    imageUrl: {
      type: String,
      // required: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Pet = model("Pet", petSchema);

module.exports = Pet;

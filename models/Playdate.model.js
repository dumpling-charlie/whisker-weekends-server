 const { Schema, model } = require("mongoose");

const playdateSchema = new Schema(
    {
      imageUrl: {
        type: String,
        // required: true
      },
      title: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        // required: true,
      },
      pets: [{
        name: {type: String, required: true },
        age: {type: Number, required: true }, 
        species: { type: String, required: true },
        breed: {type: String},
        personality: {type: String},
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        imageUrl: {type: String}
      }],
      time: {
        type: String,
        required: true,
      },
      description: {
        type: String, 
        required: true
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
    }
    },
)

const Playdate = model("Playdate", playdateSchema);

module.exports = Playdate;
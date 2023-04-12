 const { Schema, model } = require("mongoose");

const playdateSchema = new Schema(
    {
      image: {
        type: String,
        required: true
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
        required: true,
      },
      pets: [{
        type: Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
      }],
    //   time: {
    //     type: String,
    //     required: true,
    //   },
      description: {
        type: String, 
        required: true
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    },
)

const Playdate = model("Playdate", playdateSchema);

module.exports = Playdate;
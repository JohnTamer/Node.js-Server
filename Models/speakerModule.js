// require mongoose
const mongoose = require("mongoose");
const increment = require("mongoose-sequence")(mongoose);

// make my schema
const schema = new mongoose.Schema({
  _id: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: String,
  role: { type: String, enum: ["student", "speaker"] },
  image: String,
  address: {
    city: String,
    street: String,
    building: Number,
  },
});

schema.plugin(increment, {
  id: "idSpeakerIncrement",
  inc_field: "_id",
});
// export schema and the collection name is speaker
module.exports = mongoose.model("speaker", schema);
// now go to the speakerController

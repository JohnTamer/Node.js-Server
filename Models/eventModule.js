const mongoose = require("mongoose");
const increment = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  date: { type: String, required: true },
  mainSpeaker: { type: Number, required: true, ref: "speaker" },
  speakers: [{ type: Number, required: true, ref: "speaker" }],
  students: [{ type: Number, required: true, ref: "student" }],
});
schema.plugin(increment, {
  id: "idEventIncrement",
  inc_field: "_id",
});

module.exports = mongoose.model("event", schema);

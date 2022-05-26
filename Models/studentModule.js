const mongoose = require("mongoose");
const increment = require("mongoose-sequence")(mongoose);
//make my schema
const schema = new mongoose.Schema({
  _id: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: String,
});
schema.plugin(increment, {
  id: "idIncrement",
  inc_field: "_id",
});

//export schema and the collection name is student
module.exports = mongoose.model("student", schema);

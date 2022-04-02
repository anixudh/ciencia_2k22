var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String },
  uniqID: { type: String },
});

//Export model
module.exports = mongoose.model("Student", StudentSchema);

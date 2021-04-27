const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
  {
    class: { type: String, required: true },
    room: { type: String, required: true },
    type: { type: String, required: true }
  },
  {
    collation: "classrooms",
  }
);

const classroom = mongoose.model("Classroom", schema);

module.exports = classroom;

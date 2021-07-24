const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher" }, // foreign key
    academic_year: { type: String, required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom"}, // foreign key
    term: { type: String, required: true },
  },
  {
    collation: "advisors",
  }
);

const advisor = mongoose.model("Advisor", schema);

module.exports = advisor;

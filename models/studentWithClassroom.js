const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enrollmentSchema = Schema(
  {
    student: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    advisor: { type: Schema.Types.ObjectId, required: true, ref: "Advisor" },
    test: { type: String },
  },
  { collation: { locale: "en_US", strength: 1 } }
);

const studentWithClassroom = mongoose.model("Enrollments", enrollmentSchema);

module.exports = studentWithClassroom;

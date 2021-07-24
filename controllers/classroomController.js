const StudentWithClassroom = require("../models/studentWithClassroom");
const Advisor = require("../models/advisor");
const mongoose = require("mongoose");

//GET Advisor
exports.index = async (req, res, next) => {
  const { id } = req.params;

  let ids = mongoose.Types.ObjectId(id);

  const resp = await StudentWithClassroom.aggregate([
    {
      $lookup: {
        from: "students", //collection name
        localField: "student", //field student in Enrollment model
        foreignField: "_id", // foreign in Student model
        as: "Student",
      },
    },

    { $match: { advisor: ids } },
    { $unwind: "$Student" },
    {
      $project: {
        //select and delete some field
        Student: 1,
        _id:0
      },
    },
    {
      $sort: {
        "Student.sid": 1,
      },
    },
  ]);

  const classroomDetail = await Advisor.findById(id)
    .populate("teacher", "name_title firstname lastname")
    .populate("classroom","class room")
    .select("-_id");

  res.status(200).json({
    data: resp,
    detail: classroomDetail,
  });
};

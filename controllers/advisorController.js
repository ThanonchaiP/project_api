const Advisor = require("../models/advisor");
const Teacher = require("../models/teacher");

//GET Advisor
exports.index = async (req, res, next) => {
  const { page, page_size } = req.query;
  const myPage = page ? parseInt(page) : 1;
  const myPageSize = page_size ? parseInt(page_size) : 15;

  const resp = await Advisor.aggregate([
    {
      $lookup: {
        from: "classrooms", //collection name
        localField: "classroom", //field classroom in Advisor model
        foreignField: "_id", // foreign in Classroom model
        as: "Classroom",
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "teacher",
        foreignField: "_id",
        as: "Teacher",
      },
    },
    {
      $project: {
        //select and delete some field
        "Teacher.username": 0,
        "Teacher.password": 0,
        "Teacher.status": 0,
        "Teacher.photo": 0,
      },
    },
    { $match: { academic_year: "2563", term: "1" } },
    {
      $sort: {
        "Classroom.type": -1,
        "Classroom.room": -1,
      },
    },
  ]);

  res.status(200).json({
    data: resp,
  });
};

//GET AdvisorId By Term
exports.advisorIdWithTerm = async (req, res, next) => {
  const { year, term, classroom_id } = req.body;

  const resp = await Advisor.find({
    term: term,
    academic_year: year,
    classroom: classroom_id,
  });
  res.status(200).json({
    data: resp,
  });
};

//GET Advisor By Year
exports.advisorWithYear = async (req, res, next) => {
  const { year } = req.params;

  const resp = await Advisor.aggregate([
    {
      $lookup: {
        from: "classrooms", //collection name
        localField: "classroom", //field classroom in Advisor model
        foreignField: "_id", // foreign in Classroom model
        as: "Classroom",
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "teacher",
        foreignField: "_id",
        as: "Teacher",
      },
    },
    {
      $project: {
        //select and delete some field
        "Teacher.username": 0,
        "Teacher.password": 0,
        "Teacher.status": 0,
        "Teacher.photo": 0,
      },
    },
    { $match: { academic_year: year, term: "1" } },
    {
      $sort: {
        "Classroom.type": -1,
        "Classroom.room": -1,
      },
    },
  ]);
  res.status(200).json({
    data: resp,
  });
};

//GET All Year
exports.year = async (req, res, next) => {
  const resp = await Advisor.aggregate([
    { $group: { _id: "$academic_year" } },
    {
      $project: {
        academic_year: 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);

  res.status(200).json({
    data: resp,
  });
};

//GET TeacherWithAdvisor
exports.advisorWithTeacher = async (req, res, next) => {
  const { id } = req.params;
  const resp = await Teacher.findById(id).populate("advisors", "_id -teacher");

  res.status(200).json({
    data: resp,
  });
};

//GET BY Teacher id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await Advisor.findById(id);

    if (!data) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

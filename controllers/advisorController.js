const Advisor = require("../models/advisor");
const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");

//GET advisor
exports.index = async (req, res, next) => {

  const resp = await Advisor.find({term:1})
    .populate({
      path: "classroom",
      select: "class room",
      options: { sort: { type: 1, class: 1, room: 1 } },
    }) //เอา field classroom มาด้วย
    .populate({
      path: "teacher",
      select: "firstname lastname",
    }); //เอา field teacher มาด้วย

  res.status(200).json({
    data: resp,
  });
};

//GET Advisor By Year
exports.advisorWithYear = async (req, res, next) => {
  const { year } = req.params;

  const resp = await Advisor.find({ academic_year: year })
    .sort({ _id: 1 })
    .populate("classroom") //เอา field classroom มาด้วย
    .populate("teacher", "_id firstname lastname"); //เอา field teacher มาด้วย
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

    const admin = await Advisor.findById(id);

    if (!admin) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//Inser admin
exports.insert = async (req, res, next) => {
  const { name, username, password, email, tel } = req.body;

  let admin = new Advisor({
    name: name,
    username: username,
    password: password,
    email: email,
    tel: tel,
  });
  await admin.save(); //save to db

  res.status(201).json({
    message: "Insert",
  });
};

//Delete BY ID
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Advisor.findByIdAndDelete({ _id: id });

    if (!admin) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      message: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//Update admin
exports.update = async (req, res, next) => {
  try {
    const { name, username, password, email, tel } = req.body;
    const { id } = req.params;

    console.log(name, id);

    const admin = await Advisor.findByIdAndUpdate(id, {
      name: name,
      email: email,
      tel: tel,
    });

    if (!admin) {
      throw new Error("แก้ไขข้อมูลไม่สำเร็จ");
    }

    const resp = await Advisor.findById(id);

    res.status(200).json({
      data: resp,
      message: "แก้ไขข้อมูลสำเร็จ",
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

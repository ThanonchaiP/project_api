const Teacher = require("../models/teacher");
const Advisor = require("../models/advisor");
const Classroom = require("../models/classroom");
const config = require("../config/index");
const saveImageToDisk = require("./FileUpload");
const e = require("express");
//GET admin
exports.index = async (req, res, next) => {
  const { id } = req.params;
  const { page, page_size } = req.query;
  const myPage = page ? parseInt(page) : 1;
  const myPageSize = page_size ? parseInt(page_size) : 15;

  const options = {
    select: "-password",
    sort: { firstname: 1 },
    lean: true,
    customLabels: { docs: "teachers" },
    page: myPage,
    limit: myPageSize,
  };

  const teachers = await Teacher.paginate({}, options);
  // const teachers = await Advisor.aggregate([
  //   {
  //     $lookup: {
  //       from: "classrooms", //collection name
  //       localField: "classroom", //field classroom in advisor model
  //       foreignField: "_id", // foreign in advisor model
  //       as: "Classroom",
  //     },
  //   },
  //   { $unwind: "$Classroom" },
  //   {
  //     $lookup: {
  //       from: "teachers", //collection name
  //       localField: "teacher", //field teacher in advisor model
  //       foreignField: "_id", // foreign in teacher model
  //       as: "Teacher",
  //     },
  //   },
  //   { $unwind: "$Teacher" },
  //   {
  //     $project: {
  //       //select and delete some field
  //       "Classroom.type": 0,
  //     },
  //     $project: {
  //       //select and delete some field
  //       "Teacher.password": 0,
  //     },
  //   },
  //   {
  //     $sort: {
  //       academic_year: -1,
  //       term: -1,
  //     },
  //   },
  // ]);

  res.status(200).json({
    data: teachers,
  });
};

//GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).select("-password");

    if (!teacher) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      data: teacher,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//Inser teacher
exports.insert = async (req, res, next) => {
  try {
    const {
      username,
      password,
      firstname,
      lastname,
      name_title,
      gender,
      email,
      tel,
      level,
      room,
      year,
      photo,
    } = req.body;

    let classroomId,
      advisorId = [];

    const checkUsername = await Teacher.findOne({ username: username });
    if (checkUsername) {
      const error = new Error("ชื่อผู้ใช้นี้มีในระบบเเล้ว");
      error.statusCode = 403;
      throw error;
    }

    const classroom = await Classroom.findOne({ class: level, room: room });
    if (!classroom) {
      let classroom = new Classroom({
        class: level,
        room: room,
        type: level[0] == "อ" ? "A" : level[0] == "ป" ? "B" : "C",
      });
      await classroom.save(); //save to db
      classroomId = classroom._id;
      if (classroom.nModified === 0) {
        const error = new Error("ไม่สามารถเพิ่มข้อมูลได้");
        error.statusCode = 403;
        throw error;
      }
    } else classroomId = classroom._id;

    let imgName;
    if (photo) {
      imgName = await saveImageToDisk(photo);
    }

    let teacher = new Teacher();
    teacher.username = username;
    teacher.password = await teacher.encryptPassword(password);
    teacher.firstname = firstname;
    teacher.lastname = lastname;
    teacher.name_title = name_title;
    teacher.gender = gender;
    teacher.email = email ? email : undefined;
    teacher.tel = tel ? tel : undefined;
    teacher.advisor = `${level}/${room}`;
    teacher.status = "1";
    (teacher.photo = imgName ? imgName : "nopic.png"),
      (teacher.photo_url = `${config.DOMAIN}/images/${
        imgName ? imgName : "nopic.png"
      }`),
      await teacher.save(); //save to db

    const advisor = await Advisor.find({
      classroom: classroomId,
      academic_year: year,
    });
    if (advisor.length === 0) {
      for (let i = 1; i <= 2; i++) {
        let advisor = new Advisor();
        advisor.teacher = teacher._id;
        advisor.classroom = classroomId;
        advisor.term = i.toString();
        advisor.academic_year = year;
        await advisor.save();
        advisorId[i - 1] = advisor._id;
      }
    } else {
      advisor.map(async (a) => {
        const advisors = await Advisor.findByIdAndUpdate(
          { _id: a._id },
          { teacher: teacher._id }
        );
      });
    }

    res.status(201).json({
      message: "เพิ่มข้อมูลสำเร็จ",
    });
  } catch (error) {
    next(error); //to middleware error
  }
};

//Delete BY ID
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete({ _id: id });

    const advisor = await Advisor.find({ teacher: id });
    if (advisor) {
      advisor.forEach(async (a) => {
        const update = await Advisor.findByIdAndUpdate(
          { _id: a._id },
          {
            teacher: null,
          }
        );
      });
    }

    res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
      // data: advisor,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//Update ProfileTeacher
exports.update = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      title,
      gender,
      email,
      tel,
      photo,
      oldPhoto,
      password,
      new_password,
    } = req.body;
    const { id } = req.params;

    //change password && ตรวจสอบรหัสผ่าน
    const getPassword = await Teacher.findById(id).select("password");
    let hashNewPassword = undefined;
    if (password && new_password) {
      const isValid = await getPassword.decryptPassword(password);
      if (!isValid) {
        const error = new Error("รหัสผ่านไม่ถูกต้อง");
        error.statusCode = 401;
        throw error;
      }
      hashNewPassword = await new Teacher().encryptPassword(new_password);
      const updatePassword = await Teacher.findByIdAndUpdate(id, {
        password: hashNewPassword,
      });
    }

    const teacher = await Teacher.findByIdAndUpdate(id, {
      name_title: title,
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      tel: tel,
      email: email,
      photo: photo ? await saveImageToDisk(photo) : oldPhoto ? oldPhoto : null,
    });

    if (teacher.nModified === 0) {
      const error = new Error("ไม่สามารถแก่ไขข้อมูลได้");
      error.statusCode = 400;
      throw error;
    } else {
      const data = await Teacher.findById(id).select("-password");

      res.status(200).json({
        status: 200,
        message: "แก้ไขข้อมูลสำเร็จ",
        data: data,
      });
    }
  } catch (error) {
    next(error); //to middleware error
  }
};

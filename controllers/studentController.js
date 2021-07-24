const Student = require("../models/student");
const Classroom = require("../models/classroom");
const Enrollments = require("../models/studentWithClassroom");
const Advisor = require("../models/advisor");
const mongoose = require("mongoose");
const fs = require("fs");
const { saveImageToDisk } = require("./imageController");
const config = require("../config/index");
//GET admin
exports.index = async (req, res, next) => {
  const { page, page_size } = req.query;
  const myPage = page ? parseInt(page) : 1;
  const myPageSize = page_size ? parseInt(page_size) : 15;

  const options = {
    select: "-level_of_admission -address",
    sort: { sid: 1 },
    lean: true,
    customLabels: { docs: "students" },
    page: myPage,
    limit: myPageSize,
  };

  // const students = await Student.find()
  //   .select("-level_of_admission -address")
  //   .sort({ sid: 1 });

  const students = await Student.paginate({}, options);

  res.status(200).json({
    data: students,
  });
};

//searchStudent
exports.searchStudent = async (req, res, next) => {
  try {
    const { id, firstname, lastname } = req.body;

    const student = await Student.find({
      $or: [
        { sid: id && { $regex: id } },
        { firstname: firstname && { $regex: firstname, $options: "i" } },
        { lastname: lastname && { $regex: lastname, $options: "i" } },
      ],
    });

    res.status(200).json({
      data: student,
    });
  } catch (error) {
    next(error); //to middleware error
  }
};

//GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    // if (!student) {
    //   throw new Error("ไม่พบข้อมูล");
    // }

    res.status(200).json({
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//GET Education History
exports.educationHistory = async (req, res, next) => {
  const { id } = req.params;
  let ids = mongoose.Types.ObjectId(id);

  const detail = await Student.findById(id).select(
    "name_title firstname lastname"
  );

  const resp = await Enrollments.aggregate([
    {
      $lookup: {
        from: "advisors", //collection name
        localField: "advisor", //field advisor in Enrollments model
        foreignField: "_id", // foreign in advisor model
        as: "Advisor",
      },
    },
    { $unwind: "$Advisor" },
    {
      $lookup: {
        from: "teachers", //collection name
        localField: "Advisor.teacher", //field classroom in Advisor model
        foreignField: "_id", // foreign in Classroom model
        as: "Teacher",
      },
    },
    { $unwind: "$Teacher" },
    {
      $lookup: {
        from: "classrooms", //collection name
        localField: "Advisor.classroom", //field classroom in Advisor model
        foreignField: "_id", // foreign in Classroom model
        as: "Classroom",
      },
    },
    { $unwind: "$Classroom" },
    {
      $project: {
        //select and delete some field
        Advisor: 1,
        student: 1,
        Classroom: 1,
        "Teacher.name_title": 1,
        "Teacher.firstname": 1,
        "Teacher.lastname": 1,
        _id: 0,
      },
    },
    { $match: { student: ids } },
    {
      $sort: {
        "Advisor.academic_year": -1,
      },
      $sort: {
        "Classroom.type": -1,
        "Classroom.room": -1,
      },
    },
  ]);

  res.status(200).json({
    student: detail,
    data: resp,
  });
};

//Inser Student
exports.insert = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      name_title,
      sid,
      gender,
      education_status,
      address,
      food_allergy,
      food_allergy_detail,
      level,
      room,
      old_level,
      year,
      brithday,
      photo,
    } = req.body;

    let classroomId,
      advisorId = [];

    const student = await Student.findOne({ sid: sid });
    if (student) {
      const error = new Error("รหัสประจำตัวนักเรียนนี้มีในระบบเเล้ว");
      error.statusCode = 403;
      throw error;
    }

    //ค้นหาห้องเรียน
    const classroom = await Classroom.findOne({
      class: level,
      room: room,
    }).select("_id");

    //add classroom หากไม่มีห้องเรียนนี้ในระบบ
    if (!classroom) {
      let classroom = await new Classroom({
        class: level,
        room: room,
        type: level[0] === "อ" ? "A" : level[0] === "ป" ? "B" : "C",
      });

      await classroom.save();

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

    let add = await new Student({
      firstname: firstname,
      lastname: lastname,
      name_title: name_title,
      sid: sid,
      gender: gender,
      address: address ? address : undefined,
      brithday: brithday,
      education_status: education_status,
      food_allergy: food_allergy ? food_allergy : undefined,
      food_allergy_detail: food_allergy_detail
        ? food_allergy_detail
        : undefined,
      level_of_education: level + "/" + room,
      level_of_admission: old_level ? old_level : undefined,
      academic_year: year,
      photo: imgName ? imgName : "nopic.png",
      photo_url: `${config.DOMAIN}/images/${imgName ? imgName : "nopic.png"}`,
    });
    await add.save(); //save to db

    if (add.nModified === 0) {
      const error = new Error("ไม่สามารถเพิ่มข้อมูลได้");
      error.statusCode = 403;
      throw error;
    }

    const advisor = await Advisor.find({
      classroom: classroomId,
      academic_year: year,
    });
    if (advisor.length === 0) {
      for (let i = 1; i <= 2; i++) {
        let advisor = new Advisor();
        advisor.classroom = classroomId;
        advisor.term = i.toString();
        advisor.academic_year = year;
        await advisor.save();
        advisorId[i - 1] = advisor._id;
      }
    } else {
      advisor.map((a, index) => {
        advisorId[index] = a._id;
      });
    }

    for (let i = 0; i <= 1; i++) {
      const enrollments = new Enrollments();
      enrollments.student = add._id;
      enrollments.advisor = advisorId[i];
      await enrollments.save();
    }

    res.status(201).json({
      message: "เพิ่มข้อมูลนักเรียนสำเร็จ",
      // sid: add._id,
      // advisor: advisorId,
      // cid: classroomId,
    });
  } catch (error) {
    next(error); //to middleware error
  }
};

//Delete BY ID
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    let ids = mongoose.Types.ObjectId(id);

    //delete from disk
    const photo = await Student.findById({ _id: ids }).select("photo");
    fs.unlinkSync(`${__dirname}/../public/images/${photo.photo}`);

    const student = await Student.remove({ _id: ids });
    const enrollments = await Enrollments.deleteMany({ student: ids });

    res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
    });
  } catch (error) {
    next(error); //to middleware error
  }
};

//Update admin
exports.update = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      default_sid,
      sid,
      name_title,
      gender,
      brithday,
      address,
      food_allergy,
      food_allergy_detail,
      status,
      photo_base64,
      photo_defalut,
    } = req.body;
    const { id } = req.params;
    if (default_sid !== sid) {
      const alreadySid = await Student.findOne({ sid: sid });
      if (alreadySid) {
        const error = new Error("รหัสประจำตัวนี้มีในระบบเเล้ว");
        error.statusCode = 403;
        throw error;
      }
    }

    let imgName = photo_defalut;
    if (photo_base64) {
      if (photo_defalut !== "nopic.png" && photo_defalut !== "nopic.jpg") {
        fs.unlinkSync(`${__dirname}/../public/images/${photo_defalut}`);
      }
      imgName = await saveImageToDisk(photo_base64);
    }

    const student = await Student.updateOne(
      { _id: id },
      {
        firstname: firstname,
        lastname: lastname,
        name_title: name_title,
        brithday: brithday,
        gender: gender,
        food_allergy: food_allergy,
        food_allergy_detail: food_allergy_detail,
        address: address,
        sid: sid,
        education_status: status,
        photo: imgName,
        photo_url: `${config.DOMAIN}/images/${imgName ? imgName : "nopic.jpg"}`,
      }
    );
    if (student.nModified === 0) {
      res.status(400).json({
        message: "ไม่สามารถแก้ไขข้อมูลได้",
      });
    } else {
      res.status(200).json({
        message: "แก้ไขข้อมูลนักเรียนสำเร็จ",
      });
    }
  } catch (error) {
    console.log(error);
    // next(error); //to middleware error
  }
};

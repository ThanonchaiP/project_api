const { saveImageToDisk } = require("./imageController");
const { validationResult } = require('express-validator');
const config = require("../config/index");
const Admin = require("../models/admin");
//GET admin
exports.index = async (req, res, next) => {
  const admin = await Admin.find().sort({ _id: 1 });

  res.status(200).json({
    data: admin,
  });
};

//GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

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
  try {
      const { name, username, password, gender , email, tel, photo } = req.body;

      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const error = new Error('ข้อมูลไม่ถูกต้อง');
          error.statusCode = 422;
          error.validation = errors.array();
          throw error; //โยนไปที่ catch
      }

      //check username ซ้ำ
      const alredyUsername = await Admin.findOne({ username: username });
      if (alredyUsername) {
          const error = new Error('username นี้มีผู้ใช้งานแล้ว');
          error.statusCode = 400;
          throw error; //โยนไปที่ catch
      }

      let admin = new Admin();
      admin.name = name;
      admin.username = username;
      admin.password = await admin.encryptPassword(password);
      admin.gender = gender;
      admin.email = email;
      admin.tel = tel;
      admin.photo = config.DOMAIN + "images/" + (await saveImageToDisk(photo));
      await admin.save(); //save to db

      res.status(201).json({
        message: "เพิ่มข้อมูลสำเร็จ",
      });
  } catch (error) {
    next(error); //to middlewart error
  }
};

//Delete BY ID
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete({ _id: id });

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
    const { name, password, newpassword, email, tel } = req.body;
    const { id } = req.params;

    // const admin = await Admin.findById(id);


    

    const admin = await Admin.findByIdAndUpdate(id, {
      name: name,
      email: email,
      tel: tel,
    });

    if (!admin) {
      throw new Error("แก้ไขข้อมูลไม่สำเร็จ");
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลสำเร็จ",
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

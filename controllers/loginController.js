const Admin = require('../models/admin');
const Teacher = require('../models/teacher')
const jwt = require('jsonwebtoken');
const config = require('../config/index');


exports.loginAdmin = async (req, res, next) => {
    try {
        const { username, password , role } = req.body;
  
        //check username ว่ามีอยู่ในระบบหรือไม่
        const admin = await Admin.findOne({ username: username });
        if (!admin) {
            const error = new Error('ไม่พบผู้ใช้งานนี้ในระบบ');
            error.statusCode = 404;
            throw error; //โยนไปที่ catch
        }

        //ตรวจสอบรหัสผ่าน
        const isValid = await admin.decryptPassword(password);
        if(!isValid){
            const error = new Error('รหัสผ่านไม่ถูกต้อง');
            error.statusCode = 401;
            throw error;
        }

        //สร้าง token
        const token = await jwt.sign({
          id:admin._id, //เป็นข้อมูลที่เก็บไว้ใน token
          role:role
        },config.JWT_SECRET, { expiresIn:'5 days' }); //expiresIn วันหมดอายุ
  
        
        //decode วันหมดอายุ
        const expires_in = jwt.decode(token);

        res.status(200).json({
          access_token:token,
          expires_in:expires_in.exp,
          token_type: 'Bearer'
        });

    } catch (error) {
      next(error); //to middleware error
    }
    
}

exports.loginTeacher = async (req, res, next) => {
  try {
      const { username, password , role } = req.body;

      //check username ว่ามีอยู่ในระบบหรือไม่
      const teacher = await Teacher.findOne({ username: username });
      if (!teacher) {
          const error = new Error('ไม่พบผู้ใช้งานนี้ในระบบ');
          error.statusCode = 404;
          throw error; //โยนไปที่ catch
      }

      //ตรวจสอบรหัสผ่าน
      const isValid = await teacher.decryptPassword(password);
      if(!isValid){
          const error = new Error('รหัสผ่านไม่ถูกต้อง');
          error.statusCode = 401;
          throw error;
      }
      console.log(teacher.role)
      //สร้าง token
      const token = await jwt.sign({
        id:teacher._id, //เป็นข้อมูลที่เก็บไว้ใน token
        role:role
      },config.JWT_SECRET, { expiresIn:'5 days' }); //expiresIn วันหมดอายุ

      
      //decode วันหมดอายุ
      const expires_in = jwt.decode(token);
      
      res.status(200).json({
        access_token:token,
        expires_in:expires_in.exp,
        token_type: 'Bearer'
      });

  } catch (error) {
    next(error); //to middleware error
  }
  
}

//get profile
exports.profile = async (req, res, next) => {
  return res.status(200).json({
    user:req.user
  });
}
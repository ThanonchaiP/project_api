const Admin = require("../models/admin");
const Student = require("../models/student");
//GET admin
exports.index = async (req, res, next) => {
  const students = await Student.find();
  
  res.status(200).json({
    data: students,
  });
};


//GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      throw new Error("ไม่พบข้อมูล");
    }

    res.status(200).json({
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      error: "เกิดข้อผิดพลาด " + error.message,
    });
  }
};

//Inser Student
exports.insert = async (req, res, next) => {
  const { name, username, password, email, tel } = req.body;

  let resp = new Student({
    name: name,
    username: username,
    password: password,
    email: email,
    tel: tel,
  });
  await resp.save(); //save to db

  res.status(201).json({
    message: "เพิ่มข้อมูลสำเร็จ",
  });
};

//Delete BY ID
exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByIdAndDelete({_id:id});

        if (!admin) {
            throw new Error("ไม่พบข้อมูล");
        }

        res.status(200).json({
            message: 'ลบข้อมูลเรียบร้อย',
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
        const { firstname, salary } = req.body;
        const { id } = req.params;
        // const staff = await Staff.findById(id);
        
        // if (!staff) {
        //     throw new Error('ไม่พบข้อมูลพนักงาน');
        // }

        // staff.name = name;
        // staff.salary = salary;
        // await staff.save();


        // const staff = await Staff.findByIdAndUpdate(id,{
        //     name:name,
        //     salary:salary
        // });


        const student = await Student.updateOne({_id:id},{
            firstname:firstname,
            salary:salary
        });
        if (student.nModified === 0) {
            res.status(200).json({
                message: 'ไม่สามารถอัพเดทข้อมูลได้'
            });
        }else{
            res.status(200).json({
                message: 'แก้ไขข้อมูลสำเร็จ'
            });
        }
        

    } catch (error) {
        res.status(400).json({
            error: 'เกิดข้อผิดพลาด' + error.message
        });
    }
}
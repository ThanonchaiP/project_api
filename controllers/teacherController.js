const Admin = require("../models/admin");
const Teacher = require("../models/teacher");
//GET admin
exports.index = async (req, res, next) => {
  const teacher = await Teacher.find();
  
  res.status(200).json({
    data: teacher,
  });
};


//GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

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

//Inser admin
exports.insert = async (req, res, next) => {
  const { name, username, password, email, tel } = req.body;

  let admin = new Teacher({
    name: name,
    username: username,
    password: password,
    email: email,
    tel: tel,
  });
  await Teacher.save(); //save to db

  res.status(201).json({
    message: "เพิ่มข้อมูลสำเร็จ",
  });
};

//Delete BY ID
exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;

        const admin = await Teacher.findByIdAndDelete({_id:id});

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


        const student = await Teacher.updateOne({_id:id},{
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
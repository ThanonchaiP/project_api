const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const Schema = schema(
  {
    name_title: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    tel: { type: String },
    username: { type: String, required: true, trim:true,unique:true,index:true },
    password: { type: String, required: true },
    email: { type: String },
    status: { type: String },
    photo: { type: String, default: "nopic.png" },
  },
  {
    // toJSON:{virtuals:true},
    collation: "teachers",
  }
);

// Schema.virtual("advisors", {
//   ref: "Advisor", //link to model Advisor
//   localField: "_id", // _id ฟิลด์ของ Model Shop ไฟล์นี้
//   foreignField: "teacher",
// });

//encryptPassword
Schema.methods.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(5); // genSalt เอาไปผสมกับ password ให้ยากขึ้น
  const hashPassword = await bcrypt.hash(password,salt);
  return hashPassword;
}

//decryptPassword
Schema.methods.decryptPassword = async function(password) {
  const isValid = await bcrypt.compare(password,this.password); //this.password คือ field ที่อยู้ใน DB
  return isValid;
}


const teacher = mongoose.model("Teacher", Schema);

module.exports = teacher;

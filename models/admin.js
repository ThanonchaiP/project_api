const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Schema = new mongoose.Schema(
  {
    name: { type: String, required:true },
    username: { type: String, required:true,trim:true,unique:true,index:true },
    password: { type: String, required:true, minlength: 3 },
    gender: { type: String, required:true},
    email: { type: String},
    tel: { type: String},
    photo: { type: String,default:'nopic.jpg'},
    role:{type:String,default:'admin'}
  },
  {
    collation: "admins", //collation ให้ตรงกับ table ใน DB
  }
);


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




const admin = mongoose.model("Admin", Schema);

module.exports = admin;

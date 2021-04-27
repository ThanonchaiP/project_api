const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  firstname:  {type:String,required:true,trim:true},
  lastname:  {type:String,required:true,trim:true},
  name_title:  {type:String,required:true,trim:true},
  academic_year: {type:String,required:true},
  brithday:  {type:Date},
  education_status:  {type:String,required:true},
  gender:  {type:String,required:true},
  level_of_admission:  {type:String},
  level_of_education:  {type:String},
  photo:  {type:String,default:'nopic.jpg'},
},{
  timestamps:true,
  collection: 'students'
});

const student = mongoose.model('Student',schema);

module.exports = student;
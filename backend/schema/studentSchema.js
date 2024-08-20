const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  firstname:{
    type:String,
    required: true,
  },
  lastname:{
    type:String,
    required: true,
  },
  email:{
    type: String,
     required: true,
      unique: true
  },
  password: { 
    type: String,
     required: true
  },
});

const Student = mongoose.model('student', studentSchema);

module.exports= Student;

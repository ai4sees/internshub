const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema =new mongoose.Schema({
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
  resume: {
    data: Buffer, // Store the file data as binary
    contentType: String, // Store the MIME type
    filename: String, // Store the original filename
  },
  
    
},{timestamps: true});


studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports= Student;

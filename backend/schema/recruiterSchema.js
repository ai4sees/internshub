const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Internship=require('./internshipSchema')

// const internshipSchema = new mongoose.Schema({
//   internshipName: {
//     type: String,
//     required: true,
//   },
//   internshipType: {
//     type: String, // Ensures that the type is either 'Remote' or 'Office'
//   },
//   internLocation:{
//     type:String
//   },
//   numberOfOpenings: {
//     type: Number,
//     required: true,
//   },
//   stipend: {
//     type: Number,
//     required:true
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   skills: {
//     type: [String], // Array of strings to store the skills
//     default: [],   // Default to an empty array if no skills are provided
//   },
//   // Additional fields related to internships can be added here if needed
// }, {timestamps: true});



const recruiterSchema =new mongoose.Schema({
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
  phone:{
    type:Number
  },
  password: { 
    type: String,
  },
  internships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    default: []
  }],
  
    
},{timestamps: true});


recruiterSchema.pre('save', async function (next) {
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

recruiterSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports= Recruiter;

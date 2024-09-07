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
  },
  resume: {
    data: Buffer, // Store the file data as binary
    contentType: String, // Store the MIME type
    filename: String, // Store the original filename
    //add a field for current time and date
  
  },
  education: [{
    degree: String,
    fieldOfStudy:String,
    institution: String,
    score:String,
    startYear: String,
    endYear: String,
  }],
  workExperience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      typeofwork: String,
      description: String,
  }],
  certificates: [{
    title: String,
    issuingOrganization: String,
    issueDate: String,
    description: String, // Added description field
  }],
  personalProjects: [{
    title: String,
    description: String,
    link: String,
  }],
  skills: [{
    skillName: String,
    proficiency: String,
  }],
  portfolioLink: [{
    linkType: String,
    linkUrl:String
  }],
  // appliedInternships: [{
  //     internship: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Internship',
  //     },
  //   }]
  appliedInternships: [{
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
    },
    appliedAt: {
      type: Date,
      default: Date.now // Automatically stores the date and time of application
    }
  }],

  
    
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

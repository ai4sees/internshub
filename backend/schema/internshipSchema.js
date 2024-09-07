const mongoose = require("mongoose");
// const Recruiter=require('./recruiterSchema')

const internshipSchema = new mongoose.Schema(
  {
    internshipName: {
      type: String,
      required: true,
    },
    internshipType: {
      type: String,
    },
    internLocation: {
      type: String,
    },
    numberOfOpenings: {
      type: Number,
      required: true,
    },
    stipend: {
      type: Number,
      required: true,
    },
    duration:{
      type:Number,
      required:true
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    recruiter: {  // Add this field to link to the recruiter who posted the internship
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Initialize with 0 views
    },
    
  },{ timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;

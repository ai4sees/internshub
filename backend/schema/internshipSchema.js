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
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    
  },{ timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;

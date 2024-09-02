const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const Internship=require('../schema/internshipSchema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const {jwtDecode} = require('jwt-decode');

dotenv.config();
const router= express.Router();

router.post('/post/:userId',async(req,res)=>{
  const {userId}=req.params;
  const {internshipName,internshipType,internLocation,numberOfOpenings,stipend,description,skills}=req.body;
  try{

  const recruiter=await Recruiter.findById(userId);
  if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

  const newInternship = new Internship({
    internshipName,
    internshipType,
    internLocation,
    numberOfOpenings,
    stipend,
    description,
    skills,
  });
  await newInternship.save();
  console.log('Recruiter object:', recruiter);
  recruiter.internships.push(newInternship._id);
  await recruiter.save();

  // recruiter.internships.push(newInternship);
  // await recruiter.save();

  res.status(201).json({ success: true, internship: newInternship });

}catch(error){
  console.error('Error posting internship:', error);
  res.status(500).json({ message: 'Internal server error' });
}

})





module.exports = router;
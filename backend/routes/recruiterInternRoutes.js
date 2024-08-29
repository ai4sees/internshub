const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const {jwtDecode} = require('jwt-decode');

dotenv.config();
const router= express.Router();

router.post('/post/:userId',async(req,res)=>{
  const {userId}=req.params;
  const {internshipName,internshipType,numberOfOpenings,stipend,description,skills}=req.body;
  try{

  const recruiter=await Recruiter.findById(userId);
  if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

  const newInternship = {
    internshipName,
    internshipType,
    numberOfOpenings,
    stipend,
    description,
    skills,
  };

  recruiter.internships.push(newInternship);
  await recruiter.save();

  // const newInternship=new {
  //   internshipName,
  //   internshipType,
  //   numberOfOpenings,
  //   stipend,
  //   description,
  //   skills
    
  // };
  // await newInternship.save();
  res.status(201).json({ success: true, internship: newInternship });

}catch(error){
  console.error('Error posting internship:', error);
  res.status(500).json({ message: 'Internal server error' });
}

})



module.exports = router;
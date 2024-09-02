const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const Internship=require('../schema/internshipSchema');
const dotenv = require('dotenv');
const router = require('./recruiterInternRoutes');


router.get('/:userId',async(req,res)=>{
  const {userId}=req.params;
  
})

module.exports = router;
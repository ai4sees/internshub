const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const Internship=require('../schema/internshipSchema');
const Student=require('../schema/studentSchema')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const {jwtDecode} = require('jwt-decode');

dotenv.config();
const router= express.Router();

router.post('/post/:userId',async(req,res)=>{
  const {userId}=req.params;
  const {internshipName,internshipType,internLocation,numberOfOpenings,stipend,duration,description,skills}=req.body;
  try{

  const recruiter=await Recruiter.findById(userId);
  if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

  const newInternship = new Internship({
    internshipName,
    internshipType,
    internLocation,
    numberOfOpenings,
    stipend,
    duration,
    description,
    skills,
    recruiter: userId,
  
  });
  await newInternship.save();
  
  console.log('Recruiter object:', recruiter);
  recruiter.internships.push(newInternship._id);
  await recruiter.save();


  res.status(201).json({ success: true, internship: newInternship });

}catch(error){
  console.error('Error posting internship:', error);
  res.status(500).json({ message: 'Internal server error' });
}

})

router.get('/:recruiterId/getInternships',async(req,res)=>{
  const {recruiterId}=req.params;
  try {
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({message:'Recruiter not found'});
    
    const internships=await Internship.find({recruiter:recruiterId});
    res.status(200).json(internships);


  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
})


router.get('/:recruiterId/applicants/:internshipId', async (req, res) => {
  const { recruiterId, internshipId } = req.params;

  try {
    // Check if the recruiter exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    // Check if the internship exists and belongs to the recruiter
    const internship = await Internship.findOne({ _id: internshipId, recruiter: recruiterId });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Find students who have applied for this internship
    const applicants = await Student.find({ 'appliedInternships.internship': internshipId });

    // Return the list of applicants
    res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:recruiterId/getDetails/:internshipId',async(req,res)=>{
  const {recruiterId,internshipId}=req.params;
  try {
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

    const internship = await Internship.findOne({ _id: internshipId, recruiter: recruiterId }); 
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.status(200).json(internship);
  } catch (error) {
    console.error('Error fetching internhsip details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
})




module.exports = router;
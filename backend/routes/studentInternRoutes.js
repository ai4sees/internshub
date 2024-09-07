const express = require('express');
const Student=require('../schema/studentSchema');
const Internship=require('../schema/internshipSchema')
const dotenv = require('dotenv');


dotenv.config();
const router= express.Router();

router.post('/:studentId/apply/:internshipId', async (req, res) => {
  const { studentId, internshipId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const alreadyApplied = student.appliedInternships.some((application) => 
      application.internship === internshipId
    );

    if (alreadyApplied) {
      return res.status(200).json({ success: 'True', message: 'Already applied for this internship' });
    }

    student.appliedInternships.push({
      internship: internshipId,
      appliedAt: new Date() // Save the current date and time
    });

    await student.save();

    res.status(200).json({ message: 'Successfully applied to internship' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:studentId/applied-internships',async(req,res)=>{
  const {studentId}=req.params;
  
  try {
    const student = await Student.findById(studentId)
      .populate({
        path: 'appliedInternships.internship', // Populate the internships the student applied to
        populate: {
          path: 'recruiter', // Further populate the recruiter details within each internship
          select: 'firstname lastname email', // Select specific fields of the recruiter
        },
      });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const internships = student.appliedInternships.map(application => ({
        internship: application.internship, // Internship details
        recruiter: application.internship.recruiter, // Recruiter details
        appliedAt: application.appliedAt, // Applied date
      }));
  
    res.status(200).json(internships);
   
  } catch (error) {
    console.error('Error fetching applied internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
})

router.put('/:internshipId/view', async (req, res) => {
  const { internshipId } = req.params;

  try {
    const internship = await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { views: 1 } }, // Increment the views by 1
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json(internship);
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;
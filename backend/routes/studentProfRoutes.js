const express = require('express');
const Student = require('../schema/studentSchema');


const router= express.Router();


router.get('/:id/education',async(req,res)=>{
  try{
  const userId=req.params.id;
  const student= await Student.findById(userId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if(!student.education || student.education.length === 0){
    // return res.status(404).json({message: 'Student having the education field is not available'});
    return null;
  }
  res.status(200).json(student.education);
}
catch (error) {
  console.error('Error fetching education details:', error);
  res.status(500).json({ message: 'Server error' });
}
})

router.post('/:id/education', async(req,res)=>{
  try{
    const { degree, fieldOfStudy, institution, startYear, endYear } = req.body;
    const userId=req.params.id;

    console.log('Request Body:', req.body);
    
    const student=await Student.findById(userId);

    if(!student) return res.status(404).json({message: 'Student not found'});

    student.education.push({
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear
    });

    // Save the updated student document
    await student.save();

    res.status(200).json({ message: 'Education details added successfully', education: student.education });


  }
  catch(error){
    console.error('Error updating education details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
})

module.exports = router;
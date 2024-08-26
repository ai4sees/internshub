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
  console.log(student.education);
  res.status(200).json(student.education);
}
catch (error) {
  console.error('Error fetching education details:', error);
  res.status(500).json({ message: 'Server error' });
}
})

router.post('/:id/education', async(req,res)=>{
  try{
    const { degree, fieldOfStudy, institution, startYear, endYear, score } = req.body;
    const userId=req.params.id;

    console.log('Request Body:', req.body);
    
    const student=await Student.findById(userId);

    if(!student) return res.status(404).json({message: 'Student not found'});

    student.education.push({
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear,
      score
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

router.put('/:userId/education/:index', async (req, res) => {
  const { userId, index } = req.params;
  const { degree, fieldOfStudy, institution, startYear, endYear, score } = req.body;

  try {
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the index is within the bounds of the array
    if (index < 0 || index >= student.education.length) {
      return res.status(400).json({ message: 'Invalid education index' });
    }

    // Update the education details
    student.education[index] = { degree, fieldOfStudy, institution, startYear, endYear, score };
    await student.save();

    res.status(200).json(student.education[index]);
  } catch (error) {
    console.error('Error updating education details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:userId/education/:index', async (req, res) => {
  const { userId, index } = req.params;
  console.log('inside delete backend');
  try {
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the index is within the bounds of the array
    if (index < 0 || index >= student.education.length) {
      return res.status(400).json({ message: 'Invalid education index' });
    }

    // Remove the education details at the specified index
    student.education.splice(index, 1);
    await student.save();

    res.status(200).json({ message: 'Education details deleted' });
  } catch (error) {
    console.error('Error deleting education details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
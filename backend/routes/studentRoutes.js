const express = require('express');
const Student = require('../schema/studentSchema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');


dotenv.config();
const router= express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', async (req, res) => {
  const { firstname,lastname,email, password } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // user = new User({ email, password });
    // await user.save();

    const newStudent = await Student.create({
      firstname,
      lastname,
      email,
      password,
    })
    
    const token = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
    res.status(201).json({ message: 'Student created successfully',token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async(req,res)=>{
  const {email, password}=req.body;
  try {
    // Find the user by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  const isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
  res.status(200).json({ message: 'Login successful', token });
}
catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
  
}
})


router.post('/upload-resume/:id', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
        // Find the student by ID and update their document with the resume file
        const student = await Student.findById(req.params.id);
        if (!student) {
          return res.status(404).send('Student not found.');
        }
    
        // Update the student document with the resume
        student.resume = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname,
        };
        await student.save();
    
        res.send('Resume uploaded and saved successfully.');
    
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).send('Error saving resume.');
  }
});

router.get('/resume/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || !student.resume) {
      return res.status(404).send('Resume not found.');
    }

    res.setHeader('Content-Type', student.resume.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${student.resume.filename}"`);
    res.send(student.resume.data);
  } catch (error) {
    console.error('Error retrieving resume:', error);
    res.status(500).send('Error retrieving resume.');
  }
});

module.exports = router;
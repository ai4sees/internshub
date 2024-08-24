const express = require('express');
const Student = require('../schema/studentSchema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {jwtDecode} = require('jwt-decode');
// const getUserIdFromToken = require('../auth/auth');
// const { default: getUserIdFromToken } = require('../../client/src/components/student/auth/authUtils');


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

router.post('/signup/googleauth', async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if the user already exists
    let student = await Student.findOne({ email });

    if (!student) {
      // If user doesn't exist, create a new one
      student = new Student({
        firstname,
        lastname,
        email,
        // Password can be omitted or a default value if using Google Auth
      });
      await student.save();
    }
     
      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
      res.json({ success: true, student, token });
    } 
      
   catch (error) {
    console.error('Error handling Google sign-in on the server:', error);
    res.json({ success: false, message: 'Server error' });
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

router.post('/login/googleauth', async (req, res) => {
  const { email,firstname,lastname } = req.body;

  try {
    // Check if the user already exists
    let student = await Student.findOne({ email });

    if (!student) {
      student = new Student({
        firstname,
        lastname,
        email,})
         await student.save();

    } 
    const token=jwt.sign({id:student._id},process.env.JWT_SECRET_KEY,{expiresIn:'10d'});
    res.json({success:true,token,student});
    
  } catch (error) {
    console.error('Error handling Google login on the server:', error);
    res.json({ success: false, message: 'Server error' });
  }
});


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
        const createdAt = new Date();
        const day = String(createdAt.getDate()).padStart(2, '0');
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[createdAt.getMonth()];
        
        student.resume = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname,
          createdAt: `${day}th ${month}`,
        };
        await student.save();
    
        res.send('Resume uploaded and saved successfully.');
    
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).send('Error saving resume.');
  }
});

router.get('/details', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from 'Bearer TOKEN'

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id; // Ensure that the token contains an `id` field

    // Find the user in the database
    const student = await Student.findById(userId);

    if (!student) return res.status(200).json({success:false}); // Not found if user does not exist

    // Send user data as response
    res.status(200).json({
      success: true,
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
      }
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.sendStatus(500); // Internal server error
  }
});


router.get('/resume/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || !student.resume) {
      return res.status(404).send('Resume not found.');
    }
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-Type', student.resume.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${student.resume.filename}"`);
    res.send(student.resume.data);
    


  } catch (error) {
    console.error('Error retrieving resume:', error);
    res.status(500).send('Error retrieving resume.');
  }
});

module.exports = router;
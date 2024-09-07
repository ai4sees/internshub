const express = require('express');
const Student = require('../schema/studentSchema');
const Recruiter= require('../schema/recruiterSchema.js')
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
        education:student.education,
        workExperience:student.workExperience,
        certificates:student.certificates,
        personalProjects:student.personalProjects,
        skills:student.skills,
        portfolioLink:student.portfolioLink

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

router.get('/:userId/internships', async (req, res) => {
  try {
    const { workType, locationName,minStipend } = req.query;
    // console.log('Received workType:', workType);
    // console.log('Received locationName:', locationName);
    const recruiters = await Recruiter.find().populate('internships');
    let internships = [];

    recruiters.forEach(recruiter => {
      recruiter.internships.forEach(internship => {
        internships.push({
          ...internship._doc,
          recruiter: {
            _id: recruiter._id,
            firstname: recruiter.firstname,
            lastname: recruiter.lastname,
            email: recruiter.email,
            phone: recruiter.phone,
          },
        });
      });
    });

    // internships.forEach(internship => {
    //   // console.log('Internship Type:', internship.internshipType);
    // });

    if(workType==='Work from Home'){
      internships=internships.filter(internship=>internship.internshipType==='Work from Home');
    }else if(workType==='Work from Office' || locationName==='All Locations'){
      internships = internships.filter(internship => internship.internshipType === 'Work from Office');
      if (locationName && locationName!=='All Locations') {
        internships = internships.filter(internship => internship.internLocation === locationName);
      }
    }

    if (minStipend) {
      internships = internships.filter(internship => internship.stipend >= parseInt(minStipend));
    }
    
    // console.log('Filtered Internships:', internships);
    
    for (const internship of internships) {
      const students = await Student.find({ 'appliedInternships.internship': internship._id });
      
      // Add studentCount as a new property to the internship object
      internship.studentCount = students.length;
    }
    // console.log(internships);
     res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
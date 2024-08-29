const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const {jwtDecode} = require('jwt-decode');

dotenv.config();
const router= express.Router();

router.post('/signup', async (req, res) => {
  const { firstname,lastname,email,phone, password } = req.body;

  try {
    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ message: 'Recruiter already exists' });
    }


    recruiter = await Recruiter.create({
      firstname,
      lastname,
      email,
      phone,
      password,
    })
    
    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
    res.status(201).json({ message: 'recruiter created successfully',token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup/googleauth', async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if the user already exists
    let recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      // If user doesn't exist, create a new one
      recruiter = new Recruiter({
        firstname,
        lastname,
        email,
        // Password can be omitted or a default value if using Google Auth
      });
      await recruiter.save();
    }
     
      const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
      res.json({ success: true, recruiter, token });
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
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  const isMatch = await recruiter.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
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
    let recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      recruiter = new Recruiter({
        firstname,
        lastname,
        email,})
         await recruiter.save();

    } 
    const token=jwt.sign({id:recruiter._id},process.env.JWT_SECRET_KEY,{expiresIn:'10d'});
    res.json({success:true,token,recruiter});
    
  } catch (error) {
    console.error('Error handling Google login on the server:', error);
    res.json({ success: false, message: 'Server error' });
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
    const recruiter = await Recruiter.findById(userId);

    if (!recruiter) return res.json({ success:false });

    // Send user data as response
    res.status(200).json({
      success:true,
      recruiter:{
        firstname:recruiter.firstname,
        lastname:recruiter.lastname,
        email:recruiter.email,
        phone: recruiter.phone,
        
      }
    })
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.sendStatus(500); // Internal server error
  }
});

module.exports = router;
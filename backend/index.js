const express = require('express');
const cors = require('cors');
const connection=require('./mongoose/connect');
const dotenv = require('dotenv');
const Student=require('./schema/studentSchema');
const jwt = require('jsonwebtoken');
const studentRoutes= require('./routes/studentRoutes');
const recruiterRoutes= require('./routes/recruiterRoutes')
const studentProfRoutes = require('./routes/studentProfRoutes');
const recruiterInternRoutes=require('./routes/recruiterInternRoutes')
const studentInternRoutes = require('./routes/studentInternRoutes');


const app = express();
const PORT=process.env.PORT || 4000;
dotenv.config();
//cors middleware
app.use(cors());

// app.use(cors({
//   origin:['https://clone-internshub-client.vercel.app'],
//   methods:['POST','GET','PUT','DELETE'],
//   credentials:true,
// }));

app.use(express.json());
// https://clone-internshub-client.vercel.app/

app.use('/student',studentRoutes);
app.use('/recruiter',recruiterRoutes);
app.use('/student/profile',studentProfRoutes);
app.use('/recruiter/internship',recruiterInternRoutes);
app.use('/student/internship',studentInternRoutes);
app.get('/',(req,res)=>{
  res.send('Welcome to our Server......')
})



const startServer= async()=>{
  try {
    connection(process.env.MONGO_URI);
    app.listen(PORT,()=> console.log(`Server has Started on port http://localhost:${PORT}`))
  } catch (error) {
    console.log(error);
  }
}
startServer();
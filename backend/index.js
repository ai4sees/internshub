const express = require('express');
const cors = require('cors');
const connection=require('./mongoose/connect');
const dotenv = require('dotenv');
const Student=require('./schema/studentSchema');
const jwt = require('jsonwebtoken');
const studentRoutes= require('./routes/studentRoutes');


const app = express();
const PORT=process.env.PORT || 4000;
//cors middleware
app.use(cors());
app.use(express.json());


app.use('/student',studentRoutes);
app.get('/',(req,res)=>{
  res.send('Welcome to our Server...')
})



const startServer= async()=>{
  try {
    connection('mongodb://localhost:27017');
    app.listen(PORT,()=> console.log(`Server has Started on port http://localhost:${PORT}`))
  } catch (error) {
    console.log(error);
  }
}
startServer();
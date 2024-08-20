const express = require('express');
const cors = require('cors');
const connection=require('./mongoose/connect');

const app = express();
const PORT=process.env.PORT || 4000;
app.use(cors());
app.use(express.json());


const startServer= async()=>{
  try {
    connection('mongodb://localhost:27017');
    app.listen(PORT,()=> console.log(`Server has Started on port http://localhost:${PORT}`))
  } catch (error) {
    console.log(error);
  }
}
startServer();
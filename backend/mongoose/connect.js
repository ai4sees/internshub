const mongoose = require('mongoose');
const connection=(url)=>{
  mongoose.connect(url,)
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.log(err));
}

module.exports= connection;
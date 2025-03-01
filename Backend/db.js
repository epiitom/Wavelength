const mongoose = require("mongoose");


// connecting moongose 
mongoose.connect('mongodb+srv://prathmesh18:FWGAGN8iu7nBY9z0@cluster1.pmfqlsq.mongodb.net/')

.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
   // schema for user collection
  const userSchema = new mongoose.Schema({
    username : String,
    email: String,
    password:String
  })
  // create user model based on schema
  const User = mongoose.model('User', userSchema);
  module.exports ={
    User
  }
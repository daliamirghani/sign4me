
const mongoose = require("mongoose");
require('dotenv').config({ path:"./config/db.env"})

const uri = "mongodb+srv://yomna:yomna@signlang.gs0jb5i.mongodb.net/?retryWrites=true&w=majority&appName=signlang";
async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected with Mongoose");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;


const mongoose = require("mongoose");
require('dotenv').config({ path:"./config/db.env"})

const uri =process.env.database_key;
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

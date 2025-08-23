const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const dataRouter = require("./routes/dataRouter")
const { checkUser } = require("./middlewares/authMiddleware");
const {signUp, signIn, signOut}=require("./controllers/Authorization")
require('dotenv').config({ path:"./config/db.env"})

console.log(process.env.database_key)
console.log(process.env.JWT_SECRET);

const app = express();
app.use(cookieParser());
connectDB();
app.use(express.json()); 

app.post("/signup", signUp);
app.post("/signin",signIn);
app.get("/signout",signOut);
app.post("/profile", checkUser, (req, res) => {
   res.json({
    msg: "Welcome to your profile",
    userId: req.userId,
    username: req.user.username,
    email: req.user.email
  });
});


app.use('/data', dataRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

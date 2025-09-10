require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dataRouter = require("./routes/dataRouter")
const authRouter = require("./routes/authRouter");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "https://sign4me.netlify.app",
  credentials: true
}));
 
app.use(cookieParser());
;



connectDB();


app.use("/data", dataRouter);
app.use("/auth", authRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

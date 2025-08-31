const express = require("express");
const connectDB = require("./database/db");
const dataRouter = require("./routes/dataRouter")
const authRouter = require("./routes/authRouter");

const app = express();
connectDB();
app.use(express.json());
app.use('/', dataRouter);
app.use('/auth', authRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

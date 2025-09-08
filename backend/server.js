const express = require("express");
const connectDB = require("./database/db");
const dataRouter = require("./routes/dataRouter")
const authRouter = require("./routes/authRouter");
const cors = require('cors');
const app = express();
connectDB();
app.use(cors());

app.use(express.json());
app.use('/', dataRouter);
app.use('/auth', authRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

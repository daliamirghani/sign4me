const express = require("express");
const connectDB = require("./database/db");
const dataRouter = require("./routes/dataRouter")
require('dotenv').config({ path:"./config/db.env"})
console.log(process.env.database_key)
const app = express();
connectDB();

app.use('/data', dataRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

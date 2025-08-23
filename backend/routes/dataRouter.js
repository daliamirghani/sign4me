const express = require('express')
const dataController = require("../controllers/dataController")
const dataRouter = express.Router();

dataRouter.get("/level/:level", dataController.getDataByLevel)
dataRouter.get("/category/:category", dataController.getDataByCategory)
module.exports = dataRouter;
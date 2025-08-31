const express = require('express')
const dataController = require("../controllers/dataController")
const dataRouter = express.Router();

dataRouter.get("/level/:level", dataController.getDataByLevel)
dataRouter.get("/category/:category", dataController.getDataByCategory)
dataRouter.get("/quiz/showWords/:level", dataController.makeQuizWord)
dataRouter.get("/quiz/showSigns/:level", dataController.makeQuizSign)

module.exports = dataRouter;
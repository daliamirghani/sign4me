const signData= require("../models/level_model");
const mongoose = require("mongoose");
const helper = require("../helper functions/helpers")
const getDataByLevel = async (req, res) => {
    try {
        const level = parseInt(req.params.level);
        const foundData = await signData.find({ levelNumber: level });
        res.status(200).send(foundData);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

const getDataByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const foundLevels = await signData.find({ "signs.category": category });
        const matchingSigns = foundLevels.flatMap(level =>
            level.signs.filter(sign => sign.category === category)
        );

        res.status(200).send(matchingSigns);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const makeQuizWord = async (req, res) =>{
const level = parseInt(req.params.level);
const levelData = await signData.find({levelNumber: level})
const levelIndex = level - 1;
const shuffledData = helper.shuffle(levelData[levelIndex].signs);
const quiz = helper.makeQuiz(shuffledData,1)

if (quiz)
{
    return res.status(200).json({
       quiz: quiz 
    })
}
else {
     return res.status(404).json({
       msg: "Error creating quiz!" 
    })
}
}

const makeQuizSign= async (req, res) =>{
const level = parseInt(req.params.level);
const levelData = await signData.find({levelNumber: level})
const levelIndex = level - 1;
const shuffledData = helper.shuffle(levelData[levelIndex].signs);
const quiz = helper.makeQuiz(shuffledData,1)

if (quiz)
{
    return res.status(200).json({
       quiz: quiz 
    })
}
else {
     return res.status(404).json({
       msg: "Error creating quiz!" 
    })
}
}


module.exports = {
    getDataByCategory,
    getDataByLevel,
    makeQuizSign,
    makeQuizWord
}
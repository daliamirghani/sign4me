const signData= require("../models/level_model");
const mongoose = require("mongoose");

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


module.exports = {
    getDataByCategory,
    getDataByLevel
}
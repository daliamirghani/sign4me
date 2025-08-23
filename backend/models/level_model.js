const mongoose = require("mongoose");

const signSchema = new mongoose.Schema({
  signImage: { type: String, required: true },  
  answer: { type: String, required: true },
  category: { type: String, required: true } // letter, food, color, people, pronoun, daily word
});

const levelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true, unique: true },
  signs: [signSchema], 
});

const Level = mongoose.model("Level", levelSchema);
module.exports = Level; 

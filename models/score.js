const mongoose = require('mongoose')
const Joi = require('joi');
//joi bibliotheque de validation des champs
const scoreSchema =new mongoose.Schema({
    studentId: {
      type: mongoose.Types.ObjectId,
      ref:'user',
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref:'video',
      required: true,
    },
    QuestionId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
});
  
const Score = mongoose.model("Score", scoreSchema);
  
  function validateScore(score) {
    const schema = Joi.object({
      studentId: Joi.objectId().required(),
      courseId: Joi.objectId().required(),
      QuestionId: Joi.objectId().required(),
      score: Joi.number().required().min(0),
    });
    return schema.validate(score);
  }
module.exports = Score;
exports.validate = validateScore;
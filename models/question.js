const mongoose = require('mongoose');
const CoachId=require('./user');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    count:{
        type: Number,//nombre totale des questions
    },
    CoachId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    QuizId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz',
    },
    difficulty: {
        type: Number,
        //required: false
    },
    Options: [{ 
        type: Object,
        required: true
    }],
    correctAnswer: { 
        type: String,
        required: true
    },
  
},   { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
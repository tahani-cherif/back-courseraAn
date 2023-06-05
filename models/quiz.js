const mongoose = require('mongoose')
const Question=require('./question');

const quizSchema =new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coatch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    question: [{  //Un ObjectId est un type spécial généralement utilisé pour les identifiants uniques
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        // required: true
    }],
},   { timestamps: true })

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
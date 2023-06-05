const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const ExerciceSchema = new mongoose.Schema({

    file: {
        type: String,
        trim: true,
        require: [true, 'file require']
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    Createur: {              // owner de l'exercice
        type: mongoose.Types.ObjectId,
        ref: "user",
        // required: true
    },
    CoursExercice: {
        type: mongoose.Types.ObjectId,
         ref: "video"
    } //formation surlaquelle on fait exercice

}, { timestamps: true })
const Exercice = mongoose.model('Exercice', ExerciceSchema);
module.exports = Exercice;

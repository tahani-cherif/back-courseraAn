const mongoose = require('mongoose');
const VideoId = require('./video');
const User = require('../models/user');
const { boolean } = require('joi');
// const { number } = require('joi'); //Joi est une bibliothèque JavaScript de validation de schémas de données qui peut être utilisée pour valider des objets JavaScript et garantir qu'ils correspondent à un certain format ou schéma de données. 
const CourseSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true  //supprimer espace au debut et a la fin
    },
    bioFormateur: {
        type: String,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rating_Count: {
        type: String,
    },
    rating_Star: {
        type: Number,
    },
    categorie: { // ici est ce que on fait un modèle contient les catégorie 
        type: String,
        required: true,
        enum: []
    },
    createur: { //formateur
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        //required: true
    },
    actual_Price: {
        type: String,
    },
    discount_Price: {
        type: String,
    },
    ce_que_vous_apprenez: {
        type: String,
    },
    VideoId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],

    CoursesUrl: {
        type: String,
    },
    pdfId: {
        type: mongoose.Types.ObjectId,
        ref: "Exercice",
    },
    quizId: {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
    },
    image: {
        type: String
    },
    free: {
        type: Boolean
    },
    prix:{
        type:Number //doit etre de type float
    }
}, { timestamps: true })

const Courses = mongoose.model('Courses', CourseSchema);
module.exports = Courses;
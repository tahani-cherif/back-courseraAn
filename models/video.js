const mongoose = require('mongoose');
const User = require('./user');
const Quiz = require('./quiz');
const { required } = require('joi');
const Courses = require('./courses');
const VideosSchema = new mongoose.Schema({
    type: { //develeppement / AI / ML
        type: String,
        
    },
    titre: {
        type: String,
        required: true

    },
    dure: {
        type: String,
        required: true

    },
    ordre: { //l'ordre de video
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    categorie: {
        type: String
    },
    VideoUrl:
    {
        type: String,
        required: true
    },
    coatch: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Commentaire"
    }],
    Course: {
        type: mongoose.Types.ObjectId,
        ref: "Courses"

    }

    // required part exercice
}, { timestamps: true }

)
const Video = mongoose.model('Video', VideosSchema);
module.exports = Video;
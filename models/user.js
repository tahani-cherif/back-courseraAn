//page reset mot de passe et forget mot de passe a faire
const mongoose = require('mongoose');
const passwordValidator = require("password-validator");
const Courses = require('./courses');
///::
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,

    },
    profileUrl: {
        type: String,
    },
    age: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,

    },
    VideoId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    role: {
        type: String,
        required: true,
        enum: ['admin', 'utilisateur', 'coatch'],
        default: 'utilisateur'
    },
    password: {
        type: String,
        required: true,
        trim: true,


    },
    phoneNumber: {
        type: Number
    },//Yup pour valider mot de passe
    picture: {
        type: String
    },
    bio: {
        type: String
    },
    image: {
        type: Buffer
    },

    Courses: [{
        type: mongoose.Types.ObjectId,
        ref: "Courses",
        //required: true
    }],
    Quiz: [{
       idquiz:{ type: mongoose.Types.ObjectId,
        ref: "Quiz",},
       note:{
        type:Number,
       }
    }],

    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},
    { timestamps: true }

)
const User = mongoose.model('User', UserSchema);
module.exports = User;
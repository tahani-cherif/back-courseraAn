const mongoose = require('mongoose');
const Courses=require('./courses')
const sessionSchema = new mongoose.Schema( { //session de formation est composé d'un ensemble de cour
    titre :{
        type: String,
        required:true
    },
    description :{
        type : String,
        required:true
    },
    date : {
        type: Date,
        default:Date.now(),
    },
    Courses:[{
        type: mongoose.Types.ObjectId,
        ref: "Courses",
        required:true
    }]

},   { timestamps: true })
const SessionDeFormation = mongoose.model('SessionDeFormation', sessionSchema);
module.exports=SessionDeFormation;
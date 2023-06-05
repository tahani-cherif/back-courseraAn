const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./user')
const Video = require('./video');
const CommentaireSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now,
      // required: true
    },
    commentBy: {              // owner du commentaire 
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "Video"
    } //video surlaquelle on fait commentaire : id mta3ha 


}, { timestamps: true })
const Commentaire = mongoose.model('Commentaire', CommentaireSchema);
module.exports = Commentaire; 
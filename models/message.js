const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idRomm: {
        type: String
    },
    message: {
        type: String,
      //  required: true,
    },
    listeMessages:[ 
       { message: {
            type: String,
          //  required: true,
        },
        date: {
            type: String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
           // required: true,
        }}]
    ,
    iv: { //an initialization vector 
        type: String,
    //    required: true,
    },
    key: { // The iv and key are used for encryption and decryption of the message
        type: String,
    //    required: true,
    },
}, { timestamps: true });

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
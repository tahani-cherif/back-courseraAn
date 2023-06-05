const mongoose = require('mongoose');

const chatsSchema=new mongoose.Schema({

})
const Chats = mongoose.model('Chats', chatsSchema);
module.exports = Chats;
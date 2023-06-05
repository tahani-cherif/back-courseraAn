const Message = require("../models/message");
const User = require("../models/user");
const crypto = require("crypto");

const encrypt = (message) => {
    // key to encrypt and decrypted  (random 32 Bytes)
    const key = crypto.randomBytes(32);
    //iv - initialization vector (random 16 Bytes)
    const iv = crypto.randomBytes(16);
    // cipher function to encrypt the message
    // aes-256-cbc algorithm to encrypt and decrypt the data.
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encryptedMessage = cipher.update(message);
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
    return {
        iv: iv.toString("hex"),
        encryptedMessage: encryptedMessage.toString("hex"),
        key: key.toString("hex"),
    };
};

const createMessage = async (req, res) => { //tab3eth msg fi conversation deja mawjouda
    const { senderId, receiverEmail, message, idRomm, listeMessages } = req.body

    let info = null;
    let isNewRecipient = false;
    const user = await User.findOne({ _id: senderId }).catch((err) => {
        // console.log(err);
    });
    if (user) {
        const receiver = await User.findOne({ email: receiverEmail });
        if (receiver) {
            if (!receiver.chats.includes(senderId)) { //c'est déja 7kaw m3a b3adhehom les user
                receiver.chats.push(senderId);
                await receiver.save();
            } isNewRecipient = true;

            const encryptedMessage = encrypt(message);
            const newMessage = new Message({
                sender: senderId,
                receiver: receiver._id,
                message: encryptedMessage.encryptedMessage,
                iv: encryptedMessage.iv,
                key: encryptedMessage.key,
                idRomm: idRomm,
                /* listeMessages: [{
                     message: encryptedMessage.encryptedMessage,
                     date: Date.now(),
                     sender: senderId
                 }]
                 */
            });
            await newMessage.save();
            info = {
                sender: {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    profileUrl: user.profileUrl,
                    username: user.username,
                },
                receiver: {
                    name: receiver.name,
                    _id: receiver._id,
                    email: receiver.email,
                    profileUrl: receiver.profileUrl,
                    username: receiver.username,
                },
                iv: newMessage.iv,
                key: newMessage.key,
                message: newMessage.message,
                createdAt: message.createdAt,
                messageId: newMessage._id,

            };
            //  console.log(newMessage.message)
        }
    }
    return res.status(200).json({
        success: true,
        Resultat: info,
        isNewRecipient: isNewRecipient
    });
};

const startMessage = async (req, res) => {//hadhi ya3ni start un nouvelle conversation , nlawej 3ala esm user w nab3ethlou
    const { sender, receiverEmail } = req.body

    const user = await User.findOne({ _id: sender });
    if (user) {
        const receiver = await User.findOne({ email: receiverEmail });
        if (receiver) {
            if (!user.chats.includes(sender) && user._id !== receiver._id) {
                user.chats.push(receiver._id);
                await user.save()
                    .then(() => {
                        return res.json(true);
                    })
                    .catch(() => {
                        return res.json({
                            success: false
                        });
                    });
            }
        } else {
            return res.json({
                message: "connot send message, two users similaire"
            });
        }
    } else {
        return res.json({
            message: "cannot found receiver"
        });
    }
    return res.json({
        message: "cannot found sender"
    });

}
    ;

const getMessages = (req, res) => { //hadha ya3ni reçevoir le msg
    const { userId, receiverId } = req.body;
    const user = User.findOne({ _id: userId })
    if (!user) {
        return res.json({ success: false, message: "user not exist" })
    }
    else {
        const receiver = User.findOne({ _id: receiverId })
        if (!receiver) {
            return res.status().json({ success: false, message: "receiver not exist" })
        }
    }
   
    Message.find({ sender: userId, receiver: receiverId })
        .then((messagesSentBySender) => {
            Message.find({ sender: receiverId, receiver: userId },
                (err, messagesSentByReceiver) => {
                    let conversation = messagesSentBySender.concat(messagesSentByReceiver);
                    conversation.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });
                    let result = [];
                    conversation.forEach((message) => {
                        let info;
                        if (String(message.sender) === String(userId)) {
                            info = {
                                sender: {
                                    name: user.name,
                                    email: user.email,
                                    _id: user._id,
                                },
                                receiver: {
                                    name: receiver.name,
                                    email: receiver.email,
                                    _id: receiver._id,
                                },
                                iv: message.iv,
                                key: message.key,
                                message: message.message,
                                createdAt: message.createdAt,
                                messageId: message._id,
                            };
                        } else {
                            info = {
                                receiver: {
                                    name: user.name,
                                    email: user.email,
                                    _id: user._id,
                                },
                                sender: {
                                    name: receiver.name,
                                    email: receiver.email,
                                    _id: receiver._id,
                                },
                                iv: message.iv,
                                key: message.key,
                                createdAt: message.createdAt,
                                message: message.message,
                                messageId: message._id,
                            };
                        }
                        result.push(info);
                    });
                    return res.json({ success: true, messages: result });
                }
            );
        }) .catch((err) => {
            // console.log(err);
            return res.json({ success: false, message: err.message });
        });
}   




const deleteMessageById = (req, res) => {
    const { messageId } = req.params;
    Message.findByIdAndDelete(messageId)
        .then(() => {
            return res.json({
                success: true,
                message: "message deleted",
                messageId: messageId,
            });
        })
        .catch((err) => {
            // console.log(err);
            return res.json({ success: false, message: err.message });
        });
};

const deleteMessages = (senderId, receiverId) => {
    Message.deleteMany({ sender: senderId, receiver: receiverId })
        .then(() => {
            Message.deleteMany({
                receiver: senderId,
                sender: receiverId,
            })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    // console.log(err);
                    return false;
                });
        })
        .catch((err) => {
            // console.log(err);
            return false;
        });
};

const deleteChatByRecipientId = async (req, res) => {
    const { senderId, recipientId } = req.body;

    const user = await User.findOne({ _id: senderId }).catch((err) => {
        return res.json({ success: false, message: err.message });
    });
    deleteMessages(senderId, recipientId);
    if (user) {
        const index = user.chats.indexOf(recipientId);
        // console.log(user.chats);
        user.chats.splice(index, 1);
        // console.log(user.chats);
        await user.save();
        return res.json({ success: true, recipientId: recipientId });
    }
    return res.json({ success: false, message: "something is wrong" });
};


const  getMesg=async(req,res)=>{
    
    const body = req.body;
    //   console.log(body);
        // {sender:body.sender,receiver:body.receiver}
    const message = await Message.find({sender:body.sender,receiver:body.receiver})
    const message2 = await Message.find({sender:body.receiver,receiver:body.sender})
    // console.log("xxxx",message)
    // console.log("xxxxww",message2)
    if(message.length > 0)
     {
        res.status(200).send({etat:true,message:message});
     } else if(message2.length > 0){
        res.status(200).send({etat:true,message:message2});
       
     }else{
        res.status(404).send({etat:false,message:"aucune converssation "});
     }
}
const  createmesg=async(req,res)=>{
    
    const body = req.body;
    const message = await Message.create(body)
    const receiver = await User.findOne({_id:body.sender})
    await User.findByIdAndUpdate(body.sender,{chats:[...receiver.chats,body.receiver]})
     const sender = await User.findOne({_id:body.receiver})
     await User.findByIdAndUpdate(body.receiver,{chats:[...sender.chats,body.sender]})
    res.status(200).send({message:message});
}
const  update=async(req,res)=>{
    const id=req.params.id
    const message = await Message.find({idRomm:id})
    message[0].listeMessages=req.body
    console.log(req.body)
   const x= await Message.findOneAndUpdate({idRomm:id}, {listeMessages:req.body}).catch(err=>{console.log(err)})
    res.status(200).send({message:x});
}
const getusers = async(req, res) => {
    const body=req.body;
      let tab=[]
      body.chats.map(async(item)=>
        {  
            const receiver =await User.find({_id:item})
            // console.log(receiver)
            if(receiver)
            {
                tab.push(receiver[0])
            }
        }
        )
        setTimeout(() => {
            res.status(200).json(tab);
          }, 1000)
        
}
module.exports = {
    getMessages,
    createMessage,
    deleteMessageById,
    startMessage,
    deleteChatByRecipientId,
    getMesg,
    createmesg,
    update,
    getusers
};
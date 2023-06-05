const express = require("express");
const router = express.Router();
const authenticate=require('../middellware/authentification')
const isOwner=require('../middellware/isOwner')
const {
    deleteMessageById,
    deleteChatByRecipientId,
    getMessages,
    createMessage,
    startMessage,
    getMesg,
    createmesg,
    update,
    getusers
} = require("../controlleur/message");

router.route("/delete-chat",authenticate,isOwner).post(deleteChatByRecipientId);
router.route("/deletemessage/:messageId",authenticate,isOwner).delete(deleteMessageById);
router.route("/getMessages",authenticate).post(getMessages);
//router.route("/createMessage",authenticate).post(createMessage);
router.route("/createMessage",authenticate).post(createmesg);
router.route("/startMessage",authenticate).post(createmesg)
router.route("/getmsgbyconversation",authenticate).post(getMesg)
router.route("/updatemessga/:id",authenticate).put(update)
router.route("/getusers",authenticate).post(getusers)
module.exports = router;
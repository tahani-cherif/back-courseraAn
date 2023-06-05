const express = require('express');
const authenticate = require('../middellware/authentification')
const isOwner = require('../middellware/isOwner')
const router = express.Router()
const {
    CommentPost,
    deleteComment,
    updateComment,
    getcommenatireByvideo,modifcomment } = require("../controlleur/Commentaire")

router.route("/CommentPost", authenticate).post(CommentPost);
router.route("/deleteComment/:CommentId", authenticate, isOwner).delete(deleteComment);
router.route("/updateComment/:CommentId", authenticate, isOwner).put(modifcomment);
router.route("/getcommentbyvideo/:id", authenticate, isOwner).get(getcommenatireByvideo);

module.exports = router;
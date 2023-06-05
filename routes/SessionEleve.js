const express = require('express')
const router = express.Router();
const authenticate=require('../middellware/authentification')
const isOwner=require('../middellware/isOwner')
const {
    getALLSessionEleves,
    createsessionEleve,
    getsessionEleveById,
    updatesessionEleve,
    deletesessionEleve,
} = require("../controlleur/EleveSession");


//page kbira todhehr faha not found

router.route("/createsessionEleve",authenticate).post(createsessionEleve);
router.route("/getsessionEleves",authenticate).get(getALLSessionEleves)  //this for admin
router.route("/getsessionEleve/:id",authenticate).get( getsessionEleveById)
router.route("/updatesessionEleve/:id",authenticate,isOwner).put(updatesessionEleve)
router.route("/deletesessionEleve/:id",authenticate,isOwner).delete(deletesessionEleve);

module.exports = router;

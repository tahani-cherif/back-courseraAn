const express = require('express')
const router = express.Router()  
const UserController = require("../controlleur/user"); 
const authenticate=require('../middellware/authentification')
const isOwner=require('../middellware/isOwner')
const {upload} =require('../middellware/multerMiddellware');

router.post('/CreateAcount',upload('./image').single('picture'), UserController.signup); 
router.post('/login', UserController.login); 
router.put('/UpdateProfil/:userId',authenticate,upload('./image').single('picture'),UserController.updateProfile);
router.get('/getUsers',authenticate, UserController.getUsers);
router.get('/getSingleUserInfo/:userId', authenticate,UserController.getSingleUserInfo);
router.get('/searchUser',authenticate, UserController.searchUser);
router.get('/getUserById/:userId',authenticate,UserController.getUserById) 
router.get('/countuser',UserController.countuser) 
router.post('/passwordrecovery',UserController.sendEmail);
router.post('/updatepassword',UserController.updatedpassword);
module.exports = router;




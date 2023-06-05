const express = require('express')
const isCoatch = require('../middellware/isCoatch')
const isOwner = require('../middellware/isOwner')
const authenticate = require("../middellware/authentification")
const { upload } = require('../middellware/multerMiddellware')
const router = express.Router()
const {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getAllVideos,
    getVideosByCours,
    getAllVideoByCrateur
} = require("../controlleur/Videos")


//create a video
// router.post("/createVideo/:courseId",upload('./video').single('VideoUrl'),authenticate,isCoatch,addVideo )
router.post("/createVideo/:courseId", upload('./video').single('VideoUrl'), authenticate, addVideo)
router.put("/updateVideo/:id", upload('./video').single('VideoUrl'), authenticate, updateVideo)
router.delete("/deleteVideo/:id", authenticate, deleteVideo)
router.get("/findVideo/:id", authenticate, getVideoById)
router.get("/getAllVideos", authenticate, getAllVideos)
router.get("/getVideosByCours/:idCours", authenticate, getVideosByCours)
router.get("/getAllVideoByCrateur/:idCoach", authenticate, getAllVideoByCrateur)

module.exports = router;
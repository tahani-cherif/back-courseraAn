const express = require('express');
const isCoatch = require('../middellware/isCoatch');
const authenticate = require('../middellware/authentification')
const isOwner = require('../middellware/isOwner')
const router = express.Router()
const { upload } = require('../middellware/multerMiddellware')
const { count } = require('../models/question');
const {
        searchById,
        fetchCoatchCourses,
        likeComment,
        unlikeComment,
        getAllCourses,
        updateCours,
        CreateCourse,
        deleteCours,
        getAllCoursesuser,
        getAllCoursesuserquiz,
        getAllCoursByCreateur,
        countcour,
        countcourfree,
        countcourbycoatch,
        getcourssearchbyname,
        getAllCoursByorder
} = require("../controlleur/courses");

router.post("/CreateCourse", authenticate, upload('./image').single('image'),CreateCourse);
router.delete("/deleteCours/:CoursId",authenticate,deleteCours)
router.route("/searchById/:CoursId", authenticate).get(searchById);
router.route("/getAllCourses", authenticate).get(getAllCourses);
router.put("/updateCours/:CoursId", authenticate, upload('./image').single('image'),updateCours);
router.route("/likeComment", authenticate).post(likeComment);
router.route("/unlikeComment", authenticate).post(unlikeComment);
router.route("/listecouruser/:id").get(getAllCoursesuser);
router.route("/listequizuser/:id").get(getAllCoursesuserquiz);
router.route("/getAllCoursByCreateur/:userId").get(getAllCoursByCreateur)
router.route("/countcour").get(countcour)
router.route("/countfree").get(countcourfree)
router.route("/countcourformateur").get(countcourbycoatch)
router.route("/getcoursearch").get(getcourssearchbyname)
router.route("/getcourbyorder").post(getAllCoursByorder)

module.exports = router;
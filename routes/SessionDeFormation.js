//to fix this router
const express = require('express');
const router = express.Router();
const { 
    CreateSession,
    updateSession,
    deleteSession,
    getAllSession,
    addNewCourse,
    //updatCoursesCoach
} = require("../controlleur/session.de.formation");

router.route("/CreateSession").post(CreateSession)
router.route("/updateSession/:sessionId").put(updateSession);
router.route("/deleteSession/:sessionId").delete(deleteSession);
router.route("/getAllSession").get(getAllSession);
//router.route("/addNewCourse/:sessionId").post(addNewCourse);
module.exports = router;
const express = require('express');
const router = express.Router();
const authenticate = require('../middellware/authentification')
const isCoatch = require('../middellware/isCoatch')
const isOwner = require('../middellware/isOwner')

const {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllquiz,
    addQuestion,
    getAllquestion,
    getQuestionByID,
    deleteQuestions,
    deleteQuestionById,
    updateQuestionByID,
    getquizzbyId,
    Score,
    getAllQuizbyCreateur,
    createQuestion } = require('../controlleur/quiz')

router.route("/createQuiz",authenticate,isCoatch).post(createQuiz);
// /router.route("/CreateQuestion", authenticate, isCoatch).post(addQuestion);
router.route("/CreateQuestion", authenticate, isCoatch).post(createQuestion);
router.route("/getAllquestion/:quizId", authenticate, isOwner).get(getAllquestion);
router.route("/deleteQuestionById/:id", authenticate, isCoatch, isOwner).delete(deleteQuestionById)
router.route("/getquizzbyid/:id", authenticate, isCoatch, isOwner).get(getquizzbyId)
router.route("/getQuestionByID/:id", authenticate).get(getQuestionByID)
router.route("/deleteQuestions/:quizId", authenticate, isCoatch, isOwner).delete(deleteQuestions);
router.route("/updateQuestionByID/:id", authenticate, isCoatch, isOwner).put(updateQuestionByID)
router.route("/updatequiz/:quizId", authenticate, isCoatch, isOwner).put(updateQuiz);
// router.route("/updatequiz/quizId").put(updateQuiz);
router.route("/deleteQuiz/:quizId", authenticate, isCoatch, isOwner).delete(deleteQuiz)
router.route("/getAllquiz", authenticate).get(getAllquiz)
router.route("/createScore",authenticate).post(Score)
router.route('/getAllQuizbyCreateur/:idCoach',authenticate).get(getAllQuizbyCreateur)


module.exports = router
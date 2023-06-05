const express = require('express');
const Quiz = require('../models/quiz')
const User = require("../models/user")
const Question = require('../models/question');
const { ScoreModel, validate } = require("../models/score");

const createQuiz = async (req, res) => { //tested
    const quiz = new Quiz(req.body);
    try {
        const savedQuiz = await quiz.save();
        return res.status(200).json(savedQuiz);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateQuiz = async (req, res) => {
    try {
        const ID = req.params.quizId
        const NewQuiz = req.body
        // console.log(NewQuiz);
        const quizUpdated = await Quiz.findByIdAndUpdate({ _id: ID }, NewQuiz);
        if (!quizUpdated) {
            res.status(401).send("quiz not found or not updated")
        }
        // console.log(quizUpdated);
        res.status(200).send(quizUpdated);
    } catch (erreur) {
        res.status(401).json({
            success: false,
            message: "Failed to Update quiz",
            errorMessage: erreur.message,
        });
    }

};
const deleteQuiz = async (req, res) => {
    try {
        const Id = req.params.quizId
        await Quiz.findByIdAndDelete({ _id: Id })
        return res
            .status(200)
            .json({ success: true, message: "Quiz deleted", Id: Id });
    }
    catch (erreur) {
        res.status(401).json({
            success: false,
            message: "Failed to delete quiz",
            errorMessage: erreur.message,
        });

    }


};

const getAllquiz = async (req, res) => {
    try {
        const quizs = await Quiz.find();
        return res.status(200).json(quizs);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getquiz = async (req, res) => { //fnct traja3li quiz mta3 coatch ani n7b 3lih
    const ID = req.params.userId // fct n3adilha userId en paramètre
    // console.log('here:', ID)
    Quiz.find({ coatch: req.userId, upload: true }, (err, qz) => { //upload:true ya3ni coatch upload quiz dans plateforme
        if (err) {
            // console.log(error);
            res.json({ msg: "some error!" });
        }
        else {
            res.json({ quiz: qz });
        }
    })
};

const addQuestion = async (req, res) => {//tested 
    const { QuizId, CoachId, questionText, Options, correctAnswer ,answerOptions} = req.body //ansewerOption mahouch ya9rali faha
    try {
        const coatch = await User.findById(CoachId);
        if (!coatch) {
            // console.log(coatch);
            return res.json({ success: false, massage: "coach not found" });
        }
        const quiz = await Quiz.findById(QuizId);
        if (!quiz) {
            return res.json({ success: false, massage: "quiz not found" });
        }
        let NewQuestion = new Question( req.body)
        quiz.question.push(NewQuestion._id)
        // console.log(quiz)
       // quiz.question=[...quiz.question,NewQuestion._id]
        NewQuestion = await NewQuestion.save();
      await Quiz.findByIdAndUpdate({ _id: QuizId },quiz, { new: true }) .then(secc=>console.log(secc));
        return res.status(200).json({
            success: true,
            message: "question added",
            NewQuestion: {
                ...NewQuestion._doc,
                questionText: NewQuestion.questionText,
                CoachId: NewQuestion.CoachId,
                answerOptions: NewQuestion.Options,
                correctAnswer: NewQuestion.correctAnswer
            },
        });
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const createQuestion=async(req,res)=>{
     const question =await Question.insertMany(req.body)
     let id=[]
     question.map(item=>{
        id.push(item._id)
     })
     await Quiz.findByIdAndUpdate({ _id: question[0].QuizId },{question:id}, { new: true }) .then(secc=>console.log(secc));

     res.status(200).send(question);
}
const getAllquestion = async (req, res) => { //get question by quiz : tested
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.json({
                success: false,
                message: "Invalid Id, quiz not found",
            });
        }

        const questions = await Question.find({ _id: { $in: quiz.question } }); //$in:L'opérateur sélectionne les documents où la valeur d'un champ(_id) est égale à n'importe quelle valeur dans le tableau spécifié (quiz.question).
        const nbrQuestion = await Question.find({ _id: { $in: quiz.question } }).count();
        return res.status(200).json({ success: true, nbrQuestion, questions: questions });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getQuestionByID = async (req, res) => { //tested
    try {
        const questionId = req.params.id; //id question
        const question = await Question.findById(questionId);
        if (!question) {
            return res.json({
                success: false,
                message: "Invalid Id, question not found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "question trouvé",
                question: question,
            })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const deleteQuestionById = async (req, res) => { //tested
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.json({
                success: false,
                message: "Invalid Id, question not found",
            });
        }
        const quiz = await Quiz.findById(question.QuizId)
        if (!quiz) {
            return res.json({
                success: false,
                message: "Invalid Id, quiz not found",
            });
        }
        await Question.findByIdAndDelete(question._id);
        const index = quiz.question.indexOf(questionId) //indexOf():renvoie le premier indice pour lequel on trouve un élément donné dans un tableau. Si l'élément cherché n'est pas présent dans le tableau, la méthode renverra -1
        //quiz.question.splice(index, 1) //splice:modifie le contenu d'un tableau en retirant des éléments et/ou en ajoutant de nouveaux éléments à même le tableau.On peut ainsi vider ou remplacer une partie d'un tableau.
        await quiz.save();
        return res.status(200).json({
            success: true,
            message: "question deleted",
            questionId: questionId,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

};
const deleteQuestions = async (req, res) => {//delete all question qui appartient a un quiz précis
    try {                                   // not tested
        const id = req.params.quizId//
        const quiz = await Quiz.findById(id)
        if (!quiz) {
            return res.json({
                success: false,
                message: "Invalid Id, quiz not found",
            });
        }
        // console.log(quiz.question);
        await Quiz.findByIdAndDelete({ _id: { $in: quiz.question } });
        //const index = quiz.question.indexOf(quiz.question) //indexOf():renvoie le premier indice pour lequel on trouve un élément donné dans un tableau. Si l'élément cherché n'est pas présent dans le tableau, la méthode renverra -1
        //quiz.question.splice(index, 1) //splice:modifie le contenu d'un tableau en retirant des éléments et/ou en ajoutant de nouveaux éléments à même le tableau.On peut ainsi vider ou remplacer une partie d'un tableau.
        await quiz.save();
        return res.status(200).json({
            success: true,
            message: "question deleted",
            questionId: quiz.question,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }


};
const updateQuestionByID = async (req, res) => {//tested
    try {
        const id = req.params.id
        const NewQuestion = req.body
        const question = await Question.findById(id);
        if (!question) {
            return res.status(200).json({
                success: false,
                message: "Invalid Id, question not found",
            });
        }
        else {
            Question.updateOne({ _id: id }, { $set: req.body }) //set nouveau contenu
            res.status(200).json({
                message: 'Question Updated',
                question: NewQuestion
            });
        }


    } catch (erreur) {
        return res.status(500).json({ success: false, message: erreur.message });
    }
};


const Score = async (req, res) => {  // not tested
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let score = await ScoreModel.find({
        studentId: req.body.studentId,
        courseId: req.body.courseId,
        QuestionId: req.body.examQuestionId,
    });
    if (score)
        return res.status(400).send("Question already answered by student");

    score = new ScoreModel(
        _.pick(req.body, [
            "studentId",
            "courseId",
            "QuestionId",
            "score",
        ])
    );
    await score.save();

    res.send(score);
};

const getquizzbyId=async(req,res)=>{ //ajouter

    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.json({
                success: false,
                message: "Invalid Id, quiz not found",
            });
        }
        return res.status(200).json(quiz)   
    }catch (err) {
      return res.status(500).json(err)
        }

}

const getAllQuizbyCreateur=async(req,res)=>{ //tested
    try {
        const IdCreateur = req.params.idCoach
        const Createur = await User.findById(IdCreateur)
        if (!Createur) {
            return res.status(404).json({
                success: false,
                message: "Createur not found with this id , try again"
            })
        }
        const quiz = await Quiz.find({ coatch: { $in: Createur._id } });
        return res.status(200).json({ success: true, quizs: quiz });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = {
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
    Score,
    getquizzbyId,
    createQuestion,
    getAllQuizbyCreateur
}
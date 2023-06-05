//routes houma ynadhmou l 5edma akther bach maykbrch code fi file serveur
const express = require('express');
const jwt = require("jsonwebtoken");
const Courses = require('../models/courses');
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const User = require('../models/user');

// fi uploadsVidéos najm nasna3 fi wosteha des fichiers jdod par exemple uploadsimagesUser (5assa bel user) w uploadsVidéo Videos(5assa bel Videos)
//uploadsVidéos contient les vidéos téléchargé 
//configuration pour appload vidéos
//bd dima nsajlou faha 7ajat numérique/booleene/texte/string/number


const CreateCourse = asyncHandler(async (req, res, next) => { //tested
    try {
        const coach = await User.findById(req.body.createur)
        // console.log(coach)
        if (!coach) {
            return res.status(400).json({
                success: false,
                message: "coach not found!",
            });
        }
        const body = req.body
        const savedCours = await Courses.create({
            titre: body.titre,
            description: body.description,
           createur: body.createur,
            free: body.free,
            bioFormateur: body.bioFormateur,
            categorie: body.categorie,
            ce_que_vous_apprenez:body.ce_que_vous_apprenez,
            prix:body.prix,
            image: req.file.path,
            rating_Count:body.rating_Count,
            rating_Star:body.rating_Star,
            actual_Price:body.actual_Price,
            discount_Price:body.discount_Price,
        })
        coach.Courses.push(savedCours._id)
        await coach.save()
        return res.status(201).json({ data: savedCours })
    } catch (err) {
        next(err);
    }

});
// methode de recherche sur une seul course: recherche by l'id  
const searchById = async (req, res) => {  //tested
    try {
        const CoursID = req.params.CoursId; //id Cours
        const Cours = await Courses.findById(CoursID).populate({
            path: 'createur',
            select: ['name', 'lastname', '_id'],
        });
        // console.log(CoursID)
        if (!Cours) {
            return res.json.status(404)({
                success: false,
                message: "Invalid Id, course not found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "cours trouvé",
                Courses: Cours,
            })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCourses = async (req, res) => { //tested
    try {
        const courses = await Courses.find().populate({
            path: 'createur',
            select: ['name', 'lastname','_id'],
          });;
        return res.status(200).json(courses);
    } catch (err) {
        return res.status(500).json(err);
    }
};
const getcourssearchbyname = async (req, res) => { //tested
    try {
        const search = req.query.search
        const courses = await Courses.find({ titre: new RegExp(search, 'i') }).populate({
            path: 'createur',
            select: ['name', 'lastname','_id'],
          });;
        return res.status(200).json(courses);
    } catch (err) {
        return res.status(500).json(err);
    }
};
const deleteCours = asyncHandler(async (req, res, next) => { //tested
    const id = req.params.CoursId;
    const cours = await Courses.findByIdAndDelete(id);
    if (!cours) {
        return next(new AppError(`cours not found for this id ${id}`, 404));
    }
    return res.status(204).json({
        message: "cours deleted"
    });
})

//next ta5ou resultat mta3 etape 9balha w t3adaHa etape suivant
const updateCours = asyncHandler(async (req, res, next) => { //en cours
    try {
        const Cours = await Courses.findById(req.params.CoursId);
        if (!Cours) {
            return res.json({
                success: false,
                message: "Invalid Id, course not found",
            });
        }
        req.body.image=req?.file?.path || req.body.image
        const cours = await Courses.findByIdAndUpdate(
            req.params.CoursId,
            {
                $set: req.body
            },
            { new: true }
        )
        if (!cours) {
            return next(new AppError(`cours not updated for this id `, 404));
        }
        res.status(200).json({ data: cours });
    } catch (err) {
        next(err);
    }
})

// CRUD commentaire:  
//ajouter commentaire 

const likeComment = async (req, res) => {
    const { userId, CommentId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, massage: "User not found" });
        }
        const Comment = await Comments.findById(CommentId);
        if (!Comment) {
            return res.json({ success: false, massage: "commentaire not found" });
        }
        await newNotification(Comment.commentBy, user._id, "LIKED", CommentId);
        Comment.likes.push(user._id);
        await Comment.save();
        return res.status(200).json({
            success: true,
            message: "Commentaire liked",
            CommentId: Comment._id,
            likedBy: { _id: user._id, name: user.name, username: user.username },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const unlikeComment = async (req, res) => {
    const { userId, commentId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, massage: "User not found" });
        }
        const comment = await Videos.findById(commentId);
        if (!comment) {
            return res.json({ success: false, massage: "commentaire not found" });
        }
        const index = comment.likes.indexOf(user._id);
        comment.likes.splice(index, 1);
        await comment.save();
        return res.status(200).json({
            success: true,
            message: "commentaire disliked",
            unlikeBy: user._id,
            commentId: comment._id,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const fetchCoatchCourses = async (req, res) => { // fct qui importe tous les cours d'un coatch précis
    try {
        const userId = req.body;
        const user = await Uploader.findById(userId);
        const courses = await Courses.find({ author: user._id });
        let CoatchCourses = [];
        for (const cours of courses) {
            CoatchCourses.push({
                ...cours._doc,
                authorName: user.name,
                authorUsername: user.username,
                authorProfileUrl: user.profileUrl,
            });
        }
        return res.json({ success: true, courses: CoatchCourses });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getAllCoursesuser = async (req, res) => { //tested
    const id = req.params.id;
    const cour = []
    let test = false
    try {

        const user = await User.findOne({ _id: id });
        user.Courses.forEach(async (item) => {
            const courses = await Courses.find({ _id: item });
            cour.push(courses[0])
        })
        setTimeout(() => {
            res.status(200).json(cour);
        }, 1000)

    } catch (err) {
        return res.status(500).json(err);
    }
};
const getAllCoursesuserquiz = async (req, res) => { //tested
    const id = req.params.id;
    const cour = []
    let test = false
    try {

        const user = await User.findOne({ _id: id });
        user.Quiz.forEach(async (item) => {
            const courses = await Courses.find({ quizId: item.idquiz });
            // console.log(courses)
            cour.push({ note: item?.note, titre: courses[0]?.titre, description: courses[0]?.description })
        })
        setTimeout(() => {
            res.status(200).json(cour);
        }, 1000)

    } catch (err) {
        return res.status(500).json(err);
    }
};

const getAllCoursByCreateur = async (req, res) => { //tested
    try {
        const IdCreateur = req.params.userId
        const Createur = await User.findById(IdCreateur)
        if (!Createur) {
            return res.status(404).json({
                success: false,
                message: "Createur not found with this id , try again"
            })
        }
        const courses = await Courses.find({ createur: Createur._id });
        return res.status(200).json({ success: true, courses: courses });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

};
const countcour=async(req,res)=>{

    const count=await Courses.count();
    console.log(count);
    return res.status(200).json({ success: true, message:count})
}

const countcourfree=async(req,res)=>{
    const countcourfree=await Courses.find({ free: true }).count();
    console.log(countcourfree)
    const countcournotfree=await Courses.find().count()-countcourfree;
    res.status(200).send({ success: true, courfree:countcourfree,cournotfree:countcournotfree})
}
const countcourbycoatch=async(req,res)=>{
  const  countcourbycoatch=await Courses.find();
  const  countcourbycoatch2=await Courses.aggregate([
    {"$group" : {_id:"$createur", count:{$sum:1}}},
     ])
countcourbycoatch2.map(async(item,index)=>{

    const user=await User.findById(item._id);
    console.log(user)
    countcourbycoatch2[index]={...countcourbycoatch2[index],name:user?.name,lastname:user?.lastname}
})
setTimeout(() => {
    res.status(200).send({ success: true,count:countcourbycoatch2})
  }, 1000)
 
}
const getAllCoursByorder = async (req, res) => { //tested
    try {
        const courses = await Courses.find({ _id: { "$in" : req.body.Cours} });
        return res.status(200).json({ success: true, courses: courses });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

};
module.exports = {
    searchById,
    getAllCourses,
    deleteCours,
    updateCours,
    likeComment,
    unlikeComment,
    fetchCoatchCourses,
    CreateCourse,
    getAllCoursesuser,
    getAllCoursesuserquiz,
    getAllCoursByCreateur,
    countcour,
    countcourfree,
    countcourbycoatch,
    getcourssearchbyname,
    getAllCoursByorder
}
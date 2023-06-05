const User = require("../models/user.js");
const Video = require("../models/video.js");
const Courses = require("../models/courses.js")
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')

const addVideo = async (req, res, next) => { //tested
    try {
        req.body.VideoUrl=req.file.path
        const CourseId = req.params.courseId
        const Course = await Courses.findById(CourseId)
        if (!Course) {
            return res.status(400).json({
                success: false,
                message: "cours not found!",
            });
        }
        const coach = await User.findById(req.body.coatch)
        // console.log(coach)
        if (!coach) {
            return res.status(400).json({
                success: false,
                message: "coach not found!",
            });
        }
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        coach.VideoId.push(newVideo._id)
        await coach.save()
        Course.VideoId.push(newVideo._id);
        await Course.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
};
const updateVideo = asyncHandler(async (req, res, next) => { //tested
    try {
        const video = await Video.findById(req.params.id); //id video
        if (!video) {
            return res.json({
                success: false,
                message: "Invalid Id, video not found",
            });
        }
        req.body.VideoUrl=req?.file?.path || req.body.VideoUrl
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedVideo);
        //Courses.updateOne({ VideoId: req.params.id }, { $set: { VideoId: updateVideo._id } })//update Course/video

        /*  const courses = await Courses.find({ VideoId: req.params.id });
          courses.forEach(async (course) => {
              await Courses.findByIdAndUpdate(course._id, {
                  $set: { "VideoId.$": updatedVideo._id },
              });
              c = Courses.findOne({ _id: updatedVideo._id })
              console.log(c)
              Courses.save()
          });
          const users = await User.find({ VideoId: req.params.id });
          users.forEach(async (user) => {
              await User.findByIdAndUpdate(user._id, {
                  $set: { "VideoId.$": updatedVideo._id },
              });
              User.save()
          });
  */

    } catch (err) {
        next(err);
    }
});

const deleteVideo = async(req, res) => { //tested
    const ID = req.params.id;
    try {
        const vd = await Video.findById(ID);
        if (!vd) {
            return res.json({ success: false, massage: "video not found" });
        }
        const cours = await Courses.findOne(vd.Course);
        if (!cours) {
            return res.json({ success: false, massage: "cours not found for this video" });
        }
        const coach=await User.findOne(vd.coatch)
        if(!coach){
            return res.json({ success: false, massage: "coach not found for this video" })
        }
        await Video.findByIdAndDelete(vd._id);
        const index = cours.VideoId.indexOf(ID); //indice mtaa3 id vd
        cours.VideoId.splice(index, 1); //remove id ml table 
        await cours.save();
        const index2=coach.VideoId.indexOf(ID); //indice mta3 id video fi table coach
        coach.VideoId.splice(index2, 1); //remove id from table
        await coach.save()
        return res.status(200).json({
            success: true,
            message: "video deleted",
            vdId: ID,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getVideoById = async (req, res, next) => { //tested
    try {
        const video = await Video.findById(req.params.id).populate({
            path: 'coatch',
            select: ['name', 'lastname','_id'],
          });
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
};

//getAllVideos

const getAllVideos = async (req, res,) => {  //tested
    try {
        const videos = await Video.find().populate({
            path: 'coatch',
            select: ['name', 'lastname','_id'],
          });
        return res.status(200).json(videos);
    } catch (err) {
        return res.status(500).json(err);
    }
};
//get all videos By Course Id 

const getVideosByCours = async (req, res) => {
    try {
        const IdCours = req.params.idCours
        const Course = await Courses.findById(IdCours)
        if (!Course) {
            return res.status(404).json({
                success: false,
                message: "course not found with this id , try again"
            })
        }
        const videos = await Video.find({ _id: { $in: Course.VideoId } }).populate({
            path: 'coatch',
            select: ['name', 'lastname','_id'],
          });
        return res.status(200).json({ success: true, videos: videos });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

//get video by id by cours id     
}

const getAllVideoByCrateur = async (req, res) => { //tested
    try {
        const IdCreateur = req.params.idCoach
        const Createur = await User.findById(IdCreateur)
        if (!Createur) {
            return res.status(404).json({
                success: false,
                message: "Createur not found with this id , try again"
            })
        }
        const videos = await Video.find({ coatch:Createur._id});
        return res.status(200).json({ success: true, videos: videos });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

};
module.exports = {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getAllVideos,
    getVideosByCours,
    getAllVideoByCrateur
};












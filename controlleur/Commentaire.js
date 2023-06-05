const Video = require('../models/video');
const { newNotification } = require("./notification");
const User = require('../models/user');
const Commentaire = require('../models/commentaire');


const CommentPost = async (req, res) => {
    const { commentBy, postId, text } = req.body; // postid : id de la Videos elli mawjouda fi requète 
    try {
        const user = await User.findById(commentBy);
        if (!user) {
            return res.json({ success: false, massage: "User not found" });
        }
        const video = await Video.findById(postId);
        //console.log(video)

        if (!video) {
            return res.json({ success: false, massage: "video not found" });
        }
        let newComment = new Commentaire(req.body
            //createdDate:createdDate;
            )
            // console.log(video)
            newComment = await newComment.save();
        video.comments.push(newComment._id);
        video.save();
        //await video.save(); 
        await newNotification(video.coatch, user._id, "NEW_COMMENT", postId); // envoyer une notification au formateur bach n9olou raw fama chkoun 3mal commentaire 3al video mta3k 
        return res.status(200).json({
            success: true,
            message: "comment added",
            comment: {
                ...newComment._doc,
                commenterName: user.name,
                commenterUserLastename: user.lastname,
                commenterProfilUrl: user.picture,
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.CommentId; // id de commentaire elli katbou user
    try {
        const comment = await Commentaire.findById(commentId); // lena nlawej fi bd 3al id de commmentaire elli ktabtou 
        if (!comment) {
            return res.json({ success: failse, massage: " comment not found" });
        }
        const video = await Video.findById(comment.postId); // nlawej 3al video elli ktabet faha video
        if (!video) {
            return res.json({ success: false, massage: "video not found" });
        }
        await Commentaire.findByIdAndDelete(comment._id); // supprimer commentaire 
        const index = video.comments.indexOf(commentId); // La méthode indexOf() renvoie le premier indice pour lequel on trouve un élément donné dans un tableau  Si l'élément cherché n'est pas présent dans le tableau, la méthode renverra -1.
        // traja3li indice mta3 commentaire fare8
        video.comments.splice(index, 1);
        await video.save(); // enregistrer nouveau modification dans BD 
        return res.status(200).json({
            success: true,
            message: "comment deleted",
            commentId: commentId,
        });

    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const modifcomment=async(req,res)=>{
    const commentId = req.params.CommentId;
    try {
        const comment = await Commentaire.findById(commentId); // lena nlawej fi bd 3al id de commmentaire elli ktabtou 
    //   console.log(!comment);
        if (!comment) {
            return res.json({ success: false, massage: " comment not found" });
        } 
        await Commentaire.findByIdAndUpdate(comment._id,req.body)
        res.status(200).json(comment)
    } catch (error) {
            // console.log(error);
            return res.status(500).json({ success: false, message: error.message });
    
        }
}
// modifier commentaire 
const updateComment = async (req, res) => { // req: requète et res : resultat 
    const commentId = req.params.CommentId; // id de commentaire elli katbou user fi requète 
    try {
        const comment = await Commentaire.findById(commentId); // lena nlawej fi bd 3al id de commmentaire elli ktabtou 
    //   console.log(!comment);
        if (!comment) {
            return res.json({ success: false, massage: " comment not found" });
        }             
        const video = await Video.findById(comment.postId); // nlawej 3al video elli ktabet faha Videos
        if (!video) {                                                // comment VideosId : id de la Videos elli ktabet faha commentaire 
            return res.json({ success: false, massage: "Video not found" })
        }
        await Commentaire.findByIdAndUpdate(comment._id); // na3ml update lel commentaire qui a l'id "comment._id" men jemlit les commentaire lkol "Comments"
        let newComment = new Commentaire({
            text: Comment,
            commentBy: User._id,
            postId: video._id,
        });
        newComment = await newComment.save(); // création d'un nouveu commentaire et on le sauvegarde dans BD
        video.comments.push(newComment._id); // ajouter nouveau commentaire dans la poste de Videos
        await video.save(); // enregistrer Videos avec son commentaire dans BD 
        await newNotification(video.coatch, User._id, "NEW-COMMENT", postId); // envoyer une notification au formateur bach n9olou raw fama chkoun 3mal commentaire 3al Videos mta3k 
        return res.status(200).json({
            success: true,
            message: "comment added",
            comment: { // i Videos sur l'auteur de commentaire 
                ...newComment._doc,
                commenterName: User.name,
                commenterUserLastename: User.lastname,
                commenterProfilUrl: User.profileUrl,
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });

    }
};

const getcommenatireByvideo= async (req, res) => {
    try {
        const id = req.params.id
        const video = await Video.findById(id)
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "video not found with this id , try again"
            })
        }
        const comment = await Commentaire.find({ _id: { $in: video.comments } }).populate({
            path: 'commentBy',
            select: ['name', 'lastname',"picture",'_id'],
          });
        return res.status(200).json({ success: true,  comment: comment });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    CommentPost,
    deleteComment,
    updateComment,
    getcommenatireByvideo,
    modifcomment
}

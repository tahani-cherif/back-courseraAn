const SessionDeFormation=require('../models/session.de.formation');
const Courses = require('../models/courses');


//creer session de formation 
const CreateSession = async (req, res) => { //tested
    const NewSession = req.body
    try {
        const savedSession = await NewSession.save();
        return res.status(200).json(savedSession);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
//update SEssion
const updateSession = async (req, res) => { //tested
    try {
        const ID = req.params.sessionId
        const NewSession= req.body
        // console.log(NewSession);
        const sessionUpdated = await SessionDeFormation.findByIdAndUpdate({ _id: ID }, NewSession);
        if (!sessionUpdated) {
            res.status(401).send("session not found or not updated")
        }
        // console.log(sessionUpdated);
        res.status(200).send(sessionUpdated);
    } catch (erreur) {
        res.status(401).json({
            success: false,
            message: "Failed to Update session",
            errorMessage: erreur.message,
        });
    }

};

const deleteSession = async (req, res) => { //tested
    try {
        const Id = req.params.sessionId
        await SessionDeFormation.findByIdAndDelete({ _id: Id })
        return res
            .status(200)
            .json({ success: true, message: "session deleted", Id: Id });
    }
    catch (erreur) {
        res.status(401).json({
            success: false,
            message: "Failed to delete session",
            errorMessage: erreur.message,
        });

    }


};

const getAllSession = async (req, res) => { //tested
    try {
        const sessions = await SessionDeFormation.find();
        return res.status(200).json(sessions);
    } catch (err) {
        return res.status(500).json(err);
    }
};

//ajouter new courses dans session de formation 

const addNewCourse=async(req,res)=>{
    const NewSession = req.body 
    try {
        const coatch = await User.findById(NewSession.CoachId);
        if (!coatch) {
            //console.log(coatch);
            return res.json({ success: false, massage: "coach not found" });
        }
        const session = await SessionDeFormation.findById(NewSession.sessionId);
        if (!session) {
            return res.json({ success: false, massage: "session not found" });
        }
        let NewCours = new Courses({
            coursTitle: NewSession.titre,
            CoachId: NewSession.CoachId,
            SessionId: NewSession.sessionId,
            description:NewSession.description,
            categorie:NewSession.categorie,

            
        })
        NewCours = await NewCours.save();
        SessionDeFormation.Courses.push(NewCours._id);
        await SessionDeFormation.save();
        return res.status(200).json({
            success: true,
            message: "Course added",
            NewCours: {
                ...NewCours._doc,
               coursTitle: NewCours.titre,
                CoachId: NewCours.CoachId,
                SessionId:NewCours.SessionId,
                description:NewCours.description,
                categorie:NewCours.categorie
            },
        });
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });

    }
};
//getCourses importe tous les cours

//update Courses

//delete courses



module.exports={
    CreateSession,
    updateSession,
    deleteSession,
    getAllSession,
    addNewCourse
}
const SessionElevemodel = require('../models/SessionEleve')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')

// Create a new sessionEleve
const createsessionEleve = asyncHandler(async (req, res) => { //tested
    const body = req.body
    const users = await User.findById(body.idEleve);
    if (!users) {
        return next(new AppError(`eleve not found for this id ${body.idEleve}`, 404));
    }
    const sessionEleves = await SessionElevemodel.create({
        idEleve: body.idEleve,
        name: users.name + " " + users.lastname,
        id_cour_terminer: body.id_cour_terminer,
        id_cour_commencer: body.id_cour_commencer,
        quizz_terminer: [{
            id_quizz: body.quizz_terminer[0],
            note: body.quizz_terminer[1]
        }]
    })
    res.status(201).json({ data: sessionEleves })

});

//getAll
//A discuter skipe et limite 
const getALLSessionEleves = asyncHandler(async (req, res) => {  //tested
    const sessionEleves = await SessionElevemodel.find().populate();
    return res.status(200).json({ results: sessionEleves.length, data: sessionEleves })
});



//getSessionByid eleve
const getsessionEleveById = asyncHandler(async (req, res, next) => {  //tested
    const { id } = req.params; //id user
    const sessionEleves = await SessionElevemodel.find({ idEleve: id }).populate();
    // console.log(sessionEleves, !sessionEleves || sessionEleves != [])
    if (!sessionEleves || sessionEleves == []) {
        return next(new AppError(`sessionEleve not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: sessionEleves });
})




//update sessionEleve

const updatesessionEleve = asyncHandler(async (req, res, next) => { //tested
    const { id } = req.params; //id session

    const sessionEleves = await SessionElevemodel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true })//return aprés update
    if (!sessionEleves) {
        return next(new AppError(`sessionEleveues not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: sessionEleves });
})


//delete  sessionEleve by id 

const deletesessionEleve = asyncHandler(async (req, res, next) => { //tested
    try {
        const idsession = req.params.id; //id Session

        const session = await SessionElevemodel.findById(idsession);
        //console.log(session)
        if (!session) {
            return res.status(404).json({ message: "sessionEleve not found for this id ${idsession}" });
        }
        await SessionElevemodel.findByIdAndDelete(idsession);
        return res.status(204).json({
            success: true, //message de succes mahouch 9a3ed ya9ra fih aprés delet 
            message: "sesseion deleted avec succés",
            sessionDeletedId: idsession
        });

    } catch (erreur) {
        return res.status(401).json({
            success: false,
            message: "Failed to delete session",
            errorMessage: erreur.message,
        });

    }
});

module.exports = {
    getALLSessionEleves,
    createsessionEleve,
    getsessionEleveById,
    updatesessionEleve,
    deletesessionEleve
}
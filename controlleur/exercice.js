const exercice = require('../models/exercice')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const User = require('../models/user');

//create exercice sous forme de pdf
exports.createExercice = asyncHandler(async (req, res) => { //tested
    const body = req.body
    const Exer = await exercice.create({
        Createur: body.Createur,
        /* CoursExercice: body.CoursExercice,*/
        file: req.file.path,
        description: req.body.description
    })
    res.status(201).json({ data: Exer })
});

//getAll exercice
exports.getAllExercice = asyncHandler(async (req, res) => {
    const pdfs = await exercice.find({}).populate()
    res.status(200).json({ results: pdfs.length, data: pdfs })
});

//get exercice by id
exports.getExerciceById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const exer = await exercice.findById(id);
    if (!exer) {
        return next(new AppError(`pdf not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: exer });
})

//update exercice by id

exports.updateExercice = asyncHandler(async (req, res, next) => { //en cours
    try {
        const exer = await exercice.findById(req.params.id);
        if (!exer) {
            return res.json({
                success: false,
                message: "Invalid Id, pdf not found",
            });
        }
            req.body.file=req?.file?.path || req.body.file
        const NewExer = await exercice.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )
        if (!NewExer) {
            return next(new AppError(`pdf not updated for this id `, 404));
        }
        res.status(200).json({ data: NewExer });
    } catch (err) {
        next(err);
    }
})


//delete exercice
exports.deleteExercice = asyncHandler(async (req, res, next) => { //tested
    const { id } = req.params;
    const pdf = await exercice.findByIdAndDelete(id);
    if (!pdf) {
        return next(new AppError(`pdf not found for this id ${id}`, 404));
    }
    return res.status(204).json({
        message: "pdf deleted"
    });
});
exports.getAllPDFbyCreateur = async (req, res) => { // tested
    try {
        const IdCreateur = req.params.idCoach
        // console.log(IdCreateur)
        const Createur = await User.findById(IdCreateur)
         console.log(Createur)
        if (!Createur) {
            return res.status(404).json({
                success: false,
                message: "Createur not found with this id , try again"
            })
        }
        const pdf = await exercice.find({ Createur: { $in: Createur._id } });
        return res.status(200).json({ success: true, pdfs: pdf });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

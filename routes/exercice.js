const express = require("express");
const router = express.Router();
const authenticate = require('../middellware/authentification')
const isOwner = require('../middellware/isOwner')
const isCoatch = require('../middellware/isCoatch')
const {upload} = require('../middellware/multerMiddellware')
const {
    createExercice,
    getAllExercice,
    getExerciceById,
    updateExercice,
    deleteExercice,
    getAllPDFbyCreateur
} = require('../controlleur/exercice')

router.post('/createExercice',authenticate,upload('./pdf').single('file'),createExercice);
router.get('/getAllExercice',authenticate,getAllExercice);
router.get('/getExerciceById/:id',authenticate,getExerciceById);
router.put('/updateExercice/:id',authenticate,upload('./pdf').single('file'),updateExercice);
router.delete('/deleteExercice/:id',authenticate,deleteExercice)
router.get('/getAllPDFbyCreateur/:idCoach',getAllPDFbyCreateur)
module.exports = router;
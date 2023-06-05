const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const appError = require('../utils/AppError');
const _ = require("lodash");
const { count } = require('../models/courses');
require("dotenv").config(); //exigez et configurez le package dotenv
const nodemailer = require("nodemailer");

// @desc    RÉCUPÉRATION DE MOT DE PASSE
// @route   GET /api/auth/passwordrecovery
// @access  Public
const sendEmail=(req,res,next)=> {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
      auth: {
        user: 'cheriftahani92@gmail.com',
        pass: 'mkoeocfobdrzqbnp',
      },
    });
    
   const mail_configs = {
        from:"cheriftahani92@gmail.com",
        to:req.body.email,
        subject: "RÉCUPÉRATION DE MOT DE PASSE",
        html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                  <meta charset="UTF-8">
                  <title>RÉCUPÉRATION DE MOT DE PASSE</title>
                  
                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                  <div style="margin:50px auto;width:70%;padding:20px 0">
                    <p style="font-size:1.1em">Bonjour,</p>
                    <p>Utilisez l'OTP suivant pour terminer votre procédure de récupération de mot de passe. OTP est valide pendant 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${req.body.OTP}</h2>
                    <hr style="border:none;border-top:1px solid #eee" />
                  </div>
                </div>
                <!-- partial -->
                  
                </body>
                </html>`,
        };
        transporter.sendMail(mail_configs, function (error, info) {
          if (error) {
            return  res.status(404).json({
                success: false,
                data: error,
              });
          }
          return res.status(200).json({
            success: true,
            data: 'Email sent',
          });
        });
    }

    const updatedpassword=async(req,res) => {
       await User.updateOne({email:req.body.email},{password:req.body.password}).then(secc=>console.log(secc)).catch(e=>console.log(e))
       res.status(200).send({success:true,message:" update password successfully"})
    }
// connexion :login : ya3ni bach nod5el lel compte mta3i
const login = async (req, res) => { //tested
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).catch((err) => { // nlawej 3al user fi bd en utilisant son email
        // console.log(err);
    });
    if (user) { // cas l9it email
        const isPasswordCorrect = await bcrypt.compare(password, user.password); // tester password correcte ou non (password : password elli da5eltou , user.password : password de l'utilisateur dans bd )
        if (isPasswordCorrect) {//sign : crér token w n7ot fih les données elli n7b 3laha w on crer token avec un clé bach ba3d najm n3mella decode bl clé adhaka
            const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET); // aprés validation on crée un token contient l'id de l'utilisateur et son nom
            return res.json({
                success: true,
                message: "Login Successful",
                user: user,
                token: token,
            })
        }
        return res.json({ // cas mot de passe incorrecte
            token: null,
            user: null,
            success: false,
            message: "Wrong password, please try again",
        });
    }
    return res.json({ // cas email invalide
        token: null,
        user: null,
        success: false,
        message: "No account found with entered email",
    });
};

//Crer compte : s'nscrire : créer compte
const signup = async (req, res) => { // tested 
    const { name, lastname, email, password, role, age, phoneNumber, bio } = req.body;
    let user = await User.findOne({ email: email }).catch((err) => { // email lazm ykoun unique
        // console.log(err);
    });
    if (user) {
        return res.json({
            token: null,
            user: null,
            success: false,
            message: "Account with email already exists, Try logging in instead!",
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // bcrypte.hash pour crypter mot de passe avec un cle de taille 10 puis bcrypte fournit une méthode pour comparer le mot de passe rél et cryptéé
        const newUser = new User({ // création un nouveau utilisateur
            name: name,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: role,
            bio: bio,
            phoneNumber: phoneNumber,
            age: age
        });

        const savedUser = await User.create({
            picture:req?.file?.path || undefined,
            name: name,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: role,
            bio: bio,
            phoneNumber: phoneNumber,
            age: age

        }); // enregistrer user dans base de donné
        const token = jwt.sign({ id: savedUser._id, name: savedUser.name }, // apré enregistrement on cré un token contient les information sur l'utilisateur
            process.env.JWT_SECRET
        );//sign : yasna3 token
        //token pour authentification pour accéder au ressource

        return res.json({ // retourne token comme résultat lel user
            user: savedUser,
            token: token,
            success: true,
            message: "Signed up successfully",
        });
    } catch (err) {
        // console.log(err);
        return res.json({
            success: false,
            user: null,
            token: null,
            message: err.message,
        });
    }
};





const signOut = async (req, res, next) => {
    const token = req.headers.authorization
    const foundUser = await Uploader.findOneAndUpdate({ accessToken: token }, { accessToken: null }) // nlawej 3al user ça depand les information existe dans token
    if (!foundUser) {
        return next(new appError('invalid credentials', 400));
    } else {
        return res.json({
            status: "success",
            'message': 'loggedout successfully'
        })

    }
};

// requete qui importe toute les user : njib les users lkol m database
const getUsers = async (req, res) => {
    User.find()
        .then(
            (users) => {
                res.status(200).send(users);

            }
        )
        .catch(
            (err) => {
                res.status(400).send(error)
            }
        )
};

const getSingleUserInfo = async (req, res) => { // fonction thzni lel profile mta3 user
    try {
        const user = req.userProfile;
        return res.json({ success: true, user: user });
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to Update User",
            errorMessage: error.message,
        });
    }
};

const searchUser = async (req, res) => { // nlawej 3ala user fi zone de recherche : nektb esm user kaml w ki nenzel entrer yhzni lel profile mta3ou(fct elli fo9 thez lel profil mta3 user )
    try {
        const search = req.query.text; //req.query.text : text elli mch nktbou fi zone de recherche
        const users = await User.find({
            $or: [ //agrégation
                { name: search }, // i: quelque soit nom majuscule ou miniscule
                { lastname: search },
            ],
        }).select("id name lastname profileUrl email");
        if (users.length === 0) {
            return res.json({ success: false, message: "No results" });
        }
        return res.json({ success: true, users: users });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//getUserBy Id
const getUserById = async (req, res) => { //tested
    try {
        const UserId = req.params.userId; //id question
        const user = await User.findById(UserId);
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Id, user not found",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "user trouvé",
                user: user,
            })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// requete de mise à jour
const updateProfile = async (req, res) => { //tested
    try {
        id = req.params.userId;
        // console.log(id)
        newData = req.body; 
        // console.log(newData,req?.file?.path);
        //tester sur password
        //tester email unique
        newData.picture=req?.file?.path 
        updated = await User.findByIdAndUpdate({ _id: id }, newData);
        // console.log(updated);
        res.send(updated); //n7ot fazet cryptage ki nbadel mot de passe bach yatla3li crypté
        //nzid fazet mot de passe crypté et email lazm unique ki ybadel
    }
    catch (error) {

        res.send(error)

    }
}

const countuser=async(req,res)=>{

    const countutilisateur=await User.find({ role: "utilisateur" }).count();
    const countcoatch=await User.find({ role: "coatch" }).count();
    console.log(count);
    res.status(200).send({ success: true, utilisateur:countutilisateur,coatch:countcoatch})
}

module.exports = {
    login,
    signup,
    getUserById,
    updateProfile,
    getSingleUserInfo,
    searchUser,
    getUsers,
    countuser,
    sendEmail,
    updatedpassword

};


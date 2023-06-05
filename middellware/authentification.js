const { json } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv");
//authentification heya verifyToken 
const authenticate = async (req, res,next) => {  //La méthode next() renvoie un objet possédant deux propriétés done et value. Cette méthode peut également recevoir un paramètre pour envoyer une valeur au générateur.
    
    try{ 
        //dans les en-tete http nous avons un objet d'autorisation
        // na9ra token ml requétte http authorization
       
        ////verifier l'objet d'autorisation : verifier elli jeton d'authentification mawjoud
        let token = req.headers.authorization;   //na5ou token ml l'en-tete(headers) mta3 requète http d'autorisation
        if(!token){ //if token not valide 
            return res.status(401).json({ //401 signifie non t'autorise et aucun jeton autorisé donc cela devra faire de nouveau la requète 
                success : false,
                message : "Unthorized request , token not found . ", //Ce code pour JWT retourne toujours Status 401 (Unauthorized) lorsque la requête est envoyée au format Authorization: Bearer "token" ,

            });
        }
        token=token.split(" ")[1]; //decomposer token par l'espace car requète ki tousel l serveur son headers est composé de "berear et token separé par un espace "
        //JWT_SECRET : clé d'authentification mawjouda fi .env
        //verifier token : jwt.verify methode verifie l'authenticité de token par une verification du signature porté par token 
        // par rapport le clé d'authentification puis decode le payload qui existe dans token , if the signature is invalide or the token has expired  , jwt.verify will throw an error 
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET); //nverifi token elli jé fi requete w token stockéd
        //Dotenv est un module sans dépendance qui charge les variables d'environnement d'un .env fichier dans process.env 
    
        const id = decodedValue._id ? decodedValue._id : decodedValue.id; //na5ou id mta3user elli tlab acce  elli mawjoud fi payload a partir m token
        const user = await User.findById(id);
         //recherche user à partir de l'id 
        if(!user){// user not existe 
            return res.status(403).json({
                success : false ,
                message : "Unothorized request , Either user not found or invalid token",

            });

        } 
        req.user=user;
        next(); //cas de succée passer à l'étape suivante 
    }catch(err){
        // console.log(err);
        res.status(401).json({success : false , errMessage: err});
    }
};
module.exports = authenticate;
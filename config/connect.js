//faire connexion avec base de donnée se fait en 3 étape ci dessus
const mongoose = require('mongoose');// import mongoose
require("dotenv").config(); // dotenv : reglage variable d'environnement

function initialiseDBConnection(){
mongoose.connect(process.env.MONGO_DB_URI);    // faire connexion avec connect
mongoose.connection.on("connected", () => {
	console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
	console.log("mongodb failed with", err);
})}
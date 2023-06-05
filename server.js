//fichier main : sera exécuter lors de la communication de la base de données 
//console.log('hello');
//node server.js : exécution du fichier server.js
//fichier node_modules : stocke les librairie que j'ai installé

//import section

require("dotenv").config();
const UserModel = require("./models/user")
const port = process.env.PORT || 8000;
const express = require("express");
const path = require("path");
const app = express(); //créer une application express
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io")
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const coursRouter = require("./routes/courses");
const QuizRouter = require("./routes/quiz");
const sessionEleveRouter = require("./routes/SessionEleve")
const SessionRouter = require("./routes/SessionDeFormation");
const Video = require("./routes/Video");
const CommentaireRouter=require("./routes/commentaire")
const Order = require("./routes/Order")
const stripe = require("stripe")(process.env.PRIVATE_Key)
const {
    createMessage,
    startMessage,
} = require("./controlleur/message");
const messageRouter=require("./routes/message");
const exerciceRouter=require('./routes/exercice');
// const ConnversationRouter=require("./routes/conversation");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//  app.use(upload.array()); 
app.use(express.static('public'));
//DB connection
mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected", () => {
    console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
    console.log("mongodb failed with", err);
});


const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions)) //En utilisant app.use(cors()), on permet l'accès à toutes les ressources du serveur à partir de n'importe quelle origine.

app.use("/users", userRouter);
app.use("/courses", coursRouter);
app.use("/quiz", QuizRouter);
app.use("/sessionFormation", SessionRouter);
app.use("/video", Video);
app.use("/order", Order);
app.use("/sessionEleve", sessionEleveRouter);
app.use("/message",messageRouter);
app.use("/exercice",exerciceRouter);
app.use("/commentaire",CommentaireRouter)
// app.use("/conversation",ConnversationRouter);


//static Images Folder
app.use('/image', express.static('./image'))
//static pdf folder pour upload exercice
app.use('/pdf', express.static('./pdf'))
app.use('/video', express.static('./video'))
//this for message
//server listening
const serves=app.listen(port, () => { //nbadel app b server fi socket
  console.log(`Example server listening on port ${port}`);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


//routes middleware
app.get("/", (req, res) => {
    return res.send({ message: "Welcome" });
});

//paiement

app.post('/create-checkout-session', async (req, res) => {
  console.log(req.body.datacart);
  const line_items = req.body.datacart.map((item) => {

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.titre,
          description: item.desc,
          // images:[["http://localhost:8000/"+item.image]],
          metadata: {
            id: item._id,
          },

        },
        unit_amount: item?.discount_Price ? Number(item?.discount_Price)* 100: Number(item?.actual_Price)* 100,
      },
      quantity: 1
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items:line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/user/listecour',
    cancel_url: 'http://localhost:3000/user/cart',
  });

  res.send({url:session.url});
});




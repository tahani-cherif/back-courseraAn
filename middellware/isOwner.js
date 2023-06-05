//owner du video
//a discuter

//verifyTokenAndAuthorization
const authenticate=require("./authentification")

const isOwner = (req,res,next)=>{
  
        if (req.user._id === req.params.id){
            next();
        }else{
           return res.status(403).json("You are not alowed to do that!")
        }
  
};

module.exports=isOwner;
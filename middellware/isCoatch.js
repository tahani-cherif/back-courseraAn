const formatResponse = require("../utils/format.response");
const authenticate = require('./authentification')

const isCoatch = (req, res, next) => {
 
        if (req.user.role !== "coatch") {
            // console.log('you are not allowed');
            return res.status(404).json(formatResponse("Error", "You are not allowed to do that"))
        }else{
            next()
        }
    
}
module.exports = isCoatch;
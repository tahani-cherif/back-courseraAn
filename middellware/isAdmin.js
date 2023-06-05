const formatResponse = require("../utils/format.response");
const authenticate = require('./authentification')

const isAdmin = (req, res, next) => {

    if (req.user.role !== "Admin") {
        return res.json(formatResponse("Error", "You are not allowed"))
    } else {
        next()
    }


}
module.exports = isAdmin;
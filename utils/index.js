const jwt = require("jsonwebtoken");

const generateToken = (role, id) => {
    return jwt.sign({ role, id }, process.env.JWT_SECRET);
};



module.exports = { generateToken }
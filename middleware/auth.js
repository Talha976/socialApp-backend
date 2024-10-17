const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: 'Token not found, Authentication denied' });
    }

    try {
        const decode = jwt.verify(token, SECRET_KEY);
        req.userID = decode.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};


module.exports = verifyToken;

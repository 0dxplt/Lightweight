const jwt = require('jsonwebtoken');
const config = require('../config/env');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        console.log("HELLO");
        return res.status(403).json({
            success: false,
            message: "Token not provided"
        });
    }

    try {
        const verified = jwt.verify(token, config.jwtSecret);
        req.user = verified;
        next();
    } catch(error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

module.exports = verifyToken;
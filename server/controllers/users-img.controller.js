const dbutils = require('../db/database.utils');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

async function getAvatar(req, res) {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Token expired or not provided"
            });
        }
    
        const dir = config.avatarDir;
        const avatar = userId + ".png";

        const filePath = path.resolve(dir, avatar);

        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }

        res.json(null);
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Error: " + err.message
        });
    }
}

module.exports = {
    getAvatar
}
const dbutils = require('../db/database.utils');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

async function getAvatar(req, res) {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(404).json(null);
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
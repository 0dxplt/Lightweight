const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');

async function changePassword(req, res) {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "Token expired or not provided"
            });
        }

        const { oldPass, newPass } = req.body;

        if (!oldPass || !newPass || oldPass.trim() === '' || newPass.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Input invalid"
            });
        }

        if (oldPass.length < global.min_password_length || oldPass.length > global.max_password_length) {
            return res.status(400).json({
                success: false,
                message: `Old password must be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        if (newPass.length < global.min_password_length || newPass.length > global.max_password_length) {
            return res.status(400).json({
                success: false,
                message: `New password must be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        const dbPass = await dbutils.get(
            "SELECT password FROM Atleti WHERE id = ?",
            [userId]
        );

        if (!(await bcrypt.compareSync(oldPass, dbPass.password))) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct"
            });
        }

        const pHash = await bcrypt.hash(newPass, global.rounds);

        await dbutils.run(
            "UPDATE Atleti SET password = ? WHERE id = ?",
            [pHash, userId]
        );

        res.status(200).json({
            success: true,
            message: "Password changed!"
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Error: " + err.message
        });
    }
}

module.exports = {
    changePassword
}
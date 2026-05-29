const dbutils = require('../db/database.utils');

async function getAllModerators(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Moderatori");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllModerators
}
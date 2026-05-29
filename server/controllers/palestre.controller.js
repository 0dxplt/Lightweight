const dbutils = require('../db/database.utils');

async function getAllGyms(req, res) {
    try { 
        const rows = await dbutils.all("SELECT * FROM Palestre");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllGyms
}
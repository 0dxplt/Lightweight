const dbutils = require('../db/database.utils');

async function getAllMuscolarGroups(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM GruppiMuscolari");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        })
    }
} 

module.exports = {
    getAllMuscolarGroups
}
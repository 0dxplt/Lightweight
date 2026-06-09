const dbutils = require('../db/database.utils');

async function getAllMuscolarGroups(req, res) {
    try {
        const rows = await dbutils.all("SELECT nome FROM GruppiMuscolari");
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            err: "Could not retrieve all muscolar groups"
        })
    }
} 

module.exports = {
    getAllMuscolarGroups
}
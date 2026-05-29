const dbutils = require('../db/database.utils');

async function getAllExercises(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Esercizi");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllExercises,
}
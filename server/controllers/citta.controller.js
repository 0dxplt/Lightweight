const dbutils = require('../db/database.utils');

async function getAllCities(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Citta");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllCities
}
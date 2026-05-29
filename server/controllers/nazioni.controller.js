const dbutils = require('../db/database.utils');

async function getAllNations(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Nazioni");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

async function getNationFromID(req, res) {
    try {
        const id = req.params.id;
        const nation = await dbutils.get(`SELECT * FROM Nazioni WHERE Nazioni.id = ${id};`);
        res.json(nation);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllNations,
    getNationFromID,
}
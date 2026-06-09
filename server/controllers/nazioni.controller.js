const dbutils = require('../db/database.utils');

async function getAllNations(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Nazioni ORDER BY nome ASC");
        res.json(rows);
    } catch(err) {
        console.error(err)
        res.status(500).json({
            err: "Could not retrieve all nations"
        });
    }
}

async function getNationFromID(req, res) {
    try {
        const id = req.params.id;
        const nation = await dbutils.get(`SELECT * FROM Nazioni WHERE Nazioni.id = ${id};`);
        res.json(nation);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            err: "Could not get nation from id"
        });
    }
}

async function getNationByName(req, res) {
    const name = req.params.countryName;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Invalid country name"
        });
    }

    try {
        const nationRow = await dbutils.get("\
            SELECT\
                Nazioni.id, Nazioni.nome as name, Nazioni.bandiera as flag, Nazioni.country_code as shortform\
            FROM Nazioni\
            WHERE nome = ?",
            [name]
        );

        if (!nationRow) {
            return res.status(404).json({
                success: false,
                message: "Nation not found"
            });
        }

        res.status(200).json(nationRow);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve nation"
        });
    }
}

module.exports = {
    getAllNations,
    getNationFromID,
    getNationByName
}
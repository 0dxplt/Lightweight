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

async function getAllFullCities(req, res) {
    try {
        const allCities = await dbutils.all("SELECT * FROM Citta ORDER BY id_nazione ASC, nome ASC");
        const fullCities = [];
        for (let city of allCities) {
            const country = await dbutils.get(`SELECT * FROM Nazioni WHERE Nazioni.id = ${city.id_nazione}`);
            const __city = city;
            __city.nation = {
                id: country.id,
                name: country.nome,
                flag: country.bandiera,
                shortform: country.country_code
            };
            fullCities.push(city);
        }
        res.json(fullCities);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllCities,
    getAllFullCities
}
const dbutils = require('../db/database.utils');

async function getAllCities(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Citta ORDER BY nome ASC");
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

async function getOrInsert(req, res) {
    const { cityName, country } = req.body;
    
    if (!cityName || !country || cityName.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Invalid input data"
        });
    }

    let active_transaction = false;

    try {
        const cityRow = await dbutils.get("\
            SELECT\
                Citta.id, Citta.nome as name, Citta.id_nazione\
            FROM Citta\
            WHERE nome = ? AND id_nazione = ?",
            [cityName, country.id]
        );

        if (cityRow) {
            return res.status(200).json({
                id: cityRow.id,
                name: cityRow.name,
                nation: country
            });
        }

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "INSERT INTO Citta (nome, id_nazione) VALUES (?, ?)",
            [cityName, country.id]
        );

        const result = await dbutils.get("SELECT last_insert_rowid() AS lastId");
        const lastId = result.lastId;

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({
            id: lastId,
            name: cityName,
            nation: country
        });
    } catch(err) {
        console.log(err);
        if (active_transaction)
            await dbutils.run("ROLLBACK");
        res.status(500).json({
            success: false,
            message: "Could not get-or-insert city"
        });
    }
}

async function getByName(req, res) {
    const cityName = req.params.cityName;
    if (!cityName || cityName.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Invalid input data"
        });
    }

    try {
        const cityRow = await dbutils.get("\
            SELECT\
                Citta.id, Citta.nome as name, Citta.id_nazione\
            FROM Citta\
            WHERE nome = ?",
            [cityName]
        );

        if (!cityRow) {
            return res.status(404).json({
                success: false,
                message: "Could not find requested city"
            });
        }

        const countryRow = await dbutils.get("\
            SELECT\
                Nazioni.id, Nazioni.nome as name, Nazioni.country_code AS shortform, Nazioni.bandiera AS flag\
            FROM Nazioni\
            WHERE id = ?",
            [cityRow.id_nazione]
        );

        res.status(200).json({
            id: cityRow.id,
            name: cityName,
            nation: {
                id: countryRow.id,
                name: countryRow.name,
                flag: countryRow.flag,
                shortform: countryRow.shortform
            }
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve city"
        });
    }
}

module.exports = {
    getAllCities,
    getAllFullCities,
    getOrInsert,
    getByName
}
const dbutils = require("../db/database.utils");

async function getPtsCity(req, res) {
    try {
        const cityName = req.body.city;

        const rows = await dbutils.all(`
            SELECT
            Atleti.id,
            Atleti.username,
            Atleti.nome,
            Atleti.cognome,
            Palestre.nome AS palestra,
            (strftime('%Y', 'now') - strftime('%Y', data_nascita)) - 
            (strftime('%m-%d', 'now') < strftime('%m-%d', data_nascita)) AS eta,
            Atleti.img AS fotoUrl,
            Citta.nome AS citta
            FROM PersonalTrainers JOIN Atleti ON PersonalTrainers.id = Atleti.id
            JOIN Citta ON PersonalTrainers.id_citta = Citta.id
            JOIN Palestre ON PersonalTrainers.id_palestra = Palestre.id
            WHERE Citta.nome = ?
            `, [cityName]);

        res.json(rows);
    } catch (error) {
        console.error("Errore nel caricare i pts!: " + error.message);
        res.status(500).json({
            success: false,
            message: "Could not retrieve pts cities"
        });
    }
}

module.exports = {
    getPtsCity
}
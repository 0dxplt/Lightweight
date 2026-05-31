const dbutils = require('../db/database.utils');

async function getAllExercises(req, res) {
    try {
        const rows = await dbutils.all(`
            SELECT Esercizi.id AS id_esercizio,
            Esercizi.nome AS nome_esercizio,
            Esercizi.descrizione,
            Esercizi.img,
            Esercizi.difficolta,
            json_group_array(
                json_object(
                    'id', GruppiMuscolari.id,
                    'nome', GruppiMuscolari.nome,
                    'percentuale', EserciziGruppiMuscolari.perc
                )
            ) AS gruppi_muscolari
            FROM Esercizi
            JOIN EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio
            JOIN GruppiMuscolari ON EserciziGruppiMuscolari.id_gruppo_muscolare = GruppiMuscolari.id
            GROUP BY Esercizi.id
            `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getAllExercises,
}
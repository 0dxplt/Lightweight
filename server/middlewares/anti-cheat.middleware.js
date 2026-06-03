const dbutils = require("../db/database.utils");

const calcolaXP = async (userId, series) => {
    let sum = 0;
    const { height, weight } = await dbutils.get(
        `SELECT height, weight FROM Atleti WHERE id = ?`, [userId]);

    const exercisesIds = [...new Set(series.map(serie => serie.exerciseId))];
    const parameters = exercisesIds.map(() => '?').join(',');

    const esercizi = await dbutils.all(
        `SELECT id, difficolta FROM esercizi WHERE id = ${parameters}`,
        exercisesIds
    );

    const seriesCounter = {};

    for (const serie of series) {
        seriesCounter[serie.exerciseId] = (seriesCounter[serie.exerciseId] || 0) + 1;
    }

    const difficulty = {};

    esercizi.forEach((esercizio) => {
        difficulty[esercizio.id] = esercizio.difficolta;
    });

    for (const serie of series) {
        sum += (serie.reps * serie.weight) * Math.sqrt(seriesCounter[serie.exerciseId]) * Math.log(1 + (weight / serie.weight)) * (1 + (0.5 * (1 - difficulty[serie.exerciseId]))) * (1 / ((weight ** 0.7) * (height ** 0.31)));
    }
    return sum;
}

const antiCheat = async (req, res, next) => {
    try {
        const { session } = req.body;
        const series = session.exercises;
        const userId = req.user.userId;

        // logica anticheat

        for (serie of series) {
            const avg = await dbutils.all(`
                SELECT
                AVG (
                    SessioniEsercizi.peso
                ) AS peso_medio
                FROM SessioniEsercizi
                JOIN Sessioni ON SessioniEsercizi.id_sessione = Sessioni.id
                JOIN Atleti ON Sessioni.id_creatore = Atleti.id
                WHERE SessioniEsercizi.id_esercizio = ? AND Atleti.id = ?
                GROUP BY SessioniEsercizi.id_esercizio
                `, [serie.exerciseId, userId]);
            console.log(avg);
        }

        req.body.xp = await calcolaXP(req.user.userId, series);
        next();
    } catch (error) {
        return res.status(503).json({
            success: false,
            message: "Errore nel verificare la sessione"
        });
        console.log(error);
    }
}
module.exports = antiCheat
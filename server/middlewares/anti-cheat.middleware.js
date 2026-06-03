const dbutils = require("../db/database.utils");

const calcolaXP = async (userId, series) => {
    let sum = 0;
    const { height, weight } = await dbutils.get(
        `SELECT height, weight FROM Atleti WHERE id = ?`, [userId]);

    const exercisesIds = [...new Set(series.map(serie => serie.exerciseId))];
    const parameters = exercisesIds.map(() => '?').join(',');

    const esercizi = await dbutils.all(
        `SELECT id, difficolta FROM esercizi WHERE id IN (${parameters})`,
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

        const avgs = await dbutils.all(`
            SELECT
                SessioniEsercizi.id_esercizio,
                AVG (SessioniEsercizi.peso) AS peso_medio
            FROM SessioniEsercizi
            JOIN Sessioni ON SessioniEsercizi.id_sessione = Sessioni.id
            JOIN Atleti ON Sessioni.id_creatore = Atleti.id
            WHERE Atleti.id = ? AND SessioniEsercizi.valida = 1
            GROUP BY SessioniEsercizi.id_esercizio`,
            [userId]
        );
        
        const avgMap = Object.fromEntries(
            avgs.map(row => [row.id_esercizio, row.peso_medio])
        );

        for (serie of series) {
            if (avgMap[serie.exerciseId]) {
                // console.log(serie + " => esiste già")
                // console.log("Peso serie: " + serie.weight);
                // console.log("Peso avg: " + avgMap[serie.exerciseId]);
                const diff = serie.weight - avgMap[serie.exerciseId];
                if (diff > 0 && diff > 0.5 * avgMap[serie.exerciseId]) {
                    console.log(serie + " is not valid anymore");
                    serie.valid = false;
                }
            } else {
                // console.log(serie + " => prima volta")
                const avgRow = await dbutils.get(`
                    SELECT AVG(max_peso) as 'media' FROM (
                        SELECT 
                            Esercizi.nome as 'nome esercizio',
                            GruppiMuscolari.nome as 'gruppo muscolare',
                            EserciziGruppiMuscolari.perc,
                            MAX(SessioniEsercizi.peso) as 'max_peso'
                        FROM
                            Esercizi JOIN
                            EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio JOIN
                            GruppiMuscolari ON GruppiMuscolari.id = EserciziGruppiMuscolari.id_gruppo_muscolare JOIN
                            SessioniEsercizi ON SessioniEsercizi.id_esercizio = Esercizi.id JOIN
                            Sessioni ON Sessioni.id = SessioniEsercizi.id_sessione
                        WHERE Sessioni.id_creatore = ? AND SessioniEsercizi.valida = 1 AND EserciziGruppiMuscolari.id_gruppo_muscolare = (
                            SELECT EserciziGruppiMuscolari.id_gruppo_muscolare FROM EserciziGruppiMuscolari
                                WHERE EserciziGruppiMuscolari.id_esercizio = ?
                                ORDER BY perc DESC 
                                LIMIT 1
                            ) AND EserciziGruppiMuscolari.perc = (
                                SELECT MAX(EserciziGruppiMuscolari.perc)
                                FROM EserciziGruppiMuscolari
                                WHERE EserciziGruppiMuscolari.id_esercizio = Esercizi.id
                            )
                        GROUP BY Esercizi.id
                    )`,
                    [userId, serie.exerciseId]
                );

                if (avgRow.media) {
                    // console.log("AVG ROW: " + avgRow);
                    const offset = 50;
                    const limit = avgRow.media + offset;
    
                    if (serie.weight > limit)
                        serie.valid = false;
                } else {
                    // Hardcoded
                    // console.log(serie + " => Hardcoded");
                    if (serie.weight > 400)
                        serie.valid = false;
                }
            }
        }

        const valids = series.filter(s => s.valid);
        console.log(valids);
        req.body.xp = await calcolaXP(req.user.userId, valids);
        next();
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            success: false,
            message: "Errore nel verificare la sessione"
        });
    }
}
module.exports = antiCheat
const dbutils = require('../db/database.utils');

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
        difficulty[esercizio.id] = (esercizio.difficolta) / 2;
    });

    for (const serie of series) {
        sum += (serie.reps * serie.weight) * Math.sqrt(seriesCounter[serie.exerciseId]) * Math.log(1 + (weight / serie.weight)) * (1 + (0.5 * (1 - difficulty[serie.exerciseId]))) * (1 / ((weight ** 0.7) * (height ** 0.31)));
    }
    return sum;
}

module.exports = calcolaXP;
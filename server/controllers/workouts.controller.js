const dbutils = require('../db/database.utils');

async function getWorkouts(req, res) {
    try {
        const rows = await dbutils.all(`
            SELECT Workout.id AS workout_id,
            Workout.nome AS workout_nome,
            json_group_array (
                DISTINCT GruppiMuscolari.nome
            ) gruppi_muscolari
            FROM Workout
            JOIN WorkoutEsercizi ON Workout.id = WorkoutEsercizi.id_workout
            JOIN Esercizi ON WorkoutEsercizi.id_esercizio = Esercizi.id
            JOIN EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio
            JOIN GruppiMuscolari ON EserciziGruppiMuscolari.id_gruppo_muscolare = GruppiMuscolari.id
            GROUP BY Workout.id
            `);
            res.json(rows);
    } catch (error) {
        res.status(500).json({
            err: error.message
        });
    }
}

module.exports = {
    getWorkouts
}
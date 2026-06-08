const dbutils = require('../db/database.utils');

async function getWorkouts(req, res) {
    try {
        const userId = req.user.userId;
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
            JOIN Atleti ON Workout.id_creatore = Atleti.id
            WHERE Atleti.id = ?
            GROUP BY Workout.id
            `, [userId]);
            res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err: "Could not retrieve workouts"
        });
    }
}

module.exports = {
    getWorkouts
}
const dbutils = require('../db/database.utils');

// nome wo, creatore wo, data creazione, join wo esercizi => serie, reps, recupero, join esercizio => id, nome, desc, img, difficulty, join groups => perc, join musculargroups => id, name
async function getFullWorkout(req, res) {
    try {
        const id = req.params.id;
        const rows = await dbutils.all(`
            SELECT Workout.nome AS nome_workout,
            Workout.data_creazione,
            Atleti.username,
            Atleti.id AS creatore_id,
            WorkoutEsercizi.serie,
            WorkoutEsercizi.ripetizioni,
            WorkoutEsercizi.recupero,
            Esercizi.id AS id_esercizio,
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
            FROM Workout
            JOIN WorkoutEsercizi ON Workout.id = WorkoutEsercizi.id_workout
            JOIN Esercizi ON WorkoutEsercizi.id_esercizio = Esercizi.id
            JOIN EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio
            JOIN GruppiMuscolari ON EserciziGruppiMuscolari.id_gruppo_muscolare = GruppiMuscolari.id
            JOIN Atleti ON Workout.id_creatore = Atleti.id
            WHERE Workout.id = ?
            GROUP BY WorkoutEsercizi.id
            `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            err: error.message
        });
    }

}

async function saveWorkout(req, res) {
    try {
        const { id, nome, data, creatore, exercises } = req.body;
        await dbutils.run('BEGIN TRANSACTION');
        if (id) {
            await dbutils.run(
                "DELETE FROM Workout WHERE ID = ?", [id]
            );
        }
        await dbutils.run(
            "INSERT INTO Workout (nome, data_creazione, id_creatore) VALUES (?, ?, ?)",
            [nome, data, creatore]
        );
        for (const exercise of exercises) {
            await dbutils.run(
                "INSERT INTO WorkoutEsercizi (serie, ripetizioni, recupero, id_workout, id_esercizio) VALUES (?, ?, ?, ?, ?)",
                [exercise.serie, exercise.ripetizioni, exercise.recupero, id, exercise.id]
            );
        }

        await dbutils.run('COMMIT');
        res.json({
            success: true,
            message: "Saved Workout!"
        });
        
    } catch (error) {
        await dbutils.run('ROLLBACK');
        res.status(500).json({
            success: false,
            message: "Couldn't save workout"
        })
    }
}

module.exports = {
    getFullWorkout,
    saveWorkout
}
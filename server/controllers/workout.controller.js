const dbutils = require('../db/database.utils');

async function getFullWorkout(req, res) {
    try {
        const id = req.body.id;
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
        const creatore = req.user.userId;
        const { id, nome, data, exercises } = req.body;
        await dbutils.run('BEGIN TRANSACTION');
        await dbutils.run(
            "UPDATE Workout SET nome = ?, data_creazione = ?, id_creatore = ? WHERE id = ?",
            [nome, data, creatore, id]
        );

        await dbutils.run(
            "DELETE FROM WorkoutEsercizi WHERE id_workout = ?",
            [id]
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
            message: "Couldn't save workout: " + error.message
        })
    }
}

async function deleteWorkout(req, res) {
    try {
        const id = req.body.id;
        await dbutils.run(`DELETE FROM Workout WHERE id = ?`, [id]);
        res.json({
            success: true,
            message: "Workout Eliminato!"
        });
    } catch (error) {
        await dbutils.run('ROLLBACK');
        res.status(500).json({
            success: false,
            message: "Errore nell'eliminazione del workout!: " + error.message
        })
    }
}

async function createWorkout(req, res) {
    try {
        const {nome, data, exercises } = req.body;
        const creatore = req.user.userId;
        await dbutils.run('BEGIN TRANSACTION');
        await dbutils.run(
            "INSERT INTO Workout (nome, data_creazione, id_creatore) VALUES (?, ?, ?)",
            [nome, data, creatore]
        );
        const result = await dbutils.all("SELECT last_insert_rowid() AS lastId");
        workoutId = result[0].lastId;
        for (const exercise of exercises) {
            await dbutils.run(
                "INSERT INTO WorkoutEsercizi (serie, ripetizioni, recupero, id_workout, id_esercizio) VALUES (?, ?, ?, ?, ?)",
                [exercise.serie, exercise.ripetizioni, exercise.recupero, workoutId, exercise.id]
            );
        }
        await dbutils.run('COMMIT');
        res.json({
            success: true,
            message: "Created Workout!"
        });
    } catch (error) {
        await dbutils.run('ROLLBACK');
        res.status(500).json({
            success: false,
            message: "Errore nella creazione del workout!: " + error.message
        })
    }
}

module.exports = {
    getFullWorkout,
    saveWorkout,
    deleteWorkout,
    createWorkout
}
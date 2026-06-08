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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: "Could not get all workouts (full)"
        });
    }

}

async function saveWorkout(req, res) {
    let active_transaction = false;
    try {
        const creatore = req.user.userId;
        const { id, nome, data, exercises } = req.body;
        await dbutils.run('BEGIN TRANSACTION');
        active_transaction = true;

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
        active_transaction = false;

        res.json({
            success: true,
            message: "Saved Workout!"
        });

    } catch (err) {
        if (active_transaction)
            await dbutils.run('ROLLBACK');
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Couldn't save workout"
        })
    }
}

async function deleteWorkout(req, res) {
    let active_transaction = false;
    try {
        const id = req.body.id;
        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(`DELETE FROM Workout WHERE id = ?`, [id]);
        
        await dbutils.run("COMMIT");
        active_transaction = false;

        res.json({
            success: true,
            message: "Workout Eliminato!"
        });
    } catch (err) {
        if (active_transaction)
            await dbutils.run('ROLLBACK');
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore nell'eliminazione del workout!"
        })
    }
}

async function createWorkout(req, res) {
    let active_transaction = false;
    try {
        const {nome, data, exercises } = req.body;
        const creatore = req.user.userId;
        await dbutils.run('BEGIN TRANSACTION');
        active_transaction = true;

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
        active_transaction = false;

        res.json({
            success: true,
            message: "Created Workout!"
        });
    } catch (err) {
        if (active_transaction)
            await dbutils.run('ROLLBACK');
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Errore nella creazione del workout!"
        })
    }
}

module.exports = {
    getFullWorkout,
    saveWorkout,
    deleteWorkout,
    createWorkout
}
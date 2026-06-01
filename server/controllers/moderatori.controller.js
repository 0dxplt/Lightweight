const dbutils = require('../db/database.utils');

async function getAllModerators(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Moderatori");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

async function updateSessionValidity(req, res) {
    const { sessionId, sessionCreator, exercises} = req.body;
    if (isNaN(sessionId) || isNaN(sessionCreator) || !exercises) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data"
        });
    }
    let active_transaction = false;

    try {

        const row = await dbutils.get(
            "SELECT id FROM Sessioni WHERE id = ? AND id_creatore = ?",
            [sessionId, sessionCreator]
        );

        if (!row) {
            throw new Error("Could not find session");
        }

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        for (let exercise of exercises) {
            await dbutils.run(
                "UPDATE SessioniEsercizi SET valida = ? WHERE id = ? AND id_sessione = ?",
                [exercise.valid ? 1 : 0, exercise.id, sessionId]
            );
        }

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({updated: true});

    } catch(err) {
        if (active_transaction)
            await dbutils.run("ROLLBACK");

        res.status(500).json({
            success: false,
            message: "Error updating session validity"
        });
    }
}

module.exports = {
    getAllModerators,
    updateSessionValidity
}
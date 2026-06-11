const global = require('../config/global');
const dbutils = require('../db/database.utils');
const updateUserRank = require('../utils/updateUserRank.util');
const calcolaXP = require('../utils/calcolaXp.util');

async function getAllModerators(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Moderatori");
        res.json(rows);
    } catch(err) {
        console.error(err)
        res.status(500).json({
            err: "Could not retrieve all moderators"
        });
    }
}

async function updateSessionValidity(req, res) {
    const { sessionId, sessionCreator, exercises } = req.body;
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

        const sessionInfoRow = await dbutils.get("SELECT xp, stagione_valida as 'seasonal_valid' FROM Sessioni WHERE id = ?", [sessionId]);
        const oldXps = sessionInfoRow?.xp ?? 0;
        const seasonal_valid = (sessionInfoRow?.seasonal_valid === 1) ? true : false;

        // console.log("OldXps: " + oldXps.xp);

        // calcolo nuovi xp
        const xps = await calcolaXP(sessionCreator, exercises.map(ex => ({
            exerciseId: ex.exercise.id,
            reps: ex.reps,
            weight: ex.weight,
            recovery: ex.recovery,
            valid: ex.valid,
        })).filter(ex => ex.valid));

        if (xps !== oldXps) {
            // console.log("Updating session")
            // aggiornamento xp della sessione
            await dbutils.run(
                "UPDATE Sessioni SET xp = ? WHERE Sessioni.id = ? AND id_creatore = ?",
                [xps, sessionId, sessionCreator]
            );

            const userXps = await dbutils.get("SELECT xp_stagionali, xp_globali FROM Atleti WHERE id = ?", [sessionCreator]);
            const userSXPs = userXps.xp_stagionali;
            const userGXPs = userXps.xp_globali;

            // console.log("Old Userxps: " + JSON.stringify({g: userGXPs, s: userSXPs}));

            // aggiornamento degli xp dell'utente
            const delta = xps - oldXps;
            await updateUserRank(sessionCreator, delta, seasonal_valid);
        }
        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({updated: true});

    } catch(err) {
        console.error(err);
        if (active_transaction)
            await dbutils.run("ROLLBACK");

        res.status(500).json({
            success: false,
            message: "Error updating session validity"
        });
    }
}

async function updateVerify(req, res) {
    const { userId, value } = req.body;
    let active_transaction = false;
    try {

        await dbutils.run("BEGIN TRANSACTION");

        await dbutils.run(
            "UPDATE Atleti SET verificato = ? WHERE id = ?",
            [value ? 1 : 0, userId]
        );

        await dbutils.run("COMMIT");

        res.status(200).json({status_changed: true});
    } catch(err) {
        console.error(err);
        if (active_transaction)
            await dbutils.run("ROLLBACK");
        res.status(500).json({
            success: false,
            message: "Could not update verified status"
        });
    }
}

module.exports = {
    getAllModerators,
    updateSessionValidity,
    updateVerify
}
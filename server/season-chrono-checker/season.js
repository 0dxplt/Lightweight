const chrono = require('node-cron');
const config = require('../config/env.js');
const dbutils = require('../db/database.utils.js');
const fs = require('fs');
const path = require('path');

const FILENAME = "next_season";
const OFFSET = Number(config.seasonalMonthOffset);

function init() {
    console.log("Season Chrono Checker init...");
    // Ogni giorno a mezzanotte
    chrono.schedule("0 0 0 * * *", async () => {
        const filepath = path.resolve(config.seasonalDir, FILENAME);

        if (!fs.existsSync(filepath))
            return;

        const content = fs.readFileSync(filepath, "utf8");

        const next = new Date(content);
        const now = new Date();

        let active_transaction = false;

        if (now >= next) {
            try {
                await dbutils.run("BEGIN TRANSACTION");
                active_transaction = true;

                await dbutils.run(
                    "UPDATE Atleti SET xp_stagionali = 0, livello_stagionale = 3"
                );

                await dbutils.run(
                    "UPDATE Sessioni SET stagione_valida = 0 WHERE stagione_valida = 1"
                );

                await dbutils.run("COMMIT");
                active_transaction = false;

                while (next <= now) {
                    next.setMonth(
                        next.getMonth() + OFFSET
                    );
                }

                console.log("new date: " + next.toISOString());

                fs.writeFileSync(filepath, next.toISOString());

                console.log("Reset stagionale eseguito");
            } catch(err) {
                if (active_transaction)
                    dbutils.run("ROLLBACK");
                console.error(err);
            }
        }
    });
}

module.exports = {
    init
}
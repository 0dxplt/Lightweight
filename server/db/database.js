const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const config = require('../config/env');

const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) {
        console.log("Errore nel db: ", err.message);
    }
    else {
        console.log("DB operativo");
        db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
            if (pragmaErr) {
                console.error("Errore attivazione chiavi esterne:", pragmaErr.message);
            } else {
                console.log("Chiavi esterne (CASCADE) attivate con successo!");
                initDB();
            }
        });
    }
});

function initDB() {
    const schema = fs.readFileSync(config.schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Errore inizializzazione DB:', err.message);
        } else {
            console.log('Schema database caricato');
        }
    });

    

    const seed = fs.readFileSync(config.seedPath, 'utf-8');
    db.exec(seed, (err) => {
        if (err) {
            console.error('Errore inizializzazione DB:', err.message);
        } else {
            console.log('Seed database caricato');
        }
    });
}

module.exports = db;
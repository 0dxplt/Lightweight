const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const fs = require('fs').promises;
const path = require('path');

async function update(req, res) {
    const user = req.body.user ? JSON.parse(req.body.user) : null;
    const profileId = req.body.profileId;
    const file = req.file;

    let active_transaction = false;

    if (!user || !profileId) {
        return res.status(400).json({
            success: false,
            message: "Data unavailable"
        });
    }

    try {
        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            `UPDATE Atleti SET 
                username = ?, 
                email = ?, 
                nome = ?, 
                cognome = ?,
                weight = ?,
                height = ?,
                data_nascita = ?,
                id_nazione = ?
            WHERE id = ?`,
            [
                user.username, 
                user.email, 
                user.name, 
                user.surname, 
                user.weight, 
                user.height,
                user.birthdate,
                user.nationality?.id || null,
                profileId
            ]
        );

        if (user.pt) {
            await dbutils.run(
                `INSERT INTO PersonalTrainers (id, email_professionale, id_citta, id_palestra)
                 VALUES (?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET
                    email_professionale = excluded.email_professionale,
                    id_citta = excluded.id_citta,
                    id_palestra = excluded.id_palestra`,
                [
                    profileId, 
                    user.pt.proEmail, 
                    user.pt.city?.id, 
                    user.pt.gym?.id
                ]
            );
        }

        await dbutils.run("COMMIT");
        active_transaction = false;

        const row = await dbutils.get(
            `SELECT 
                A.*, 
                N1.nome AS nation_name, N1.country_code AS nation_short, N1.bandiera AS nation_flag,
                PT.email_professionale,
                C.id AS city_id, C.nome AS city_name,
                N2.id AS city_nation_id, N2.nome AS city_nation_name, N2.country_code AS city_nation_short, N2.bandiera AS city_nation_flag,
                G.id AS gym_id, G.nome AS gym_name, G.indirizzo AS gym_address, G.lat AS gym_lat, G.lng AS gym_lng
            FROM Atleti A
            LEFT JOIN Nazioni N1 ON A.id_nazione = N1.id
            LEFT JOIN PersonalTrainers PT ON A.id = PT.id
            LEFT JOIN Citta C ON PT.id_citta = C.id
            LEFT JOIN Nazioni N2 ON C.id_nazione = N2.id
            LEFT JOIN Palestre G ON PT.id_palestra = G.id
            WHERE A.id = ?`,
            [profileId]
        );

        if (!row) {
            throw new Error("User not found after update");
        }

        if (file) {
            const ext = '.png';
            const fileName = `${profileId}${ext}`;
            const filePath = path.join(config.avatarDir, fileName);
            await fs.writeFile(filePath, file.buffer);
            
            await dbutils.run("UPDATE Atleti SET img = ? WHERE id = ?", [fileName, profileId]);
        }

        const formattedUser = {
            id: row.id,
            username: row.username,
            name: row.nome ?? undefined,
            surname: row.cognome ?? undefined,
            email: row.email,
            birthdate: row.data_nascita ?? undefined,
            propic: "http://localhost:10000/api/imgs/users?id=" + row.id,
            weight: row.weight,
            height: row.height,
            sLevel: row.livello_stagionale,
            gLevel: row.livello_globale,
            sxp: row.xp_stagionali,
            gxp: row.xp_globali,
            followers: row.numero_followers,
            following: row.numero_followed,
            sessions: row.numero_sessioni,
            verified: !!row.verificato,
            nationality: row.id_nazione ? {
                id: row.id_nazione,
                name: row.nation_name,
                shortform: row.nation_short,
                flag: row.nation_flag
            } : undefined,
            pt: row.email_professionale ? {
                proEmail: row.email_professionale,
                city: {
                    id: row.city_id,
                    name: row.city_name,
                    nation: {
                        id: row.city_nation_id,
                        name: row.city_nation_name,
                        shortform: row.city_nation_short,
                        flag: row.city_nation_flag
                    }
                },
                gym: {
                    id: row.gym_id,
                    name: row.gym_name,
                    address: row.gym_address,
                    lat: row.gym_lat,
                    lng: row.gym_lng
                }
            } : undefined
        };

        res.status(200).json(formattedUser);

    } catch (err) {
        if (active_transaction)
            await dbutils.run("ROLLBACK");

        const errMsg = err.message || "";

        if (errMsg.includes("UNIQUE constraint failed: Atleti.username")) {
            return res.status(409).json({ success: false, message: "Username is already used" });
        }

        if (errMsg.includes("UNIQUE constraint failed: Atleti.email")) {
            return res.status(409).json({ success: false, message: "Email is already used" });
        }

        if (errMsg.includes("CHECK constraint failed")) {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }

        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Error during profile update" });
    }
}

async function changePassword(req, res) {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "Token expired or not provided"
            });
        }

        const { oldPass, newPass } = req.body;

        if (!oldPass || !newPass || oldPass.trim() === '' || newPass.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Input invalid"
            });
        }

        if (oldPass.length < global.min_password_length || oldPass.length > global.max_password_length) {
            return res.status(400).json({
                success: false,
                message: `Old password must be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        if (newPass.length < global.min_password_length || newPass.length > global.max_password_length) {
            return res.status(400).json({
                success: false,
                message: `New password must be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        const dbPass = await dbutils.get(
            "SELECT password FROM Atleti WHERE id = ?",
            [userId]
        );

        if (!(await bcrypt.compareSync(oldPass, dbPass.password))) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct"
            });
        }

        const pHash = await bcrypt.hash(newPass, global.rounds);

        await dbutils.run(
            "UPDATE Atleti SET password = ? WHERE id = ?",
            [pHash, userId]
        );

        res.status(200).json({
            success: true,
            message: "Password changed!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error: " + err.message
        });
    }
}

async function follows(req, res) {
    try {
        const { profileId, otherId } = req.body;

        const row = await dbutils.get(
            "SELECT * FROM Follow WHERE id_follower = ? AND id_followed = ?",
            [profileId, otherId]
        );

        res.json(row ? true : false);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve information"
        })
    }
}

async function saveSession(req, res) {
    try {
        const {session, profileId} = req.body;
        await dbutils.run('BEGIN TRANSACTION');
        await dbutils.run(
            "INSERT INTO Sessioni (id_creatore, nome, data_svolgimento, xp) VALUES (?, ?, ?, ?)",
            [profileId, session.nome, session.dataSvolgimento, session.xp]
        );
        console.log("Pippo");
        
        const result = await dbutils.all("SELECT last_insert_rowid() AS lastId");
        sessionId = result[0].lastId;

        console.log(sessionId);

        for (serie of session.exercises) {
            await dbutils.run(
                "INSERT INTO SessioniEsercizi (peso, ripetizioni, recupero, id_sessione, id_esercizio) VALUES (?, ?, ?, ?, ?)",
                [serie.weight, serie.reps, serie.recovery, sessionId, serie.exerciseId]
            );
        }
        await dbutils.run('COMMIT');
        res.json({
            success: true,
            message: "Saved Session!"
        });
    } catch (err) {
        console.log(err);
        await dbutils.run('ROLLBACK');
        res.status(500).json({
            success: false,
            message: "Couldn't save session"
        })
    }
}

module.exports = {
    update,
    changePassword,
    follows,
    saveSession
}
const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const updateUserRank = require('../utils/updateUserRank.util');
const fs = require('fs').promises;
const path = require('path');

// presa da https://github.com/angular/angular/blob/main/packages/forms/src/validators.ts
const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

async function update(req, res) {
    const user = req.body.user ? JSON.parse(req.body.user) : null;
    const profileId = req.user.userId;
    const file = req.file;

    let active_transaction = false;
    if (!user || !profileId) {
        return res.status(400).json({
            success: false,
            message: "Data unavailable"
        });
    }

    if (
        !user.username ||
        !user.email ||
        !user.weight ||
        !user.height ||
        user.username.trim() === '' ||
        user.email.trim() === ''
    ) {
        return res.status(400).json({
            success: false,
            message: "Input not valid"
        });
    }

    if (user.username.length < global.min_username_length || user.username.length > global.max_username_length) {
        return res.status(400).json({
            success: false,
            message: `Username should be ${global.min_username_length}-${global.max_username_length} characters long`
        });
    }

    if (!user.email.match(emailRegex)) {
        return res.status(400).json({
            success: false,
            message: "Email format is not valid, please insert a correct one"
        });
    }

    if (user.weight < global.min_weight_value || user.weight > global.max_weight_value) {
        return res.status(400).json({
            success: false,
            message: `Weight should be in ${global.min_weight_value}-${global.max_weight_value} range`
        });
    }
    
    if (user.height < global.min_height_value || user.height > global.max_height_value) {
        return res.status(400).json({
            success: false,
            message: `Height should be in ${global.min_height_value}-${global.max_heigth_value} range`
        });
    }

    try {

        const tmp = await dbutils.get("SELECT nome, cognome, data_nascita, id_nazione, verificato FROM Atleti WHERE id = ?", [profileId]);
        const verified = tmp.verificato === 1 ? true : false;
        
        if (verified && (
            (!user.name && !tmp.nome) ||
            (!user.surname && !tmp.cognome) ||
            (!user.birthdate && !tmp.data_nascita) ||
            (!user.nationality && !tmp.id_nazione)
        )) {
            return res.status(400).json({
                success: false,
                message: "You have a verified account: Name, Surname, Birthdate and Nationality are mandatory"
            });
        }

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
                user.name || null, 
                user.surname || null, 
                user.weight, 
                user.height,
                user.birthdate || null,
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
            console.log(fileName);
            const filePath = path.join(config.avatarDir, fileName);
            console.log(filePath, "-", config.avatarDir);
            await fs.writeFile(filePath, file.buffer);
            console.log(file.buffer);
            
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
        res.status(500).json({ success: false, message: "Error during profile update" + err });
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

        if (await bcrypt.compareSync(newPass, dbPass.password)) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old one"
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not change password"
        });
    }
}

async function follows(req, res) {
    try {
        const profileId = req.user.userId;
        const { otherId } = req.body;

        const row = await dbutils.get(
            "SELECT * FROM Follow WHERE id_follower = ? AND id_followed = ?",
            [profileId, otherId]
        );

        res.json(row ? true : false);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve follow information"
        })
    }
}

async function saveSession(req, res) {
    let active_transaction = false;
    try {
        const {session, xp} = req.body;
        const profileId = req.user.userId;
        await dbutils.run('BEGIN TRANSACTION');
        active_transaction = true;

        await dbutils.run(
            "INSERT INTO Sessioni (id_creatore, nome, data_svolgimento, xp) VALUES (?, ?, ?, ?)",
            [profileId, session.nome, session.dataSvolgimento, xp]
        );
        
        const result = await dbutils.all("SELECT last_insert_rowid() AS lastId");
        sessionId = result[0].lastId;

        for (serie of session.exercises) {
            await dbutils.run(
                "INSERT INTO SessioniEsercizi (peso, ripetizioni, recupero, id_sessione, id_esercizio, valida) VALUES (?, ?, ?, ?, ?, ?)",
                [serie.weight, serie.reps, serie.recovery, sessionId, serie.exerciseId, serie.valid ? 1 : 0]
            );
        }

        await updateUserRank(profileId, xp, true);

        await dbutils.run('COMMIT');
        active_transaction = false;
        res.json({
            success: true,
            message: "Saved Session!"
        });
    } catch (err) {
        console.error(err);
        if (active_transaction)
            await dbutils.run('ROLLBACK');
        res.status(500).json({
            success: false,
            message: "Couldn't save session"
        })
    }
}

async function removeSession(req, res) {
    const { id } = req.body;
    const userId = req.user.userId;
    let active_transaction = false;

    try {

        const xpsRow = await dbutils.get(
            "SELECT xp, pubblica, stagione_valida FROM Sessioni WHERE id = ? AND id_creatore = ?",
            [id, userId]
        );

        if (!xpsRow) {
            return res.status(404).json({
                success: false,
                message: "Could not find session"
            });
        }

        const seasonal_valid = (xpsRow.stagione_valida === 1) ? true : false;
        const public = xpsRow.pubblica;
        const xps = (public) ? xpsRow.xp : 0;

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "DELETE FROM Sessioni WHERE id = ? AND id_creatore = ?",
            [id, userId]
        );

        if (xps != 0)
            await updateUserRank(userId, -xps, seasonal_valid);

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(200).json({removed: true});
    } catch(err) {
        if (active_transaction)
            await dbutils.run("ROLLBACK");

        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error deleting session"
        })
    }
}

async function updateSessionVisibility(req, res) {
    const { sessionId, visibility } = req.body;
    const userId = req.user.userId;
    let active_transaction = false;
    
    try {
        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        const sessionXpRow = await dbutils.get(
            "UPDATE Sessioni SET pubblica = ? WHERE id = ? AND id_creatore = ? RETURNING xp, stagione_valida",
            [visibility ? 1 : 0, sessionId, userId]
        );
        const seasonal_valid = (sessionXpRow.stagione_valida === 1) ? true : false;
        const sessionXps = sessionXpRow.xp;

        await updateUserRank(userId, (visibility) ? sessionXps : -sessionXps, seasonal_valid);

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({updated: true});
    } catch(err) {
        console.error(err);
        
        if (active_transaction)
            await dbutils.run("ROLLBACK");

        res.status(500).json({
            success: false,
            message: "Error updating session's visibility"
        })
    }
}

async function alreadyReported(reporter, reportee) {
    try {
        const row = await dbutils.get(
            "SELECT id FROM Segnalazioni WHERE id_segnalante = ? AND id_segnalato = ? AND id_moderatore IS NULL",
            [reporter, reportee]
        );
        return !!row;
    } catch(err) {
        console.error("Database error in alreadyReported:", err);
        throw err;
    }
}

async function reportUser(req, res) {
    let active_transaction = false;
    try {
        const { reportee, reason } = req.body;
        const profileId = req.user.userId;

        if (!reportee || !reason || isNaN(reportee) || reason.trim() === '') {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        const already = await alreadyReported(profileId, reportee);
        if (already) {
            return res.status(200).json({ reported: false, message: "User already reported" });
        }

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "INSERT INTO Segnalazioni (id_segnalante, id_segnalato, timestamp_creazione, motivazione) VALUES (?, ?, ?, ?)",
            [profileId, reportee, Date.now(), reason]
        );

        await dbutils.run("COMMIT");
        active_transaction = false;

        return res.status(201).json({ reported: true });

    } catch (err) {
        if (active_transaction) await dbutils.run("ROLLBACK");
        console.error("Error in reportUser:", err);
        return res.status(500).json({ success: false, message: "Could not report user" });
    }
}

async function isAreadyReported(req, res) {
    try {
        const {reportee} = req.body;
        
        if (!reportee || isNaN(reportee)) {
            return res.status(400).json({ success: false, message: "Invalid reportee id" });
        }

        const profileId = req.user.userId;
        const reported = await alreadyReported(profileId, reportee);
        
        return res.status(200).json(reported);
    } catch(err) {
        console.error("Error in isAreadyReported:", err);
        return res.status(500).json({ success: false, message: "Could not retrieve report info" });
    }
}

async function requestPending(id) {
    try {
        const row = await dbutils.get(
            "SELECT id FROM Richieste WHERE id_richiedente = ? AND id_moderatore IS NULL",
            [id]
        );
        return !!row;
    } catch(err) {
        console.error("Database error in requestPresent:", err);
        throw err;
    }
}

async function satisfiesConditions(id) {
    try {
        const row = await dbutils.get(
            "SELECT numero_followers, numero_sessioni, data_nascita FROM Atleti WHERE id = ?",
            [id]
        );
        if (!row) {
            return false;
        }
        const followers = row.numero_followers;
        const sessions = row.numero_sessioni;
        const birthdate = row.data_nascita;

        if (birthdate) return false;
      
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
    
        return (
            age >= global.verify_min_age && 
            followers >= global.verify_min_followers && 
            sessions >= global.verify_min_sessions
        );
    } catch(err) {
        console.error("Database error in requestPresent:", err);
        throw err;
    }
}

async function newRequest(req, res) {
    let active_transaction = false;
    try {
        const profileId = req.user.userId;
        
        const pending = await requestPending(profileId);
        if (pending) {
            return res.status(200).json({
                requested: false,
                message: "A request already exists"
            });
        }

        const satisfies = await satisfiesConditions(profileId);
        if (!satisfies) {
            return res.status(403).json({
                requested: false,
                message: `You must have at least ${global.verify_min_age} years, ${global.verify_min_followers} followers and ${global.verify_min_sessions} sessions`
            });
        }

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "INSERT INTO Richieste (id_richiedente, timestamp_creazione) VALUES (?, ?)",
            [profileId, Date.now()]
        );

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({requested: true});

    } catch(err) {
        console.error(err);
        if (active_transaction)
            await dbutils.run("ROLLBACK");
        res.status(500).json({
            success: false,
            message: "Could not create a new request"
        })
    }
}

module.exports = {
    update,
    changePassword,
    follows,
    saveSession,
    removeSession,
    updateSessionVisibility,
    reportUser,
    isAreadyReported,
    newRequest
}
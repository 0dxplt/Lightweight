const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

async function update(req, res) {
    const { user, profileId } = req.body;
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
                id_nazione = ?
            WHERE id = ?`,
            [
                user.username, 
                user.email, 
                user.name, 
                user.surname, 
                user.weight, 
                user.height, 
                user.nationality?.id || null,
                profileId
            ]
        );

        if (user.pt) {
            await dbutils.run(
                `UPDATE PersonalTrainers SET 
                    email_professionale = ?, 
                    id_citta = ?, 
                    id_palestra = ? 
                WHERE id = ?`,
                [
                    user.pt.proEmail, 
                    user.pt.city?.id, 
                    user.pt.gym?.id, 
                    profileId
                ]
            );
        }

        await dbutils.run("COMMIT");

        active_transaction = false;

        const row = await dbutils.get(
            `SELECT 
                A.*, 
                N1.nome AS nation_name, N1.shortform AS nation_short, N1.flag AS nation_flag,
                PT.email_professionale,
                C.id AS city_id, C.nome AS city_name,
                N2.id AS city_nation_id, N2.nome AS city_nation_name, N2.shortform AS city_nation_short, N2.flag AS city_nation_flag,
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

        const formattedUser = {
            id: row.id,
            username: row.username,
            name: row.nome,
            surname: row.cognome,
            email: row.email,
            birthdate: row.data_nascita,
            propic: row.img,
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
            return res.status(409).json({
                success: false,
                message: "Username is already used"
            });
        }
        
        if (errMsg.includes("UNIQUE constraint failed: Atleti.email")) {
            return res.status(409).json({
                success: false,
                message: "Email is already used"
            });
        }

        if (errMsg.includes("CHECK constraint failed")) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        console.error("Update Error:", err);
        res.status(500).json({
            success: false,
            message: "Error during profile update"
        });
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
    } catch(err) {
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

    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve information"
        })
    }
}

module.exports = {
    update,
    changePassword,
    follows
}
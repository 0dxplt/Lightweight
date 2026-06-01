const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

async function retrieveUser(username) {
    try {
        const dbUser = await dbutils.get(`
            SELECT a.*, 
                   n.id as n_id, n.nome as n_nome, n.country_code as n_cc, n.bandiera as n_f
            FROM Atleti a
            LEFT JOIN Nazioni n ON a.id_nazione = n.id
            WHERE a.username = ?`, [username]);

        if (!dbUser) return null;

        const dbPt = await dbutils.get(`
            SELECT pt.email_professionale,
                   c.id as c_id, c.nome as c_nome,
                   cn.id as cn_id, cn.nome as cn_nome, cn.country_code as cn_cc, cn.bandiera as cn_f,
                   p.id as g_id, p.nome as g_nome, p.indirizzo as g_addr, p.lat as g_lat, p.lng as g_lng
            FROM PersonalTrainers pt
            LEFT JOIN Citta c ON pt.id_citta = c.id
            LEFT JOIN Nazioni cn ON c.id_nazione = cn.id
            LEFT JOIN Palestre p ON pt.id_palestra = p.id
            WHERE pt.id = ?`, [dbUser.id]);

        const user = {
            id: dbUser.id,
            username: dbUser.username,
            name: dbUser.nome || undefined,
            surname: dbUser.cognome || undefined,
            email: dbUser.email,
            birthdate: dbUser.data_nascita ? dbUser.data_nascita : undefined,
            propic: dbUser.img || undefined,
            weight: dbUser.weight,
            height: dbUser.height,
            
            nationality: dbUser.n_id ? {
                id: dbUser.n_id,
                name: dbUser.n_nome,
                shortform: dbUser.n_cc,
                flag: dbUser.n_f
            } : undefined,

            sLevel: dbUser.livello_stagionale,
            gLevel: dbUser.livello_globale,
            sxp: dbUser.xp_stagionali,
            gxp: dbUser.xp_globali,
            followers: dbUser.numero_followers,
            following: dbUser.numero_followed,
            sessions: dbUser.numero_sessioni,
            verified: dbUser.verificato === 1,

            pt: dbPt ? {
                proEmail: dbPt.email_professionale,
                city: {
                    id: dbPt.c_id,
                    name: dbPt.c_nome,
                    nation: {
                        id: dbPt.cn_id,
                        name: dbPt.cn_nome,
                        shortform: dbPt.cn_cc,
                        flag: dbPt.cn_f
                    }
                },
                gym: {
                    id: dbPt.g_id,
                    name: dbPt.g_nome,
                    address: dbPt.g_addr,
                    lat: dbPt.g_lat || undefined,
                    lng: dbPt.g_lng || undefined
                }
            } : undefined
        };

        return user;
    } catch (error) {
        console.error("Error in retrieveUser:", error);
        throw error;
    }
}

async function getUser(req, res) {
    try {
        const username = req.params.username;
        if (!username || username.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Username not valid"
            });
        }

        if (username.length < global.min_username_length || username.length > global.max_username_length) {
            return res.status(400).json({
                success: false,
                message: `Username mus be ${global.min_username_length}-${global.max_username_length} characters long`
            });
        }

        const user = await retrieveUser(username);

        const filepath = config.avatarDir + "/" + user.id + ".png";
        if (fs.existsSync(filepath))
            user.propic = user.id + ".png";

        delete user.password;

        res.status(200).json(user);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve user"
        })
    }
}

async function getFollowers(req, res) {
    try {
        const username = req.params.username;
        if (!username || username.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Username not valid"
            });
        }

        if (username.length < global.min_username_length || username.length > global.max_username_length) {
            return res.status(400).json({
                success: false,
                message: `Username mus be ${global.min_username_length}-${global.max_username_length} characters long`
            });
        }

        const row = await dbutils.get("SELECT id FROM Atleti WHERE username = ?", [username]);
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Could not find user"
            });
        }
        const userId = row.id;

        const followers = await dbutils.all(
            "SELECT * FROM Follow WHERE id_followed = ?",
            [userId]
        );

        const users = [];

        for (let follower of followers) {
            const followerId = follower.id_follower;
            const user = await dbutils.get(
                "SELECT * FROM Atleti WHERE id = ?",
                [followerId]
            );
            
            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "Error retrieving followers"
                });
            }

            if (user.id_nazione) {
                const nazione = await dbutils.get(
                    "SELECT id, nome AS 'name', country_code AS 'shortform', bandiera AS 'flag' FROM Nazioni WHERE id = ?",
                    [user.id_nazione]
                );
                user.nazione = nazione;
            }

            const query = `
                SELECT 
                    PT.email_professionale AS proEmail,
                    C.id AS city_id,
                    C.nome AS city_name,
                    N.id AS nation_id,
                    N.nome AS nation_name,
                    N.country_code AS nation_shortform,
                    N.bandiera AS nation_flag,
                    P.id AS gym_id,
                    P.nome AS gym_name,
                    P.indirizzo AS gym_address,
                    P.lat AS gym_lat,
                    P.lng AS gym_lng
                FROM PersonalTrainers PT
                JOIN Citta C ON PT.id_citta = C.id
                JOIN Nazioni N ON C.id_nazione = N.id
                JOIN Palestre P ON PT.id_palestra = P.id
                WHERE PT.id = ?
            `;

            const row = await dbutils.get(query, [user.id]);

            if (row) {
                const pt = {
                    proEmail: row.proEmail,
                    city: {
                        id: row.city_id,
                        name: row.city_name,
                        nation: {
                            id: row.nation_id,
                            name: row.nation_name,
                            shortform: row.nation_shortform,
                            flag: row.nation_flag
                        }
                    },
                    gym: {
                        id: row.gym_id,
                        name: row.gym_name,
                        address: row.gym_address,
                        lat: row.gym_lat,
                        lng: row.gym_lng
                    }
                };
                user.pt = pt;
            }

            const filepath = config.avatarDir + "/" + user.id + ".png";
            if (fs.existsSync(filepath))
                user.propic = user.id + ".png";

            delete user.password;

            users.push(user);
        }

        res.status(200).json(users);

    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve followers"
        })
    }
}

async function getFollowings(req, res) {
    try {
        const username = req.params.username;
        if (!username || username.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Username not valid"
            });
        }

        if (username.length < global.min_username_length || username.length > global.max_username_length) {
            return res.status(400).json({
                success: false,
                message: `Username mus be ${global.min_username_length}-${global.max_username_length} characters long`
            });
        }

        const row = await dbutils.get("SELECT id FROM Atleti WHERE username = ?", [username]);
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Could not find user"
            });
        }
        const userId = row.id;

        const following = await dbutils.all(
            "SELECT * FROM Follow WHERE id_follower = ?",
            [userId]
        );

        const users = [];

        for (let followed of following) {
            const followerId = followed.id_followed;
            const user = await dbutils.get(
                "SELECT * FROM Atleti WHERE id = ?",
                [followerId]
            );
            
            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "Error retrieving following"
                });
            }

            if (user.id_nazione) {
                const nazione = await dbutils.get(
                    "SELECT id, nome AS 'name', country_code AS 'shortform', bandiera AS 'flag' FROM Nazioni WHERE id = ?",
                    [user.id_nazione]
                );
                user.nazione = nazione;
            }

            const query = `
                SELECT 
                    PT.email_professionale AS proEmail,
                    C.id AS city_id,
                    C.nome AS city_name,
                    N.id AS nation_id,
                    N.nome AS nation_name,
                    N.country_code AS nation_shortform,
                    N.bandiera AS nation_flag,
                    P.id AS gym_id,
                    P.nome AS gym_name,
                    P.indirizzo AS gym_address,
                    P.lat AS gym_lat,
                    P.lng AS gym_lng
                FROM PersonalTrainers PT
                JOIN Citta C ON PT.id_citta = C.id
                JOIN Nazioni N ON C.id_nazione = N.id
                JOIN Palestre P ON PT.id_palestra = P.id
                WHERE PT.id = ?
            `;

            const row = await dbutils.get(query, [user.id]);

            if (row) {
                const pt = {
                    proEmail: row.proEmail,
                    city: {
                        id: row.city_id,
                        name: row.city_name,
                        nation: {
                            id: row.nation_id,
                            name: row.nation_name,
                            shortform: row.nation_shortform,
                            flag: row.nation_flag
                        }
                    },
                    gym: {
                        id: row.gym_id,
                        name: row.gym_name,
                        address: row.gym_address,
                        lat: row.gym_lat,
                        lng: row.gym_lng
                    }
                };
                user.pt = pt;
            }

            const filepath = config.avatarDir + "/" + user.id + ".png";
            if (fs.existsSync(filepath))
                user.propic = user.id + ".png";

            delete user.password;

            users.push(user);
        }

        res.status(200).json(users);

    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve followers"
        })
    }
}

async function follow(req, res) {
    try {
        const follower = req.params.followerId;
        const other = req.params.otherId;

        if (isNaN(follower) || isNaN(other)) {
            return res.status(400).json({
                success: false,
                message: "Ids not provided"
            });
        }

        const row = await dbutils.get(
            "SELECT * FROM Follow WHERE id_follower = ? AND id_followed = ?",
            [follower, other]
        );

        if (row) {
            return res.sendStatus(304);
        }

        await dbutils.run("BEGIN TRANSACTION");

        await dbutils.run(
            "INSERT INTO Follow (id_follower, id_followed) VALUES (?, ?)",
            [follower, other]
        );

        await dbutils.run(
            "UPDATE Atleti SET numero_followed = (numero_followed + 1) WHERE id = ?",
            [follower]
        );

        await dbutils.run(
            "UPDATE Atleti SET numero_followers = (numero_followers + 1) WHERE id = ?",
            [other]
        );

        await dbutils.run("COMMIT");

        res.status(200).json({followed: true});

    } catch(err) {
        await dbutils.run("ROLLBACK");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Could not follow user"
        })
    }
}

async function unfollow(req, res) {
    try {
        const follower = req.params.followerId;
        const other = req.params.otherId;

        if (isNaN(follower) || isNaN(other)) {
            return res.status(400).json({
                success: false,
                message: "Ids not provided"
            });
        }

        const row = await dbutils.get(
            "SELECT * FROM Follow WHERE id_follower = ? AND id_followed = ?",
            [follower, other]
        );

        if (!row) {
            return res.sendStatus(304);
        }

        await dbutils.run("BEGIN TRANSACTION");

        await dbutils.run(
            "DELETE FROM Follow WHERE id = ?",
            [row.id]
        );

        await dbutils.run(
            "UPDATE Atleti SET numero_followed = (numero_followed - 1) WHERE id = ?",
            [follower]
        );

        await dbutils.run(
            "UPDATE Atleti SET numero_followers = (numero_followers - 1) WHERE id = ?",
            [other]
        );

        await dbutils.run("COMMIT");

        res.status(200).json({unfollowed: true});

    } catch(err) {
        await dbutils.run("ROLLBACK");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Could not follow user"
        })
    }
}

module.exports = {
    getUser,
    getFollowers,
    getFollowings,
    follow,
    unfollow,
}
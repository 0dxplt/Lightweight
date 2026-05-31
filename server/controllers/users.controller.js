const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

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

        const user = await dbutils.get(
            "SELECT * FROM Atleti WHERE Atleti.username = ?",
            [username]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Username not found"
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

module.exports = {
    changePassword,
    getUser,
    getFollowers,
    getFollowings
}
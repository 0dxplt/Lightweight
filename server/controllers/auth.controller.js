const dbutils = require('../db/database.utils');
const bcrypt = require('bcrypt');
const global = require('../config/global');
const config = require('../config/env');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Input not valid"
            });
        }

        if (!email.match(emailRegex)) {
            return res.status(400).json({
                success: false,
                message: "Email format is not valid, please insert a correct one"
            });
        }

        if (password.length < global.min_password_length || password.length > global.max_password_length) {
            return res.status(500).json({
                success: false,
                message: `Password should be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        const user = await dbutils.get(`SELECT * FROM Atleti WHERE Atleti.email = ?`, [email]);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Account not found"
            });
        }

        if  (!(await bcrypt.compare(password, user.password))) {
            return res.status(500).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign({
            userId: user.id,
            role: 'user'
        }, config.jwtSecret);

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

        res.status(200).json({
            success: true,
            message: "Logged succesfully!",
            user: user,
            token: token
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not authenticate the user"
        })
    }
}

async function register(req, res) {
    try {
        const { username, email, password, weight, height } = req.body;

        if (
            !username ||
            !email ||
            !password ||
            !weight ||
            !height ||
            username.trim() === '' ||
            email.trim() === '' ||
            password.trim() === ''
        ) {
            return res.status(400).json({
                success: false,
                message: "Input not valid"
            });
        }

        if (username.length < global.min_username_length || username.length > global.max_username_length) {
            return res.status(400).json({
                success: false,
                message: `Username should be ${global.min_username_length}-${global.max_username_length} characters long`
            });
        }

        if (!email.match(emailRegex)) {
            return res.status(400).json({
                success: false,
                message: "Email format is not valid, please insert a correct one"
            });
        }

        if (password.length < global.min_password_length || password.length > global.max_password_length) {
            return res.status(400).json({
                success: false,
                message: `Password should be ${global.min_password_length}-${global.max_password_length} characters long`
            });
        }

        if (weight < global.min_weight_value || weight > global.max_weight_value) {
            return res.status(400).json({
                success: false,
                message: `Weight should be in ${global.min_weight_value}-${global.max_weight_value} range`
            });
        }
        
        if (height < global.min_height_value || height > global.max_height_value) {
            return res.status(400).json({
                success: false,
                message: `Height should be in ${global.min_height_value}-${global.max_heigth_value} range`
            });
        }

        const pHash = await bcrypt.hash(password, global.rounds);

        const rows = await dbutils.all(
            "SELECT * FROM Atleti WHERE Atleti.username = ? OR Atleti.email = ?",
            [username, email]
        );

        if (rows && rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username or email are alredy used"
            });
        }

        await dbutils.run(
            "INSERT INTO Atleti (username, email, password, weight, height) VALUES (?, ?, ?, ?, ?)",
            [username, email, pHash, weight, height]
        );

        res.status(201).json({
            success: true,
            message: "Signed In!"
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not register user"
        })
    }
}

async function modLogin(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Input not valid"
            });
        }

        if (username.length < global.min_mod_username_length || username.length > global.max_mod_username_length) {
            return res.status(400).json({
                success: false,
                message: `Username should be ${global.min_mod_username_length}-${global.max_mod_username_length} characters long`
            });
        }

        if (!email.match(emailRegex)) {
            return res.status(400).json({
                success: false,
                message: "Email format is not valid, please insert a correct one"
            });
        }

        if (password.length < global.min_mod_password_length || password.length > global.max_mod_password_length) {
            return res.status(500).json({
                success: false,
                message: `Password should be ${global.min_mod_password_length}-${global.max_mod_password_length} characters long`
            });
        }

        const moderator = await dbutils.get(`SELECT * FROM Moderatori WHERE email = ?`, [email]);
        if (!moderator) {
            return res.status(404).json({
                success: false,
                message: "Moderator account not found"
            });
        }

        if  (!(await bcrypt.compare(password, moderator.password))) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign({
            userId: moderator.id,
            role: 'mod'
        }, config.jwtSecret);

        delete moderator.password;

        res.status(200).json({
            success: true,
            message: "Moderator logged in!",
            token: token,
            moderator: moderator
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not login in as a Moderator"
        })
    }
}

module.exports = {
    login,
    register,
    modLogin
}
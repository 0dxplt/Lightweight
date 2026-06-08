const dbutils = require('../db/database.utils');

async function getGlobalRankings(req, res) {
    try {
        const rows = await dbutils.all(
            `SELECT
                A.livello_globale AS level,
                A.img AS avatar,
                A.username,
                PT.id AS pt_id
            FROM Atleti A
            LEFT JOIN PersonalTrainers PT ON A.id = PT.id
            WHERE A.verificato = 1
            ORDER BY A.livello_globale DESC
            LIMIT 200`
        );

        const rankings = rows.map((row, index) => ({
            rank: index + 1,
            level: row.level,
            avatar: row.avatar,
            username: row.username,
            pt: !!row.pt_id
        }));

        res.status(200).json(rankings);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve global rankings"
        })
    }
}

async function getSeasonalRankings(req, res) {
    try {
        const rows = await dbutils.all(
            `SELECT
                A.livello_stagionale AS level,
                A.img AS avatar,
                A.username,
                PT.id AS pt_id
            FROM Atleti A
            LEFT JOIN PersonalTrainers PT ON A.id = PT.id
            WHERE A.verificato = 1
            ORDER BY A.livello_stagionale DESC
            LIMIT 200`
        );

        const rankings = rows.map((row, index) => ({
            rank: index + 1,
            level: row.level,
            avatar: row.avatar,
            username: row.username,
            pt: !!row.pt_id
        }));

        res.status(200).json(rankings);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve seasonal rankings"
        })
    }
}

module.exports = {
    getGlobalRankings,
    getSeasonalRankings
}
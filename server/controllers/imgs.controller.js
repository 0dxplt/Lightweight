const dbutils = require('../db/database.utils');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

async function getAvatar(req, res) {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(404).json(null);
        }

        const dir = config.avatarDir;
        const avatar = userId + ".png";

        const filePath = path.resolve(dir, avatar);

        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }

        res.json(null);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error retrieving avatar"
        });
    }
}

async function getGlobalLevelIcon(req, res) {
    const level = req.params.level;

    const dir = config.globalIconDir;

    const levelsRanges = [
        {
            floor: 50,
            fileName: `50.png`
        },
        {
            floor: 100,
            fileName: `100.png`
        },
        {
            floor: 150,
            fileName: `150.png`
        },
        {
            floor: 200,
            fileName: `200.png`
        }
    ];

    let fileName = "0.png";
    for (let k of levelsRanges) {
        if (level >= k.floor)
            fileName = k.fileName
        else
            break;
    }

    const filePath = path.resolve(dir, fileName);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    res.status(404).json({ message: "Icon Not Found" });
}

async function getSeasonalLevelIcon(req, res) {
    try {
        const profileId = req.params.profileId;

        const rows = await dbutils.get(`
            SELECT img_url as url,
            rank_name as rankName
            FROM SeasonalRankInfo
            JOIN Atleti ON SeasonalRankInfo.id = Atleti.livello_stagionale
            WHERE Atleti.id = ?
            `, [profileId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Errore nel trovare il livello stagionale"});
    }
}

async function getSeasonalLevelIconFromUsername(req, res) {
    try {
        const profileUsername = req.params.profileUsername;

        const row = await dbutils.get(`
            SELECT img_url as url
            FROM SeasonalRankInfo
            JOIN Atleti ON SeasonalRankInfo.id = Atleti.livello_stagionale
            WHERE Atleti.username = ?
            `, [profileUsername]);
        res.json(row.url);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Errore nel trovare il livello stagionale"});
    }
}

module.exports = {
    getAvatar,
    getGlobalLevelIcon,
    getSeasonalLevelIcon,
    getSeasonalLevelIconFromUsername
}
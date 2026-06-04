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
        res.status(500).json({
            success: false,
            message: "Error: " + err.message
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
            floor: 250,
            fileName: `250.png`
        },
        {
            floor: 500,
            fileName: `500.png`
        },
        {
            floor: 1000,
            fileName: `1000.png`
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
            SELECT img_url,
            rank_name
            FROM SeasonalRankInfo
            JOIN Atleti ON SeasonalRankInfo.id = Atleti.livello_stagionale
            WHERE Atleti.id = ?
            `, [profileId]);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        res.status(500).json({message: "Errore nel trovare il livello stagionale"});
        console.log(error);
    }
}

module.exports = {
    getAvatar,
    getGlobalLevelIcon,
    getSeasonalLevelIcon
}
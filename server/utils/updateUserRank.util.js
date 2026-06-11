const dbutils = require('../db/database.utils');
const global = require('../config/global');

async function updateUserRank(userId, deltaXp, useSeasonalXps) {
    const sXps = (useSeasonalXps) ? deltaXp : 0;
    try {
        await dbutils.run(`
            UPDATE Atleti
            SET xp_stagionali = xp_stagionali + ?,
                xp_globali = xp_globali + ?
            WHERE id = ?`,
            [sXps, deltaXp, userId]
        );

        // Global Level
        await dbutils.run(`
            UPDATE Atleti
            SET livello_globale = max(floor(xp_globali / ?), 0)
            WHERE id = ?`,
            [global.global_level_step, userId]
        );

        const xp = await dbutils.get(`
            SELECT xp_stagionali
            FROM Atleti WHERE id = ?`,
            [userId]
        );
        const xp_stagionali = xp.xp_stagionali < 0 ? 0 : (xp.xp_stagionali ?? 0);

        // Seasonal Rank
        const seasonInfoRow = await dbutils.get(
            `SELECT id
            FROM SeasonalRankInfo
            WHERE (? BETWEEN start AND end) OR (? >= start AND end IS NULL)`,
            [xp_stagionali, xp_stagionali]
        );
        
        if (!seasonInfoRow)
            throw new Error('Error during profile update');

        const id = seasonInfoRow.id;

        await dbutils.run(
            "UPDATE Atleti SET livello_stagionale = ? WHERE id = ?",
            [id, userId]
        );
    } catch(err) {
        throw err;
    }
}

module.exports = updateUserRank;
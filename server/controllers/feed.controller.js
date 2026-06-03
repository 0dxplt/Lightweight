const dbutils = require('../db/database.utils');

async function getUserFeed(req, res) {
    try {
        const profileId = req.user.userId;
        const rows = await dbutils.all(`
            SELECT Atleti.username,
            Atleti.img AS avatarUrl,
            Atleti.verificato AS verified,
            Sessioni.nome AS sessionName,
            Sessioni.id AS sessionId,
            Sessioni.xp AS gainedXP,
            CASE WHEN PersonalTrainers.id IS NOT NULL THEN 1 ELSE 0 END AS pt,
            json_group_array(GruppiMuscolari.nome) AS tags
            FROM Follow
            JOIN Atleti ON Follow.id_followed = Atleti.id
            JOIN Sessioni On Sessioni.id_creatore = Atleti.id
            JOIN SessioniEsercizi ON Sessioni.id = SessioniEsercizi.id_sessione
            JOIN Esercizi ON SessioniEsercizi.id_esercizio = Esercizi.id
            JOIN EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio
            JOIN GruppiMuscolari ON EserciziGruppiMuscolari.id_gruppo_muscolare = GruppiMuscolari.id
            LEFT JOIN PersonalTrainers ON Atleti.id = PersonalTrainers.id
            WHERE Follow.id_follower = ? AND Sessioni.data_svolgimento >= ? AND Sessioni.pubblica = 1
            GROUP BY Sessioni.id
            ORDER BY Sessioni.data_svolgimento DESC
            `, [profileId, Date.now() - 86400000]);
        res.json(rows);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    getUserFeed
}
const dbutils = require('../db/database.utils');

async function getAllFullSessions(req, res) {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || userId === -1) {
        return res.status(400).json({
            success: false,
            message: "Invalid id"
        });
    }

    try {
        const dbUser = await dbutils.get(`
            SELECT a.*, n.id as n_id, n.nome as n_nome, n.country_code, n.bandiera
            FROM Atleti a
            LEFT JOIN Nazioni n ON a.id_nazione = n.id
            WHERE a.id = ?`, [userId]);

        if (!dbUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const dbPt = await dbutils.get(`
            SELECT pt.email_professionale,
                   c.id as c_id, c.nome as c_nome,
                   cn.id as cn_id, cn.nome as cn_nome, cn.country_code as cn_cc, cn.bandiera as cn_f,
                   p.id as g_id, p.nome as g_nome, p.indirizzo as g_addr, p.lat as g_lat, p.lng as g_lng
            FROM PersonalTrainers pt
            LEFT JOIN Citta c ON pt.id_citta = c.id
            LEFT JOIN Nazioni cn ON c.id_nazione = cn.id
            LEFT JOIN Palestre p ON pt.id_palestra = p.id
            WHERE pt.id = ?`, [userId]);

        const userMapping = {
            id: dbUser.id,
            username: dbUser.username,
            name: dbUser.nome || undefined,
            surname: dbUser.cognome || undefined,
            email: dbUser.email,
            birthdate: dbUser.data_nascita || undefined,
            propic: dbUser.img || undefined,
            weight: dbUser.weight,
            height: dbUser.height,
            nationality: dbUser.n_id ? {
                id: dbUser.n_id,
                name: dbUser.n_nome,
                shortform: dbUser.country_code,
                flag: dbUser.bandiera
            } : undefined,
            sLevel: dbUser.livello_stagionale,
            gLevel: dbUser.livello_globale,
            sxp: dbUser.xp_stagionali,
            gxp: dbUser.xp_globali,
            followers: dbUser.numero_followers,
            following: dbUser.numero_followed,
            sessions: dbUser.numero_sessioni,
            verified: Boolean(dbUser.verificato),
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
                    lat: dbPt.g_lat,
                    lng: dbPt.g_lng
                }
            } : undefined
        };

        const dbSessions = await dbutils.all(
            "SELECT * FROM Sessioni WHERE id_creatore = ? ORDER BY data_svolgimento DESC",
            [userId]
        );

        const fullSessions = [];

        for (let s of dbSessions) {
            const dbSessionExercises = await dbutils.all(`
                SELECT se.*, e.nome as e_nome, e.descrizione, e.img, e.difficolta
                FROM SessioniEsercizi se
                JOIN Esercizi e ON se.id_esercizio = e.id
                WHERE se.id_sessione = ?`, [s.id]);

            const mappedExercises = [];
            for (let se of dbSessionExercises) {
                const dbGroups = await dbutils.all(`
                    SELECT egm.perc, gm.id as gm_id, gm.nome as gm_nome
                    FROM EserciziGruppiMuscolari egm
                    JOIN GruppiMuscolari gm ON egm.id_gruppo_muscolare = gm.id
                    WHERE egm.id_esercizio = ?`, [se.id_esercizio]);

                mappedExercises.push({
                    id: se.id,
                    reps: se.ripetizioni,
                    weight: se.peso,
                    recovery: se.recupero,
                    valid: Boolean(se.valida),
                    exercise: {
                        id: se.id_esercizio,
                        name: se.e_nome,
                        desc: se.descrizione,
                        imgpath: se.img || undefined,
                        difficulty: se.difficolta,
                        groups: dbGroups.map(g => ({
                            perc: g.perc,
                            muscolarGroup: {
                                id: g.gm_id,
                                name: g.gm_nome
                            }
                        }))
                    }
                });
            }

            fullSessions.push({
                id: s.id,
                user: userMapping,
                name: s.nome,
                timestamp: s.data_svolgimento,
                shared: Boolean(s.pubblica),
                xp: s.xp,
                exercises: mappedExercises
            });
        }

        res.status(200).json(fullSessions);

    } catch (error) {
        console.error("Error in getAllFullSessions:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

async function getSingleSession(req, res) {
    try {
        const sessionId = req.params.id;

        const rows = await dbutils.all(`
        SELECT
        Sessioni.nome. AS nome_sessione,
        Sessioni.data_svolgimento,
        peso,
        ripetizioni,
        recupero,
        Esercizi.nome,
        Esercizi.id,
        Esercizi.descrizione,
        Esercizi.img,
        json_group_array(
                json_object(
                    'id', GruppiMuscolari.id,
                    'nome', GruppiMuscolari.nome,
                    'percentuale', EserciziGruppiMuscolari.perc
                )
            ) AS gruppi_muscolari
        FROM Sessioni
        JOIN SessioniEsercizi ON Sessioni.id = SessioniEsercizi.id_sessione
        JOIN Esercizi ON SessioniEsercizi.id_esercizio = Esercizi.id
        JOIN EserciziGruppiMuscolari ON Esercizi.id = EserciziGruppiMuscolari.id_esercizio
        JOIN GruppiMuscolari ON EserciziGruppiMuscolari.id_gruppo_muscolare = GruppiMuscolari.id
        WHERE Sessioni.id = ?
        GROUP BY SessioniEsercizi.id
        `, [sessionId]);

        res.json(rows);
    }
    catch (error) {
        console.error("Error in getSingleSession:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = {
    getAllFullSessions,
    getSingleSession
}
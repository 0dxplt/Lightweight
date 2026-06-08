const dbutils = require('../db/database.utils');

async function retrieveUser(id) {
    try {
        const dbUser = await dbutils.get(`
            SELECT a.*, 
                   n.id as n_id, n.nome as n_nome, n.country_code as n_cc, n.bandiera as n_f
            FROM Atleti a
            LEFT JOIN Nazioni n ON a.id_nazione = n.id
            WHERE a.id = ?`, [id]);

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
            WHERE pt.id = ?`, [id]);

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

async function counter(req, res) {
    try {
        const reports = await dbutils.all("SELECT * FROM Segnalazioni WHERE id_moderatore IS NOT NULL");
        const requests = await dbutils.all("SELECT * FROM Richieste WHERE id_moderatore IS NOT NULL");

        res.status(200).json(reports.length + requests.length);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve solveds' count"
        });
    }
}

async function getFullSolvedReports(req, res) {
    try {
        const all = await dbutils.all(
            "SELECT\
                Segnalazioni.*,\
                Moderatori.username AS 'username_moderatore', Moderatori.email AS 'email_moderatore'\
            FROM Segnalazioni\
            JOIN Moderatori ON Moderatori.id = Segnalazioni.id_moderatore\
            WHERE id_moderatore IS NOT NULL"
        );
        const solvedReports = [];
        for (let row of all) {
            const reporter = await retrieveUser(row.id_segnalante);
            const reportee = await retrieveUser(row.id_segnalato);
            const report = {
                id: row.id,
                moderator: {
                    id: row.id_moderatore,
                    username: row.username_moderatore,
                    email: row.email_moderatore
                },
                report: {
                    id: row.id,
                    reporter: reporter,
                    reportee: reportee,
                    timestamp: row.timestamp_creazione,
                    reason: row.motivazione
                },
                timestamp: row.timestamp_risoluzione,
                outcome: row.esito
            };
            solvedReports.push(report);
        }

        res.status(200).json(solvedReports);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve solved reports"
        });
    }
}

async function getFullSolvedRequests(req, res) {
    try {
        const all = await dbutils.all("SELECT Richieste.*, Moderatori.username AS 'username_moderatore', Moderatori.email AS 'email_moderatore' FROM Richieste JOIN Moderatori ON Moderatori.id = Richieste.id_moderatore WHERE id_moderatore IS NOT NULL");
        const solvedRequests = [];
        for (let row of all) {
            const user = await retrieveUser(row.id_richiedente);
            let request = {
                id: row.id,
                request: {
                    id: row.id,
                    timestamp: row.timestamp_creazione,
                    user: user
                },
                moderator: {
                    id: row.id_moderatore,
                    username: row.username_moderatore,
                    email: row.email_moderatore
                },
                status: row.status,
                timestamp: row.timestamp_risoluzione
            };
            solvedRequests.push(request);
        }

        res.status(200).json(solvedRequests);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve solved requests"
        });
    }
}

module.exports = {
    counter,
    getFullSolvedReports,
    getFullSolvedRequests
}
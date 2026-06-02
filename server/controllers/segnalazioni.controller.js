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

async function getAllFullReports(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Segnalazioni WHERE id_moderatore IS NULL");
        if (!rows) {
            throw new Error("Error retrieving reports");
        }

        const reports = [];

        for (let report of rows) {
            const reporter = await retrieveUser(report.id_segnalante);
            const reportee = await retrieveUser(report.id_segnalato);

            reports.push({
                id: report.id,
                reporter: reporter,
                reportee: reportee,
                timestamp: report.timestamp_creazione,
                reason: report.motivazione
            });
        }

        res.status(200).json(reports);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error retrieving reports"
        });
    }
}

async function confirmReport(req, res) {
    try {
        const { idReport, idModerator, outcome } = req.body;
        if (!idReport || !idModerator || !outcome || isNaN(idReport) || isNaN(idModerator) || outcome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Invalid input data"
            });
        }

        let active_transactions = false;

        await dbutils.run("BEGIN TRANSACTION");
        active_transactions = true;

        await dbutils.run(
            "UPDATE Segnalazioni SET id_moderatore = ?, timestamp_risoluzione = ?, esito = ? WHERE id = ?",
            [
                idModerator,
                Date.now(),
                outcome,
                idReport
            ]
        );

        await dbutils.run("COMMIT");
        active_transactions = false;

        res.status(201).json({confirmed: true});
    } catch (err) {
        if (active_transactions)
            await dbutils.run("ROLLBACK");
        res.status(500).json({
            success: false,
            message: "Could not confirm report"
        })
    }
}

async function counter(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Segnalazioni WHERE id_moderatore IS NULL");
        if (!rows)
            throw new Error("Could not retrieve the number of reports");

        res.status(200).json(rows.length);
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Could not retrieve the number of reports"
        })
    } 
}

module.exports = {
    getAllFullReports,
    confirmReport,
    counter
}
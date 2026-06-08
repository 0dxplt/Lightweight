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

async function getAllFullRequests(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Richieste WHERE id_moderatore IS NULL");
        if (!rows) {
            throw new Error("Error retrieving reports");
        }

        const requests = [];
        for (let request of rows) {
            const requester = await retrieveUser(request.id_richiedente);
            requests.push({
                id: request.id,
                timestamp: request.timestamp_creazione,
                user: requester
            });
        }

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error retrieving requests"
        });
    }
}

async function approveRequest(req, res) {
    try {
        const { request, moderatorId } = req.body;
        if (!request || !moderatorId || isNaN(moderatorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data"
            });
        }

        let active_transaction = false;

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "UPDATE Richieste SET id_moderatore = ?, status = ?, timestamp_risoluzione = ? WHERE id = ?",
            [moderatorId, 'APPROVED', Date.now(), request.id]
        );

        const requester = request.user.id;
        await dbutils.run(
            "UPDATE Atleti SET verificato = ? WHERE id = ?",
            [1, requester]
        );

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({approved: true});
    } catch (err) {
        if (active_transaction)
            await dbutils.run("ROLLBACK");
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error approving request"
        });
    }
}

async function rejectRequest(req, res) {
    try {
        const { request, moderatorId } = req.body;
        if (!request || !moderatorId || isNaN(moderatorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data"
            });
        }

        let active_transaction = false;

        await dbutils.run("BEGIN TRANSACTION");
        active_transaction = true;

        await dbutils.run(
            "UPDATE Richieste SET id_moderatore = ?, status = ?, timestamp_risoluzione = ? WHERE id = ?",
            [moderatorId, 'REJECTED', Date.now(), request.id]
        );

        const requester = request.user.id;
        await dbutils.run(
            "UPDATE Atleti SET verificato = ? WHERE id = ?",
            [0, requester]
        );

        await dbutils.run("COMMIT");
        active_transaction = false;

        res.status(201).json({rejected: true});
    } catch (err) {
        if (active_transaction)
            await dbutils.run("ROLLBACK");
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error rejecting request"
        });
    }
}

async function counter(req, res) {
    try {
        const rows = await dbutils.all("SELECT * FROM Richieste WHERE id_moderatore IS NULL");
        if (!rows)
            throw new Error("Could not retrieve the number of requests");

        res.status(200).json(rows.length);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not retrieve the number of requests"
        })
    } 
}

module.exports = {
    getAllFullRequests,
    approveRequest,
    rejectRequest,
    counter
}
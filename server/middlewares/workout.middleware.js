const dbutils = require('../db/database.utils');

const canAccessWorkout = async (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({
            success: false,
            message: "You must be a user"
        });
    }

    const profileId = req.user.userId;
    const body = req.body;
    const workoutId = body.id;

    if (!workoutId) {
        return res.status(403).json({
            success: false,
            message: "You must specify the workout to delete"
        });
    }
    try {
        const row = await dbutils.get(
            `SELECT id_creatore FROM Workout WHERE id = ?`, [workoutId]);

        if (!row || row.id_creatore !== profileId) {
            return res.status(403).json({ error: "Accesso negato: non sei il proprietario di questo workout" });
        }

        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Errore interno del server." });
    }

}

module.exports = canAccessWorkout;
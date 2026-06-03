const dbutils = require('../db/database.utils');

async function getAllGyms(req, res) {
    try { 
        const rows = await dbutils.all("SELECT * FROM Palestre ORDER BY nome ASC");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            err: error.message
        });
    }
}

async function addGym(req, res) {
    try {
        const { name, address, lat, lng } = req.body;
        
        const row = await dbutils.get(
            "INSERT INTO Palestre (nome, indirizzo, lat, lng) VALUES (?, ?, ?, ?) RETURNING id",
            [name, address, lat, lng]
        );

        res.status(201).json({ success: true, message: "Gym created succesfully", gymId: row.id});
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Couldn't create gym"
        })
    }
}

module.exports = {
    getAllGyms,
    addGym
}
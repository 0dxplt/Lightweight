const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/database');

const config = require('./config/env');
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Rotte di test
app.get("/", (req, res) => {
    res.json({testo: "Hello, World!"});
});

// Routes
const routeEsercizi = require('./routes/esercizi.route.js');
const routeNazioni = require('./routes/nazioni.route.js');
const routePalestre = require('./routes/palestre.route.js');
const routeCitta = require('./routes/citta.route.js');
const routeGruppiMuscolari = require('./routes/gruppi-muscolari.route.js');
const routeModeratori = require('./routes/moderatori.route.js');

// APIs
app.use("/api/exercises", routeEsercizi);
app.use("/api/nations", routeNazioni);
app.use("/api/gyms", routePalestre);
app.use("/api/cities", routeCitta);
app.use("/api/muscolar-groups", routeGruppiMuscolari);
app.use("/api/moderators", routeModeratori);

app.listen(PORT, () => {
    console.log(`Server backend avviato sulla porta ${PORT}`);
});
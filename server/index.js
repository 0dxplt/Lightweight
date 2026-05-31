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

// Middlewares
const authMiddleware = require('./middlewares/auth.middleware.js');
const modMiddleware = require('./middlewares/mod.middleware.js');

// Routes
const routeEsercizi = require('./routes/esercizi.route.js');
const routeNazioni = require('./routes/nazioni.route.js');
const routePalestre = require('./routes/palestre.route.js');
const routeCitta = require('./routes/citta.route.js');
const routeGruppiMuscolari = require('./routes/gruppi-muscolari.route.js');
const routeUsers = require('./routes/users.route.js');
const routeRankings = require('./routes/rankings.route.js');
const routeAvatar = require('./routes/users-img.route.js');
const routeModeratori = require('./routes/moderatori.route.js');
const routeWorkout = require('./routes/workout.route.js');
const routeWorkouts = require('./routes/workouts.route.js');
const routeAuth = require('./routes/auth.route.js');

// APIs
app.use("/api/exercises", authMiddleware, routeEsercizi);
app.use("/api/nations", authMiddleware, routeNazioni);
app.use("/api/gyms", authMiddleware, routePalestre);
app.use("/api/cities", authMiddleware, routeCitta);
app.use("/api/muscolar-groups", authMiddleware, routeGruppiMuscolari);
app.use("/api/users", authMiddleware, routeUsers);
app.use("/api/rankings", authMiddleware, routeRankings);
app.use("/api/imgs/users", routeAvatar);
app.use("/api/moderators", authMiddleware, modMiddleware, routeModeratori);
app.use("/api/workout", authMiddleware, routeWorkout);
app.use("/api/workouts", authMiddleware, routeWorkouts);
app.use("/api/auth", routeAuth);

app.listen(PORT, () => {
    console.log(`Server backend avviato sulla porta ${PORT}`);
});